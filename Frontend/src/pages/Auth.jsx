import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { api } from '../utils/axiosHelper';
import { useMutation, useQuery } from '@tanstack/react-query'

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

  const {mutate} = useMutation({
    mutationKey : ["login"],
    mutationFn : ()=> postLogin(formData),
    onSuccess : (data)=>{
      console.log("user logged in successfully",data);
      login(data.data.data.user , data.data.data.accessToken  );
      navigate(from, { replace: true });
    }
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    mutate();
         
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required={!isLogin}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}