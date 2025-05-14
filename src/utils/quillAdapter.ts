import { observeDOM } from './domObserver';

/**
 * Keeps track of patched elements to avoid duplicate observers
 */
const patchedElements = new WeakSet();

/**
 * A completely different approach that monkeypatches the DOM APIs
 * to prevent any DOMNodeInserted events from being registered
 */
export function patchQuillLibrary(): () => void {
    if (typeof window === 'undefined') {
        return () => { };
    }

    // Store original methods
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // Create a no-op function to replace DOMNodeInserted listeners
    const noopListener = function () { };

    // Replace addEventListener
    EventTarget.prototype.addEventListener = function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        // For DOMNodeInserted, use a no-op function instead
        if (type === 'DOMNodeInserted') {
            return originalAddEventListener.call(this, type, noopListener, options);
        }

        // For everything else, use the original
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Return cleanup function
    return () => {
        EventTarget.prototype.addEventListener = originalAddEventListener;
    };
} 