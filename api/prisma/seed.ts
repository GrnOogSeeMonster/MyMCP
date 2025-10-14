import { PrismaClient, TaskStatus, TaskPriority, KnowledgeType } from '@prisma/client';
import { initialProjects } from '../ide-config-seed/initialProjects';
import { mockEntries } from '../ide-config-seed/mockKnowledge';
import { aiUserRules } from '../ide-config-seed/aiUserRules';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Projects and Tasks
  for (const projectData of initialProjects) {
    const { tasks, ...projectInfo } = projectData;
    await prisma.project.create({
      data: {
        ...projectInfo,
        tasks: {
          create: tasks.map(task => ({
            title: task.title,
            description: task.description,
            status: TaskStatus[task.status.replace(' ', '') as keyof typeof TaskStatus],
            priority: TaskPriority[task.priority as keyof typeof TaskPriority],
          })),
        },
      },
    });
  }
  console.log('Projects and tasks seeded.');

  // Seed Knowledge Entries
  for (const entry of mockEntries) {
    await prisma.knowledgeEntry.create({
      data: {
        ...entry,
        type: KnowledgeType[entry.type as keyof typeof KnowledgeType],
        tags: entry.tags as any, // Prisma expects Json type
      },
    });
  }
  console.log('Knowledge entries seeded.');

  // Seed AI User Rules
  for (const rule of aiUserRules) {
    await prisma.aiUserRule.create({
      data: {
        ...rule
      },
    });
  }
  console.log('AI user rules seeded.');

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    // FIX: Suppress TypeScript error for process.exit(1) due to likely missing Node.js types.
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });