import { KnowledgeType } from '../types';

export const mockEntries = [
  { id: 1, type: KnowledgeType.Technical, sourceType: 'crawl', source: 'https://react.dev/learn', title: 'React Official Docs', tags: ['react', 'frontend', 'javascript', 'api'] },
  { id: 2, type: KnowledgeType.Business, sourceType: 'crawl', source: 'https://stripe.com/docs/api', title: 'Stripe API Reference', tags: ['payment', 'api', 'business', 'finance'] },
  { id: 3, type: KnowledgeType.Technical, sourceType: 'crawl', source: 'https://tailwindcss.com/docs/installation', title: 'Tailwind CSS Docs', tags: ['css', 'frontend', 'utility-first', 'design'] },
  { id: 4, type: KnowledgeType.Technical, sourceType: 'upload', source: 'Internal Project Readme.md', title: 'Internal Project Readme', tags: ['internal', 'project-mcp', 'readme', 'docs'] },
];
