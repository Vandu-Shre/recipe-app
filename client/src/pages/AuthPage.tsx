// client/src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormInput {
  email: string;
  password: string;
}

interface RegisterFormInput extends LoginFormInput {
  username: string;
}

type AuthFormData = LoginFormInput | RegisterFormInput;

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/recipes');
    }
  }, [user, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (formData: AuthFormData) => {
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register((formData as RegisterFormInput).username, formData.email, formData.password);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Authentication failed. Please try again.');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700 text-xl">
        Loading authentication...
      </div>
    );
  }

  if (user) {
     return null;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      // Background style is now handled globally in index.css
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {/* Passing the new button colors to AuthForm */}
        <AuthForm
          isRegister={!isLogin}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          buttonBgColor="bg-amber-800"         // NEW PROP: Pass background color
          buttonHoverColor="hover:bg-amber-900" // NEW PROP: Pass hover color
        />

        <p className="text-center text-gray-600 text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={toggleForm}
            className="text-amber-700 hover:text-amber-800 font-medium focus:outline-none" 
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;