import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { apiRequest } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.user);
      if (res.user.role === 'SUPER_ADMIN' || res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@vktime.com');
      setPassword('Admin@VkTime2026');
    } else {
      setEmail('customer@vktime.com');
      setPassword('Customer@123');
    }
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-pure p-8 sm:p-10 border border-platinum rounded-sm shadow-luxe space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">VK Horological Account</span>
          <h1 className="font-serif-luxury text-3xl text-charcoal">Sign In to Your Account</h1>
          <p className="text-xs text-silver">Access saved timepieces, order ledger, and concierge services.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-silver block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-silver">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors font-medium mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill helper */}
        <div className="p-4 bg-ivory border border-platinum/80 rounded-sm space-y-2 text-xs">
          <p className="text-[10px] uppercase tracking-wider text-gold font-medium">Pre-Configured Demo Accounts</p>
          <div className="flex gap-2">
            <button
              onClick={() => useDemoCredentials('customer')}
              className="flex-1 py-1.5 bg-pure border border-platinum text-charcoal hover:border-charcoal text-[11px]"
            >
              Demo Client
            </button>
            <button
              onClick={() => useDemoCredentials('admin')}
              className="flex-1 py-1.5 bg-pure border border-platinum text-charcoal hover:border-charcoal text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-graphite border-t border-platinum pt-4">
          <span>Do not have an account? </span>
          <Link to="/register" className="text-charcoal font-medium underline hover:text-gold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      });
      login(res.token, res.user);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-pure p-8 sm:p-10 border border-platinum rounded-sm shadow-luxe space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">New Client Registration</span>
          <h1 className="font-serif-luxury text-3xl text-charcoal">Join VK TIME</h1>
          <p className="text-xs text-silver">Receive bespoke release invitations and lifetime warranty registration.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-silver block mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="text-silver block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="text-silver block mb-1">Telephone / Mobile</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 00000 00000"
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="text-silver block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors font-medium mt-2"
          >
            {loading ? 'Creating Client Profile...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-graphite border-t border-platinum pt-4">
          <span>Already registered? </span>
          <Link to="/login" className="text-charcoal font-medium underline hover:text-gold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
