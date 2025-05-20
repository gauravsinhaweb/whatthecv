import { ANALYTICS_EVENTS, AnalyticsEvent } from './analyticsEvents';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const trackEvent = (eventName: AnalyticsEvent, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS[eventName], eventParams);
    }
};

export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.PAGE_VIEW, {
            page_path: url,
            page_title: document.title
        });
    }
};

export const trackError = (error: Error, context?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', ANALYTICS_EVENTS.ERROR_OCCURRED, {
            error_name: error.name,
            error_message: error.message,
            error_stack: error.stack,
            ...context
        });
    }
};

export const trackFeatureUsage = (featureName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'feature_usage', {
            feature_name: featureName,
            ...params
        });
    }
}; 