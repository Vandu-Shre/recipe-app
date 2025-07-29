// client/src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';

import RecipeCard from '../components/RecipeCard';

const ProfilePage: React.FC = () => {
  const { user, authToken, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(true);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchUserRecipes = async () => {
      if (user && authToken) {
        setRecipesLoading(true);
        setRecipesError(null);
        try {
          const fetchedRecipes = await recipeService.getRecipes(); // Fetches all recipes
          // Client-side filter: Compare recipe.author (username) with logged-in user.username
          // This assumes recipe.author stores the username string.
          const filteredRecipes = fetchedRecipes.filter(recipe => recipe.author === user.username);
          setUserRecipes(filteredRecipes);
        } catch (err: any) {
          setRecipesError(err.message || 'Failed to fetch your recipes.');
        } finally {
          setRecipesLoading(false);
        }
      }
    };

    fetchUserRecipes();
  }, [user, authToken, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen py-8 flex flex-col items-center justify-center text-white text-xl bg-black">
        {authLoading ? (
          <p>Loading user profile...</p>
        ) : (
          <>
            <p>You must be logged in to view your profile.</p>
            <button
              onClick={() => navigate('/auth')}
              className="mt-4 py-2 px-6 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition duration-300"
            >
              Login / Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 min-h-screen">
      {/* Increased max-w from 4xl to 5xl to give more horizontal space */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          Welcome, {user.username}!
        </h1>

        <div className="bg-gray-200 p-8 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Information</h2>
          <p className="text-gray-700 text-lg mb-2">Email: <span className="font-semibold">{user.email}</span></p>
          {/* Removed/Commented out 'Member Since' line as 'createdAt' property does not exist on 'User' type */}
          {/* <p className="text-gray-700 text-lg">Member Since: <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span></p> */}
          <button
            onClick={handleLogout}
            className="mt-6 py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Recipes</h2>

        {recipesLoading ? (
          <div className="text-center text-gray-300 text-xl">Loading your recipes...</div>
        ) : recipesError ? (
          <div className="text-center text-red-500 text-xl">Error: {recipesError}</div>
        ) : userRecipes.length === 0 ? (
          <div className="text-center text-gray-300 text-xl">
            You haven't created any recipes yet. <Link to="/add-recipe" className="text-amber-500 hover:underline">Add your first one!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8"> {/* <--- MODIFIED THIS LINE */}
            {userRecipes.map((recipe) => (
              <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block">
                <RecipeCard
                  id={recipe.id}
                  image={recipe.image}
                  title={recipe.title}
                  author={recipe.author}
                  rating={recipe.rating}
                  time={recipe.time}
                  servings={recipe.servings}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;