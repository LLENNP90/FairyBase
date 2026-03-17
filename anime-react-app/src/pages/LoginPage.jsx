import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./Page.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successful, setSuccessful] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.loginUser({
                username,
                password
            });

            // Save token to localStorage ← THIS IS WHERE TOKEN IS STORED!
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSuccessful(data.message);
            setTimeout(() => {
                navigate('/');
            },2000);
             // Go to homepage
        } catch (err) {
            setError(err.response?.data?.error || "FUCK IS WRONG WITH");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>FairyBase</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="required">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim())}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="required">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {successful && <div className="successful-msg">{successful}</div>}

                <p className="auth-switch">
                    Don't have an account? 
                    <button onClick={() => navigate('/register')} className="link-btn">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;