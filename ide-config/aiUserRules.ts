export interface AiUserRule {
    id: string;
    title: string;
    description: string;
    category: 'Style' | 'Performance' | 'Security' | 'Best Practices';
    isActive: boolean;
}

export const aiUserRules: AiUserRule[] = [
    {
        id: 'rule-001',
        title: 'Prefer Async/Await over Promises',
        description: 'For asynchronous operations, use the async/await syntax to improve readability and simplify error handling.',
        category: 'Style',
        isActive: true,
    },
    {
        id: 'rule-002',
        title: 'Use Strict Equality (===)',
        description: 'Always use the strict equality operator (===) to avoid type coercion and potential bugs.',
        category: 'Best Practices',
        isActive: true,
    },
    {
        id: 'rule-003',
        title: 'Avoid Large Component States',
        description: 'Break down large components into smaller, more manageable ones with focused state.',
        category: 'Performance',
        isActive: false,
    },
    {
        id: 'rule-004',
        title: 'Sanitize User Inputs',
        description: 'Ensure all user-provided data is sanitized before being rendered or used in database queries to prevent XSS and injection attacks.',
        category: 'Security',
        isActive: true,
    }
];
