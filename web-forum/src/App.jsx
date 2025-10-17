import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Import pages
import Home from './pages/Home';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <span className="logo-icon"></span> Knowledge
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/questions" className="nav-link">Questions</Link>
              </li>
              <li className="nav-item">
                <Link to="/blogs" className="nav-link">Blogs</Link>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Welcome, {user.username}</span>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="nav-button">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions user={user} />} />
            <Route path="/questions/:id" element={<QuestionDetail user={user} />} />
            <Route path="/blogs" element={<Blogs user={user} />} />
            <Route path="/blogs/:id" element={<BlogDetail user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
