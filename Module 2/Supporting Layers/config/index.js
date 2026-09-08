module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  dbUrl: process.env.DATABASE_URL,
  maxArticles: parseInt(process.env.MAX_ARTICLES) || 50,
};