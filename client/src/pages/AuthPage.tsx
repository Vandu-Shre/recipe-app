import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import LoginPageImg from '../assets/LoginPage.jpg';

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
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl font-[Poppins]">
        Loading authentication...
      </div>
    );
  }

  if (user) {
     return null;
  }

  return (
    <div className="flex h-screen font-[Poppins]">
      <div className="hidden md:block w-2/3 relative h-full">
        <img
          src={LoginPageImg}
          alt="Various dishes on a table"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="w-full md:w-1/3 flex items-center justify-center bg-white p-4 h-full overflow-y-auto">
        <div className="bg-white p-8 rounded-lg w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-bold text-gray-600 mb-10 text-left whitespace-nowrap">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          <AuthForm
            isRegister={!isLogin}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            buttonBgColor="bg-orange-400"
            buttonHoverColor="hover:bg-orange-500"
          />

          <p className="text-center text-gray-600 text-sm mt-10">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleForm}
              className="text-orange-400 hover:text-orange-500 font-medium focus:outline-none"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;