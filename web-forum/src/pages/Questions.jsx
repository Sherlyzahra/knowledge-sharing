import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../api';

function Questions({ user }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionService.getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to ask a question');
      return;
    }

    try {
      await questionService.createQuestion(formData);
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create question');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Questions</h1>
        {user && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Ask Question'}
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
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              minLength={20}
            />
          </div>

          <button type="submit" className="form-button">Post Question</button>
        </form>
      )}

      <div>
        {questions.length === 0 ? (
          <p>No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="card">
              <Link to={`/questions/${question.id}`} className="card-title">
                {question.title}
              </Link>
              <p className="card-content">
                {question.content.substring(0, 200)}...
              </p>
              <div className="card-meta">
                <span>{question.views} views</span>
                <span>{question.answer_count} answers</span>
                <span>{question.vote_count} votes</span>
                <span>{new Date(question.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Questions;
