import api from '../utils/api';

export enum NotificationType {
    TEMPLATE = "template",
    RECRUITER = "recruiter"
}

interface NotificationRequest {
    email: string;
    type: NotificationType;
}

interface NotificationResponse {
    message: string;
    email: string;
    type: NotificationType;
}

export async function subscribeToNotifications(
    email: string,
    type: NotificationType
): Promise<NotificationResponse> {
    const response = await api.post<NotificationResponse>('/notify', {
        email,
        type
    });
    return response.data;
} 