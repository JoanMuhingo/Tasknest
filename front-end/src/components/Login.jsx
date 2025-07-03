import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                if (onLogin) onLogin(); // <-- updates isAuth immediately
                console.log("Login successful");
                navigate("/home");
              } else {
                alert("Invalid credentials");
              }
            } catch (error) {
              console.error("Error logging in:", error);
            }
          };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account?<Link to ="/signup"> Signup </Link>
            </p>
        </div>
    );
};

export default Login;
