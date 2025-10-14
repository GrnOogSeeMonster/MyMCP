import { PrismaClient, TaskStatus, TaskPriority, KnowledgeType, FeatureAdoptionStatus } from '@prisma/client';
import { initialProjects } from '../ide-config-seed/initialProjects';
import { mockEntries } from '../ide-config-seed/mockKnowledge';
import { aiUserRules } from '../ide-config-seed/aiUserRules';
import { mcpFeatures } from '../ide-config-seed/mcpFeatures';
import { exit } from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Projects and Tasks
  for (const projectData of initialProjects) {
    const { tasks, ...projectInfo } = projectData;
    const project = await prisma.project.upsert({
      where: { id: projectInfo.id },
      update: {},
      create: projectInfo,
    });

    for (const task of tasks) {
        await prisma.task.upsert({
            where: { id: task.id },
            update: {},
            create: {
                ...task,
                projectId: project.id,
                status: TaskStatus[task.status as keyof typeof TaskStatus],
                priority: TaskPriority[task.priority as keyof typeof TaskPriority],
            }
        });
    }
  }
  console.log('Projects and tasks seeded.');

  // Seed Knowledge Entries
  for (const entry of mockEntries) {
    await prisma.knowledgeEntry.upsert({
      where: { id: entry.id },
      update: {},
      create: {
        ...entry,
        type: KnowledgeType[entry.type as keyof typeof KnowledgeType],
        tags: entry.tags as any, // Prisma expects Json type
      },
    });
  }
  console.log('Knowledge entries seeded.');

  // Seed AI User Rules
  for (const rule of aiUserRules) {
    await prisma.aiUserRule.upsert({
      where: { id: rule.id },
      update: {},
      create: {
        ...rule
      },
    });
  }
  console.log('AI user rules seeded.');

  // Seed MCP Features
  for (const feature of mcpFeatures) {
    await prisma.mcpFeature.upsert({
        where: { id: feature.id },
        update: {},
        create: {
            ...feature,
            inputs: feature.inputs as any,
            outputs: feature.outputs as any,
            examples: feature.examples as any,
            env: feature.env as any,
            adoptionStatus: FeatureAdoptionStatus[feature.adoptionStatus as keyof typeof FeatureAdoptionStatus],
        }
    });
  }
  console.log('MCP features seeded.');


  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    // FIX: Replaced process.exit(1) with imported exit(1) to fix TypeScript type error.
    exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });