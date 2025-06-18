export interface TokenAction {
    id: string;
    amount: number;
    name: string;
    description: string;
    category: TokenActionCategory;
    locked?: boolean;
}

export type TokenActionCategory = 'resume' | 'analysis' | 'template' | 'premium' | 'custom';

export const TOKEN_ACTION_CATEGORIES: TokenActionCategory[] = [
    'resume',
    'analysis',
    'template',
    'premium',
    'custom'
];

export interface TokenTransaction {
    id: string;
    action_id: string;
    token: number;
    available_token: number;
    timestamp: string;
} 