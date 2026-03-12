import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Page.css";

function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password
            });

            alert('Account created! Please login.');
            navigate('/login');
            console.log(response)
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Create Account</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="required">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="required">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="required">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Choose a password (6+ characters)"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? 
                    <button onClick={() => navigate('/login')} className="link-btn">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;