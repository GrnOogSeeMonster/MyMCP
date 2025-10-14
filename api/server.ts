import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { TaskStatus, TaskPriority, Project, Task, KnowledgeEntry, AiUserRule } from './types';


const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Projects API
app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(projects);
});

// Tasks API
app.post('/api/projects/:projectId/tasks', async (req, res) => {
    const { projectId } = req.params;
    const { title, description, priority } = req.body;
    const newTask = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            status: TaskStatus.ToDo,
            projectId: Number(projectId),
        }
    });
    res.status(201).json(newTask);
});

app.put('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, priority, status } = req.body;
    const updatedTask = await prisma.task.update({
        where: { id: Number(taskId) },
        data: { title, description, priority, status }
    });
    res.json(updatedTask);
});

app.delete('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    await prisma.task.delete({
        where: { id: Number(taskId) }
    });
    res.status(204).send();
});

// Knowledge Base API
app.get('/api/knowledge', async (req, res) => {
    const entries = await prisma.knowledgeEntry.findMany();
    res.json(entries);
});

app.post('/api/knowledge', async (req, res) => {
    // Note: In a real app, this would handle file uploads/crawling.
    // Here, we simulate creating an entry from modal data.
    const { title, type, sourceType, source, tags } = req.body;
    const newEntry = await prisma.knowledgeEntry.create({
        data: { title, type, sourceType, source, tags }
    });
    res.status(201).json(newEntry);
});

app.put('/api/knowledge/:id', async (req, res) => {
    const { id } = req.params;
    const { title, type, tags } = req.body;
    const updatedEntry = await prisma.knowledgeEntry.update({
        where: { id: Number(id) },
        data: { title, type, tags }
    });
    res.json(updatedEntry);
});

app.delete('/api/knowledge/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.knowledgeEntry.delete({
        where: { id: Number(id) }
    });
    res.status(204).send();
});

// User Rules API
app.get('/api/rules', async (req, res) => {
    const rules = await prisma.aiUserRule.findMany();
    res.json(rules);
});

app.put('/api/rules/:id', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const updatedRule = await prisma.aiUserRule.update({
        where: { id: String(id) },
        data: { isActive }
    });
    res.json(updatedRule);
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});

// Copy types from frontend to avoid duplication in this context
// In a real monorepo, these would be in a shared package.
export { TaskStatus, TaskPriority };
export type { Project, Task, KnowledgeEntry, AiUserRule };
