declare global {
    interface Window {
        dataLayer: any[];
    }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...eventParams
        });
    }
};

export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: 'page_view',
            page_path: url
        });
    }
}; 