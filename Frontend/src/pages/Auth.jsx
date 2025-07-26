import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../utils/axiosHelper';

const postLogin = (userData)=> api.post("/user/login" , userData )
const postSignup = (userData)=> api.post("/user/register" , userData )


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = location.state?.from?.pathname || '/dashboard';

  const {mutate : loginMutation} = useMutation({
    mutationKey : ["login"],
    mutationFn : ()=> postLogin(formData),
    onSuccess : (data)=>{
      // console.log("user logged in successfully",data);
      login(data.data.data.user , data.data.data.accessToken  );
      navigate(from, { replace: true });
    },
    onError : (error)=>{
      const parser = new DOMParser();
      const doc = parser.parseFromString(error.response.data, 'text/html');
      const msg = doc.querySelector('pre').textContent.split('at')[0].trim();
      setError(msg);
      // console.log("error in logging in", msg);
    }
  });

  const {mutate : signupMutation , error : signupError} = useMutation({
    mutationKey : ["signup"],
    mutationFn : ()=> postSignup(formData),
    onSuccess : (data)=>{
      // console.log("user signed up successfully",data);
      login(data.data.data.user , data.data.data.accessToken  );
      navigate(from, { replace: true });
    },
    onError : (error)=>{
      const parser = new DOMParser();
      const doc = parser.parseFromString(error.response.data, 'text/html');
      const msg = doc.querySelector('pre').textContent.split('at')[0].trim();
      setError(msg);
    }
  })



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) loginMutation();
    else signupMutation();

         
    // try {
    //   // Simulate API call
    //   const mockUser = {
    //     id: '1',
    //     username: formData.username || 'johndoe',
    //     email: formData.email,
    //     name: 'John Doe',
    //   };
    //   const mockToken = 'mock-jwt-token';

    //   // In a real app, you would make an API call here
    //   await new Promise(resolve => setTimeout(resolve, 1000));

    //   login(mockUser, mockToken);
    //   navigate(from, { replace: true });
    // } catch (err) {
    //   setError('Authentication failed. Please try again.');
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-1/2 right-1/6 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <div className="max-w-md w-full space-y-8 glass-card p-8 hover:shadow-2xl transition-all duration-300 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
        </div>
        
        {error && (
          <div className="glass-card bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required={!isLogin}
                className="w-full glass-card px-4 py-3 rounded-lg border border-white/20 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/25 bg-white/5 text-white placeholder-gray-300 transition-all duration-200"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full glass-card px-4 py-3 rounded-lg border border-white/20 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/25 bg-white/5 text-white placeholder-gray-300 transition-all duration-200"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full glass-card px-4 py-3 rounded-lg border border-white/20 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/25 bg-white/5 text-white placeholder-gray-300 transition-all duration-200"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full glass-card bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-700/90 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 drop-shadow-lg"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200 drop-shadow-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}