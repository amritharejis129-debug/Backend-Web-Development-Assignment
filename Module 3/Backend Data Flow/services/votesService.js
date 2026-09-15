const votesRepo = require('../repository/votesRepo');
const postsRepo = require('../repository/postsRepo');
const AppError = require('../utils/AppError');

exports.castVote = async (postId, userId) => {
  const post = await postsRepo.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existing = await votesRepo.find(postId, userId);
  if (existing) {
    throw new AppError('You have already voted on this post', 409);
  }

  return votesRepo.insert(postId, userId);
};