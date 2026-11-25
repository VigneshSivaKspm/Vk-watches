import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getJournalArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.journalArticle.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    return res.json(
      articles.map((a) => ({
        ...a,
        tags: JSON.parse(a.tags || '[]'),
      }))
    );
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve journal articles' });
  }
};

export const getJournalArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const article = await prisma.journalArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.json({
      ...article,
      tags: JSON.parse(article.tags || '[]'),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load article' });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return res.json({
      message: 'Welcome to the VK TIME Gazette. Your invitation has been confirmed.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Subscription failed' });
  }
};

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // In production, dispatch to concierge email
    return res.json({
      success: true,
      message: 'Your inquiry has been relayed to the VK TIME Horological Concierge. We respond within 24 business hours.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
