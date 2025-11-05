import { RequestHandler } from "express";

// Temporary in-memory storage - in production, use a database
let newsArticles = [
  {
    id: 1,
    title: "Новый сервер RSGS Invasion",
    content: "Мы запустили новый сервер со специальным режимом Invasion...",
    author: "Admin",
    date: new Date().toISOString(),
    published: true,
  },
  {
    id: 2,
    title: "Обновление серверных правил",
    content: "Обновлены правила поведения на серверах...",
    author: "Moderator",
    date: new Date(Date.now() - 86400000).toISOString(),
    published: true,
  },
];

let rules = {
  id: 1,
  title: "Игровые правила RSGS",
  content: `
# Основные правила сервера

## 1. Общие правила поведения
- Уважайте других игроков
- Запрещены оскорбления и токсичное поведение
- Используйте микрофон для командной игры

## 2. Игровые правила
- Следуйте указаниям Squad Leader
- Не покидайте отряд без разрешения
- Запрещено мешать союзным командам

## 3. Наказания
- Предупреждение
- Временный бан
- Постоянный бан
  `,
  lastUpdated: new Date().toISOString(),
};

let privacyPolicy = {
  id: 1,
  title: "Политика конфиденциальности",
  content: `
# Политика конфиденциальности RSGS

## Сбор информации
Мы ��обираем следующие данные:
- Steam ID для идентификации игроков
- Игровая статистика
- Сообщения в чате (для модерации)

## Использование данных
Данные используются для:
- Обеспечения функционирования серверов
- Модерации и поддержания порядка
- Улучшения игрового опыта

## Защита данных
Мы принимаем меры для защиты ваших данных...
  `,
  lastUpdated: new Date().toISOString(),
};

let terms = {
  id: 1,
  title: "Пользовательское соглашение (Офферта)",
  content: `
# Пользовательское соглашение

## 1. Предмет соглашения
Настоящее соглашение регулирует отношения между администрацией RSGS и пользователями серверов.

## 2. Права и обязанности пользователей
- Соблюдение правил сервера
- Уважительное отношение к другим игрокам
- Запрет на использование читов и модификаций

## 3. Ответственность
- Администрация не несет ответственность за действия игроков
- Пользователи несут полную ответственность за свои действия

## 4. VIP статус
- VIP статус предоставляется на платной основе
- Включает дополнительные привилегии
- Не подлежит возврату после использования
  `,
  lastUpdated: new Date().toISOString(),
};

// News endpoints
export const getNews: RequestHandler = (req, res) => {
  const published = newsArticles.filter(article => article.published);
  res.json(published);
};

export const getNewsById: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const article = newsArticles.find(a => a.id === id && a.published);
  
  if (!article) {
    return res.status(404).json({ error: "Новость не найдена" });
  }
  
  res.json(article);
};

export const createNews: RequestHandler = (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: "Заголовок и содержимое обязательны" });
  }
  
  const newArticle = {
    id: Math.max(...newsArticles.map(a => a.id)) + 1,
    title,
    content,
    author: author || "Admin",
    date: new Date().toISOString(),
    published: true,
  };
  
  newsArticles.push(newArticle);
  res.status(201).json(newArticle);
};

export const updateNews: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, published } = req.body;
  
  const articleIndex = newsArticles.findIndex(a => a.id === id);
  if (articleIndex === -1) {
    return res.status(404).json({ error: "Новость не найдена" });
  }
  
  if (title) newsArticles[articleIndex].title = title;
  if (content) newsArticles[articleIndex].content = content;
  if (typeof published === 'boolean') newsArticles[articleIndex].published = published;
  
  res.json(newsArticles[articleIndex]);
};

export const deleteNews: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const articleIndex = newsArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) {
    return res.status(404).json({ error: "Новость не найдена" });
  }
  
  newsArticles.splice(articleIndex, 1);
  res.json({ message: "Новость удалена" });
};

// Rules endpoints
export const getRules: RequestHandler = (req, res) => {
  res.json(rules);
};

export const updateRules: RequestHandler = (req, res) => {
  const { title, content } = req.body;
  
  if (title) rules.title = title;
  if (content) rules.content = content;
  rules.lastUpdated = new Date().toISOString();
  
  res.json(rules);
};

// Privacy policy endpoints
export const getPrivacyPolicy: RequestHandler = (req, res) => {
  res.json(privacyPolicy);
};

export const updatePrivacyPolicy: RequestHandler = (req, res) => {
  const { title, content } = req.body;
  
  if (title) privacyPolicy.title = title;
  if (content) privacyPolicy.content = content;
  privacyPolicy.lastUpdated = new Date().toISOString();
  
  res.json(privacyPolicy);
};

// Terms endpoints
export const getTerms: RequestHandler = (req, res) => {
  res.json(terms);
};

export const updateTerms: RequestHandler = (req, res) => {
  const { title, content } = req.body;
  
  if (title) terms.title = title;
  if (content) terms.content = content;
  terms.lastUpdated = new Date().toISOString();
  
  res.json(terms);
};
