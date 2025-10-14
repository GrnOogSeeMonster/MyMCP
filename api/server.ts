import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { TaskStatus } from './types';


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
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Tasks API
app.post('/api/projects/:projectId/tasks', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Failed to create task:', error);
        res.status(500).json({ message: 'Failed to create task' });
    }
});

app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, priority, status } = req.body;
        const updatedTask = await prisma.task.update({
            where: { id: Number(taskId) },
            data: { title, description, priority, status }
        });
        res.json(updatedTask);
    } catch (error) {
        console.error('Failed to update task:', error);
        res.status(500).json({ message: 'Failed to update task' });
    }
});

app.delete('/api/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        await prisma.task.delete({
            where: { id: Number(taskId) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

// Knowledge Base API
app.get('/api/knowledge', async (req, res) => {
    try {
        const entries = await prisma.knowledgeEntry.findMany();
        res.json(entries);
    } catch (error) {
        console.error('Failed to fetch knowledge entries:', error);
        res.status(500).json({ message: 'Failed to fetch knowledge entries' });
    }
});

app.post('/api/knowledge', async (req, res) => {
    try {
        const { title, type, sourceType, source, tags } = req.body;
        const newEntry = await prisma.knowledgeEntry.create({
            data: { title, type, sourceType, source, tags }
        });
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Failed to create knowledge entry:', error);
        res.status(500).json({ message: 'Failed to create knowledge entry' });
    }
});

app.put('/api/knowledge/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, tags } = req.body;
        const updatedEntry = await prisma.knowledgeEntry.update({
            where: { id: Number(id) },
            data: { title, type, tags }
        });
        res.json(updatedEntry);
    } catch (error) {
        console.error('Failed to update knowledge entry:', error);
        res.status(500).json({ message: 'Failed to update knowledge entry' });
    }
});

app.delete('/api/knowledge/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.knowledgeEntry.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete knowledge entry:', error);
        res.status(500).json({ message: 'Failed to delete knowledge entry' });
    }
});

// User Rules API
app.get('/api/rules', async (req, res) => {
    try {
        const rules = await prisma.aiUserRule.findMany();
        res.json(rules);
    } catch (error) {
        console.error('Failed to fetch user rules:', error);
        res.status(500).json({ message: 'Failed to fetch user rules' });
    }
});

app.put('/api/rules/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const updatedRule = await prisma.aiUserRule.update({
            where: { id: String(id) },
            data: { isActive }
        });
        res.json(updatedRule);
    } catch (error) {
        console.error('Failed to update user rule:', error);
        res.status(500).json({ message: 'Failed to update user rule' });
    }
});

// MCP Features API
app.get('/api/features', async (req, res) => {
    try {
      const features = await prisma.mcpFeature.findMany({
        orderBy: { label: 'asc' },
      });
      res.json(features);
    } catch (error) {
      console.error('Failed to fetch features:', error);
      res.status(500).json({ message: 'Failed to fetch features' });
    }
});

app.post('/api/features', async (req, res) => {
    try {
        const { id, ...featureData } = req.body;
        const newFeature = await prisma.mcpFeature.create({
            data: featureData
        });
        res.status(201).json(newFeature);
    } catch (error) {
        console.error('Failed to create feature:', error);
        res.status(500).json({ message: 'Failed to create feature' });
    }
});

app.put('/api/features/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { id: bodyId, ...featureData } = req.body;
        const updatedFeature = await prisma.mcpFeature.update({
            where: { id: String(id) },
            data: featureData
        });
        res.json(updatedFeature);
    } catch (error) {
        console.error('Failed to update feature:', error);
        res.status(500).json({ message: 'Failed to update feature' });
    }
});

app.delete('/api/features/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.mcpFeature.delete({
            where: { id: String(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete feature:', error);
        res.status(500).json({ message: 'Failed to delete feature' });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});