let posts = [
  { id: '1', title: 'First Post', content: 'Hello world', likes: 0 },
  { id: '2', title: 'Second Post', content: 'API Design Best Practices', likes: 3 }
];

export const getAllPosts = () => posts;

export const getPostById = (id) => posts.find((p) => p.id === String(id));

export const createPost = ({ title, content }) => {
  const newPost = {
    id: String(posts.length + 1),
    title,
    content: content || '',
    likes: 0
  };
  posts.push(newPost);
  return newPost;
};

export const likePost = (id) => {
  const post = getPostById(id);
  if (!post) return null;
  post.likes += 1;
  return post;
};