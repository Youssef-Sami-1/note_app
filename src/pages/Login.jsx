import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { authApi } from '../api/notesApi';
import AuthIllustration from '../assets/Authentication-bro-CfbZv6IE.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authApi.login(formData);
      navigate('/notes');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 md:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - Hero */}
          <div className="relative hidden lg:flex flex-col items-center text-center px-8">
            <div className="relative w-[340px] h-[340px] mb-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full blur-2xl" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
                <img src={AuthIllustration} alt="Authentication" className="h-56 w-56 md:h-72 md:w-72 object-contain" />
              </div>
            </div>
            <h2 className="relative z-10 text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome back</h2>
            <p className="relative z-10 text-gray-600 max-w-md">Sign in to access your notes and keep your ideas in sync across devices.</p>
          </div>

          {/* Right - Form */}
          <div className="flex-1 max-w-md mx-auto w-full z-10">
            <Card className="shadow-xl border border-gray-100 rounded-2xl overflow-hidden bg-white">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
                  <p className="text-gray-600">We're happy to see you again</p>
                </div>

                {error && (
                  <Alert color="failure" className="mb-4">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <HiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <HiLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 rounded-full h-12 text-base font-semibold"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
