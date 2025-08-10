import React, { useState } from 'react';
import { User, Mail, Lock, Headphones, Mic, BookOpen } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignup) {
      // Create new user
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('lsrUser', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      // Mock login
      const user = {
        id: 1,
        name: formData.name || 'Student',
        email: formData.email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('lsrUser', JSON.stringify(user));
      onLogin(user);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero */}
        <div className="text-center md:text-left">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Master Your
              <span className="block text-blue-600">Placement Interviews</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Practice Listening, Speaking, and Reading skills with our comprehensive training platform
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Headphones className="text-blue-600" size={20} />
              </div>
              <span className="text-lg">Interactive Listening Exercises</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mic className="text-green-600" size={20} />
              </div>
              <span className="text-lg">Speaking Practice & Evaluation</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-orange-600" size={20} />
              </div>
              <span className="text-lg">Reading Comprehension Tests</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">LSR</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignup ? 'Start your interview preparation journey' : 'Continue your learning progress'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    required={isSignup}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;