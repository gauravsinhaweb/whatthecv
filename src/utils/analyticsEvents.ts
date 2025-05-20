export const ANALYTICS_EVENTS = {
    // Resume Creation Events
    RESUME_CREATION_START: 'resume_creation_start',
    RESUME_EXPORT: 'resume_export',
    RESUME_SAVE: 'resume_save',

    // Section Events
    SECTION_ADD: 'section_add',
    SECTION_EDIT: 'section_edit',
    SECTION_DELETE: 'section_delete',

    // Resume Analysis Events
    RESUME_UPLOAD: 'resume_upload',
    RESUME_ANALYSIS_START: 'resume_analysis_start',
    RESUME_ANALYSIS_COMPLETE: 'resume_analysis_complete',
    AI_IMPROVEMENT_REQUEST: 'ai_improvement_request',

    // Navigation Events
    PAGE_VIEW: 'page_view',
    NAVIGATION_CLICK: 'navigation_click',

    // Feature Usage
    PROFILE_PICTURE_UPLOAD: 'profile_picture_upload',
    SOCIAL_LINK_ADD: 'social_link_add',
    SKILL_ADD: 'skill_add',
    PROJECT_ADD: 'project_add',

    // Error Events
    ERROR_OCCURRED: 'error_occurred',
    UPLOAD_ERROR: 'upload_error',
    EXPORT_ERROR: 'export_error'
} as const;

export type AnalyticsEvent = keyof typeof ANALYTICS_EVENTS; 