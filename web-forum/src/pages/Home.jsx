import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '3rem 0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>
          📚
        </div>
        <h1 className="page-title" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          Welcome to Knowledge
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '2rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          A modern microservices platform where curious minds meet to ask questions, share insights, and learn together
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/questions">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Questions
            </button>
          </Link>
          <Link to="/blogs">
            <button style={{ 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
            }}>
              Read Blogs
            </button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h2 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.5rem' }}>Ask & Answer</h2>
          <p className="card-content">
            Post your programming questions and get expert answers from the community. Help others by sharing your knowledge.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h2 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.5rem' }}>Write Articles</h2>
          <p className="card-content">
            Create in-depth technical blog posts, tutorials, and guides to share your expertise with developers worldwide.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <h2 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.5rem' }}>Vote & Engage</h2>
          <p className="card-content">
            Upvote helpful content, downvote what doesn't work, and build your reputation in the community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
