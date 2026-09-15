const commentsRepo = require('../repository/commentsRepo');
const postsRepo = require('../repository/postsRepo');
const AppError = require('../utils/AppError');

exports.addComment = async (postId, userId, body) => {
  const post = await postsRepo.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  const comment = await commentsRepo.insert({ postId, authorId: userId, body });
  await postsRepo.incrementCommentCount(postId);

  return comment;
};