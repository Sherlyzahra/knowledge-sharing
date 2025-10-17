import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { questionService } from '../api';

function QuestionDetail({ user }) {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [voteStats, setVoteStats] = useState({ upvotes: 0, downvotes: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerContent, setAnswerContent] = useState('');

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      const [questionRes, answersRes, votesRes] = await Promise.all([
        questionService.getQuestion(id),
        questionService.getAnswersByQuestion(id),
        questionService.getVoteStats(id),
      ]);

      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
      setVoteStats(votesRes.data);
    } catch (err) {
      setError('Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      setError('Please login to vote');
      return;
    }

    try {
      await questionService.createVote({ question_id: parseInt(id), vote_type: voteType });
      const votesRes = await questionService.getVoteStats(id);
      setVoteStats(votesRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to vote');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to answer');
      return;
    }

    try {
      await questionService.createAnswer({
        question_id: parseInt(id),
        content: answerContent,
      });
      setAnswerContent('');
      fetchQuestionDetails();
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post answer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!question) return <div>Question not found</div>;

  return (
    <div>
      <div className="card">
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{question.title}</h1>
        <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{question.content}</p>
        
        <div className="card-meta" style={{ marginBottom: '1rem' }}>
          <span>{question.views} views</span>
          <span>{new Date(question.created_at).toLocaleDateString()}</span>
        </div>

        <div className="vote-buttons">
          <button className="vote-button" onClick={() => handleVote('upvote')}>
            ↑ Upvote
          </button>
          <span className="vote-count">{voteStats.total}</span>
          <button className="vote-button" onClick={() => handleVote('downvote')}>
            ↓ Downvote
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h2 style={{ margin: '2rem 0 1rem 0' }}>{answers.length} Answers</h2>

      {answers.map((answer) => (
        <div key={answer.id} className="card">
          <p style={{ whiteSpace: 'pre-wrap' }}>{answer.content}</p>
          <div className="card-meta">
            <span>User ID: {answer.user_id}</span>
            <span>{new Date(answer.created_at).toLocaleDateString()}</span>
            {answer.is_accepted && <span style={{ color: '#51cf66' }}>✓ Accepted</span>}
          </div>
        </div>
      ))}

      {user && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className="form-textarea"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              required
              minLength={20}
            />
            <button type="submit" className="form-button" style={{ marginTop: '1rem' }}>
              Post Answer
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p>Please login to post an answer</p>
        </div>
      )}
    </div>
  );
}

export default QuestionDetail;
