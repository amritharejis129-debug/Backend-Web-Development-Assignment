const articlesRepo = require('../repository/articlesRepo');
const AppError = require('../utils/AppError');
const config = require('../config');

exports.listArticles = async () => {
  return await articlesRepo.findAll();
};

exports.createArticle = async (data) => {
  const articles = await articlesRepo.findAll();
  if (articles.length >= config.maxArticles) {
    throw new AppError('Article limit reached', 403);
  }
  return await articlesRepo.create(data);
};

exports.getArticleById = async (id) => {
  const article = await articlesRepo.findById(id);
  if (!article) {
    throw new AppError('Article not found', 404);
  }
  return article;
};

exports.updateArticle = async (id, data) => {
  await exports.getArticleById(id);
  return await articlesRepo.update(id, data);
};

exports.deleteArticle = async (id) => {
  await exports.getArticleById(id);
  return await articlesRepo.remove(id);
};