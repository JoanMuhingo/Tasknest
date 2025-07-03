import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // ✅ CORRECT HOOK

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                navigate('/login'); // ✅ REDIRECT USING useNavigate
            } else {
                alert('Sign-up failed');
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
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
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Have an account? <Link to='/login'>Login</Link>
            </p>
        </div>
    );
};

export default SignUp;
