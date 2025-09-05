import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { HiUser, HiMail, HiPhone, HiLockClosed } from 'react-icons/hi';
import { authApi } from '../api/notesApi';
import AuthIllustration from '../assets/Authentication-bro-CfbZv6IE.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    phone: ''
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
      // Basic client-side checks
      if (!/^[0-9]{1,3}$/.test(String(formData.age))) {
        throw new Error('Please enter a valid numeric age');
      }
      if (!/^[+0-9][0-9\-\s]{6,}$/.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      await authApi.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: Number(formData.age),
        phone: formData.phone.trim(),
      });
      navigate('/');
    } catch (err) {
      // The backend sometimes returns { msg: "..." }
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 pt-20 md:pt-24">
      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left side - Illustration / Hero */}
        <div className="relative hidden lg:flex flex-col items-center text-center px-8">
          <div className="relative w-[360px] h-[360px] mb-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full blur-2xl" />
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-black/5">
              <img src={AuthIllustration} alt="Authentication" className="h-56 w-56 md:h-72 md:w-72 object-contain" />
            </div>
          </div>
          <h2 className="relative z-10 text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Create your account</h2>
          <p className="relative z-10 text-gray-600 max-w-md">Join Note App to organize your thoughts, capture ideas, and stay productive anywhere.</p>
        </div>

        {/* Right side - Register Form */}
        <div className="flex-1 max-w-md mx-auto w-full z-10">
          <Card className="shadow-xl border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h1>
                <p className="text-gray-600">It only takes a minute</p>
              </div>

              {error && (
                <Alert color="failure" className="mb-4">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1">
                    <HiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                </div>
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
                  <Label htmlFor="age">Age</Label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="18"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="mt-1 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative mt-1">
                    <HiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+1 555 123 4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/" className="text-green-600 hover:text-green-700 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
