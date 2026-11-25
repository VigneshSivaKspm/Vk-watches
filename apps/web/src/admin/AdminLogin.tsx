import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { apiRequest } from '../services/api';
import { VkLogo } from '../components/common/VkLogo';
import { Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@vktime.com');
  const [password, setPassword] = useState('Admin@VkTime2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.user.role !== 'SUPER_ADMIN' && res.user.role !== 'ADMIN') {
        setError('Unauthorized: Admin privilege clearance required.');
        return;
      }

      login(res.token, res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-pure flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-ivory p-8 sm:p-10 border border-platinum rounded-sm shadow-luxe space-y-6">
        <div className="text-center space-y-2">
          <VkLogo size="md" className="mx-auto" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pure border border-platinum rounded-full text-[10px] uppercase tracking-ultra text-gold font-medium mt-2">
            <Lock className="w-3 h-3" />
            <span>Master Administration Terminal</span>
          </div>
          <h1 className="font-serif-luxury text-2xl text-charcoal pt-1">Atelier Management Portal</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-silver block mb-1">Administrator Identity</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-pure border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="text-silver block mb-1">Security Credential</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-pure border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors font-medium mt-2"
          >
            {loading ? 'Authenticating Clearance...' : 'Access Admin Console'}
          </button>
        </form>

        <p className="text-[11px] text-silver text-center">
          Default seed credentials: <strong>admin@vktime.com</strong> / <strong>Admin@VkTime2026</strong>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
