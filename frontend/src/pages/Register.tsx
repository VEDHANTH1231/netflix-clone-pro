import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register: React.FC = () => {
  const { register, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear auth error on mount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, []);

  const handleInputChange = () => {
    if (formError) setFormError(null);
    if (authError) clearError();
  };

  const validateForm = () => {
    if (!name || !email || !password) {
      setFormError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err: any) {
      // Error will be displayed via authError from AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 20px',
      background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcca-5db37a38f11b/514c2199-2280-4d85-8174-9cd0999fb219/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '60px 68px 40px',
        width: '100%',
        maxWidth: '450px',
        borderRadius: '4px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '28px', color: 'var(--text-white)' }}>Sign Up</h2>
        
        {/* Error Messages */}
        {(formError || authError) && (
          <div style={{
            backgroundColor: '#e87c03',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}>
            {formError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="First Name" 
            value={name}
            onChange={(e) => { setName(e.target.value); handleInputChange(); }}
            style={{
              padding: '16px 20px',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
            style={{
              padding: '16px 20px',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
            style={{
              padding: '16px 20px',
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#555' : 'var(--netflix-red)',
              color: '#fff',
              padding: '16px',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '4px',
              marginTop: '24px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--netflix-red-hover)'; }}
            onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--netflix-red)'; }}
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        
        <div style={{ marginTop: '40px', fontSize: '1rem', color: '#737373' }}>
          Already have an account? <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Sign in now</Link>.
        </div>
      </div>
    </div>
  );
};
export default Register;
