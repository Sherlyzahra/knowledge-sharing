import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../api';

function BlogDetail({ user }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await blogService.getBlog(id);
      setBlog(response.data);
    } catch (err) {
      setError('Failed to load blog article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog article not found</div>;

  return (
    <div>
      <div className="card">
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{blog.title}</h1>
        
        {blog.summary && (
          <p style={{ 
            fontStyle: 'italic', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(100, 108, 255, 0.1)',
            borderRadius: '4px'
          }}>
            {blog.summary}
          </p>
        )}

        <div className="card-meta" style={{ marginBottom: '2rem' }}>
          <span>By User ID: {blog.user_id}</span>
          <span>{blog.views} views</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>

        <div style={{ 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.8',
          fontSize: '1.1rem'
        }}>
          {blog.content}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default BlogDetail;
