import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8001';
const QUESTION_API_URL = 'http://localhost:8002';
const BLOG_API_URL = 'http://localhost:8003';

// Create axios instances
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const questionApi = axios.create({
  baseURL: QUESTION_API_URL,
});

const blogApi = axios.create({
  baseURL: BLOG_API_URL,
});

// Add token to requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addAuthToken);
questionApi.interceptors.request.use(addAuthToken);
blogApi.interceptors.request.use(addAuthToken);

// Auth Service API
export const authService = {
  register: (userData) => authApi.post('/auth/register', userData),
  login: (credentials) => authApi.post('/auth/login', credentials),
  getMe: () => authApi.get('/auth/me'),
  refreshToken: (refreshToken) => authApi.post('/auth/refresh', { refresh_token: refreshToken }),
};

// Question Service API
export const questionService = {
  getQuestions: (skip = 0, limit = 20) => questionApi.get(`/questions?skip=${skip}&limit=${limit}`),
  getQuestion: (id) => questionApi.get(`/questions/${id}`),
  createQuestion: (questionData) => questionApi.post('/questions', questionData),
  updateQuestion: (id, questionData) => questionApi.put(`/questions/${id}`, questionData),
  deleteQuestion: (id) => questionApi.delete(`/questions/${id}`),
  
  // Answers
  getAnswersByQuestion: (questionId) => questionApi.get(`/answers/question/${questionId}`),
  createAnswer: (answerData) => questionApi.post('/answers', answerData),
  
  // Votes
  createVote: (voteData) => questionApi.post('/votes', voteData),
  getVoteStats: (questionId) => questionApi.get(`/votes/question/${questionId}/stats`),
};

// Blog Service API
export const blogService = {
  getBlogs: (skip = 0, limit = 20) => blogApi.get(`/blogs?skip=${skip}&limit=${limit}`),
  getBlog: (id) => blogApi.get(`/blogs/${id}`),
  createBlog: (blogData) => blogApi.post('/blogs', blogData),
  updateBlog: (id, blogData) => blogApi.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => blogApi.delete(`/blogs/${id}`),
  getBlogsByUser: (userId, skip = 0, limit = 20) => 
    blogApi.get(`/blogs/user/${userId}?skip=${skip}&limit=${limit}`),
};

export default {
  authService,
  questionService,
  blogService,
};
