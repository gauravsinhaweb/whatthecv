/**
 * This file contains utilities to patch the Quill library's internal implementation
 * to address the DOMNodeInserted deprecation warnings
 */

/**
 * Directly patches the Quill library in the window object after it's loaded
 * This modifies the Scroll class to use MutationObserver instead of DOMNodeInserted
 */
export function patchQuillInternals(): () => void {
    // For SSR compatibility
    if (typeof window === 'undefined') {
        return () => { };
    }

    // Simple but effective debounce implementation
    const createDebouncer = (func: Function, wait = 100) => {
        let timeout: any = null;
        return function (...args: any[]) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    // Check if the window object is available and wait for Quill to be loaded
    const checkAndPatchQuill = () => {
        // Try to access the Quill object through various paths
        const quillPaths = [
            () => (window as any).Quill,
            () => (window as any).ReactQuill?.Quill,
            () => (window as any).ReactQuill?.default?.Quill,
        ];

        let Quill;
        for (const getQuill of quillPaths) {
            try {
                Quill = getQuill();
                if (Quill) break;
            } catch (e) {
                // Continue to the next path
            }
        }

        if (!Quill) {
            // Quill not loaded yet, try again later
            setTimeout(checkAndPatchQuill, 100);
            return;
        }

        try {
            // Get Scroll class from Quill
            const Scroll = Quill.import('blots/scroll');

            if (Scroll && Scroll.prototype) {
                // Store original method
                const originalInitialize = Scroll.prototype.initialize;

                // Create patched version
                Scroll.prototype.initialize = function (...args: any[]) {
                    // Call original initialize
                    const result = originalInitialize.apply(this, args);

                    // Replace DOMNodeInserted event with MutationObserver
                    if (this.domNode) {
                        // Create a heavily debounced update function
                        const debouncedUpdate = createDebouncer(() => {
                            // Only update if not already updating and if the element is still in the DOM
                            if (!(this as any)._updating && document.contains(this.domNode)) {
                                this.update();
                            }
                        }, 150);

                        const observer = new MutationObserver(() => {
                            debouncedUpdate();
                        });

                        // Only observe minimal changes needed for Quill functionality
                        observer.observe(this.domNode, {
                            childList: true,
                            // Limit the scope to reduce performance impact
                            subtree: false,
                            characterData: false,
                            attributes: false,
                        });

                        // Store observer for potential cleanup
                        (this as any)._mutationObserver = observer;
                    }

                    return result;
                };

                // Patch update method to avoid using DOMNodeInserted
                if (Scroll.prototype.update) {
                    const originalUpdate = Scroll.prototype.update;

                    Scroll.prototype.update = function (...args: any[]) {
                        // Prevent infinite loops if update is triggered by MutationObserver
                        if ((this as any)._updating) return;

                        // Set updating flag
                        (this as any)._updating = true;

                        // Call original update method
                        let result;
                        try {
                            result = originalUpdate.apply(this, args);
                        } catch (e) {
                            console.error('Error in Quill update:', e);
                        } finally {
                            // Always reset the updating flag, even if an error occurs
                            (this as any)._updating = false;
                        }

                        return result;
                    };
                }

                console.log('Successfully patched Quill Scroll class with optimized observer');
            }
        } catch (e) {
            console.error('Error patching Quill:', e);
        }
    };

    // Start the patching process
    checkAndPatchQuill();

    // Return a no-op cleanup function (patching is permanent for this session)
    return () => { };
} 