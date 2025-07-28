// client/src/components/AuthForm.tsx

import React, { useState } from 'react';

interface AuthFormProps {
  isRegister: boolean;
  onSubmit: (formData: { username?: string; email: string; password: string }) => void;
  isLoading: boolean;
  // ADDED: Define the new props here
  buttonBgColor?: string;
  buttonHoverColor?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegister,
  onSubmit,
  isLoading,
  // Ensure these are destructured from props
  buttonBgColor = 'bg-amber-800', // Default to amber-800 if not provided
  buttonHoverColor = 'hover:bg-amber-900', // Default to amber-900 if not provided
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegister && (
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" // Changed focus ring to amber-500
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={isRegister}
            disabled={isLoading}
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" // Changed focus ring to amber-500
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" // Changed focus ring to amber-500
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonBgColor} ${buttonHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} // Changed focus ring to amber-500
          disabled={isLoading}
        >
          {isLoading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;