import { useEffect, useRef, useCallback } from 'react';

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * Implements proper TypeScript typing and cleanup.
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 100
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let shouldRun = false;

    // Return the debounced function
    return function (this: any, ...args: Parameters<T>): void {
        const context = this;
        lastArgs = args;
        shouldRun = true;

        // If there's no active timeout, start one
        if (timeoutId === null) {
            // Create a time loop that respects the wait period
            const executeOnTimeout = () => {
                timeoutId = null;

                if (shouldRun && lastArgs) {
                    shouldRun = false;
                    const currentArgs = lastArgs;
                    lastArgs = null;

                    try {
                        func.apply(context, currentArgs);
                    } catch (e) {
                        console.error('Error in debounced function:', e);
                    }

                    // Set up the next execution if needed
                    timeoutId = setTimeout(executeOnTimeout, wait);
                }
            };

            // Start the timeout loop
            timeoutId = setTimeout(executeOnTimeout, wait);
        }
    };
}

/**
 * Hook to observe DOM mutations on a target element
 * Uses proper cleanup, stable callbacks, and type safety
 */
export const useDOMObserver = (
    targetRef: React.RefObject<Element>,
    callback: () => void,
    config: MutationObserverInit = { childList: true, subtree: true },
    debounceTime: number = 50
): void => {
    // Store the callback in a ref to avoid recreation on every render
    const callbackRef = useRef(callback);

    // Update the callback ref when the callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Create a stable debounced callback with optimized performance
    const debouncedCallback = useCallback(
        debounce(() => {
            if (document.contains(targetRef.current)) {
                callbackRef.current();
            }
        }, debounceTime),
        [debounceTime, targetRef]
    );

    useEffect(() => {
        const target = targetRef.current;
        if (!target) return;

        // Create an observer with error handling
        let observer: MutationObserver;
        try {
            observer = new MutationObserver(() => {
                // Only trigger updates if the element is still in the DOM
                if (document.contains(target)) {
                    debouncedCallback();
                }
            });

            observer.observe(target, config);
        } catch (e) {
            console.error('Error setting up MutationObserver in hook:', e);
            return;
        }

        // Clean up the observer when the component unmounts
        return () => {
            try {
                observer.disconnect();
            } catch (e) {
                console.error('Error disconnecting MutationObserver:', e);
            }
        };
    }, [targetRef, debouncedCallback, config]);
};

/**
 * Utility function to observe DOM mutations on a target element
 * Returns a cleanup function for proper resource management
 */
export const observeDOM = (
    target: Node,
    callback: () => void,
    config: MutationObserverInit = { childList: true, subtree: true },
    debounceTime: number = 50
): () => void => {
    if (!target || !(target instanceof Node)) {
        console.error('Invalid target provided to observeDOM');
        return () => { };
    }

    // Create a debounced version of the callback with thresholding
    const debouncedCallback = debounce(() => {
        // Only execute if the target is still in the document
        if (document.contains(target)) {
            try {
                callback();
            } catch (e) {
                console.error('Error in MutationObserver callback:', e);
            }
        }
    }, debounceTime);

    // Create and start the observer
    let observer: MutationObserver;
    try {
        observer = new MutationObserver(() => {
            debouncedCallback();
        });

        observer.observe(target, config);
    } catch (e) {
        console.error('Error setting up MutationObserver:', e);
        return () => { };
    }

    // Return cleanup function
    return () => {
        try {
            observer.disconnect();
        } catch (e) {
            console.error('Error disconnecting MutationObserver:', e);
        }
    };
}; 