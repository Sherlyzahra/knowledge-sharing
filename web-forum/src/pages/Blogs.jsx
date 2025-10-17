import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../api';

function Blogs({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    is_published: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getBlogs();
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to create a blog');
      return;
    }

    try {
      await blogService.createBlog(formData);
      setFormData({ title: '', content: '', summary: '', is_published: true });
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create blog');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Blog Articles</h1>
        {user && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write Article'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              minLength={5}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <input
              type="text"
              className="form-input"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '300px' }}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              minLength={50}
            />
          </div>

          <button type="submit" className="form-button">Publish Article</button>
        </form>
      )}

      <div>
        {blogs.length === 0 ? (
          <p>No blog articles yet. Be the first to write!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="card">
              <Link to={`/blogs/${blog.id}`} className="card-title">
                {blog.title}
              </Link>
              {blog.summary && (
                <p style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                  {blog.summary}
                </p>
              )}
              <p className="card-content">
                {blog.content.substring(0, 300)}...
              </p>
              <div className="card-meta">
                <span>{blog.views} views</span>
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Blogs;
