import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import recipeService, { type Recipe } from '../services/recipeService';
import './RecipeDetailPage.css'; // Ensure this file exists for basic styles

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Recipe ID is missing from URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedRecipe = await recipeService.getRecipeById(id);
        setRecipe(fetchedRecipe);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message || 'Failed to fetch recipe details.');
        } else {
          setError('An unexpected error occurred while fetching recipe details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading recipe...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 text-xl p-4">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-400 text-xl p-4">
        <p className="mb-4">Recipe not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const ingredientsToDisplay = recipe.ingredients ?? [];
  const instructionsToDisplay = recipe.instructions ?? [];

  return (
    <div className="w-full min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-200 p-6 sm:p-8 rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-700 hover:text-amber-800 transition-colors duration-300 text-lg font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Recipes
        </button>

        {/* Recipe Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 leading-tight mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-700 text-lg">
            by <span className="font-semibold">{recipe.author}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-8 mb-10">
          {/* Image & Meta Info Section */}
          <div className="md:w-1/2 flex flex-col items-center">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-72 sm:h-96 object-cover rounded-lg shadow-xl mb-6" 
            />
            <div className="flex flex-wrap justify-around w-full bg-amber-50 p-4 rounded-lg shadow-md text-gray-800 text-center text-lg font-medium">
              <div className="flex items-center mx-2 my-1">
                <span className="text-yellow-500 text-2xl mr-1">★</span>
                <span>{recipe.rating?.toFixed(1) || 'N/A'} / 5</span>
                <span className="text-sm text-gray-500 ml-1">({recipe.ratingCount || 0} ratings)</span>
              </div>
              <div className="flex items-center mx-2 my-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-amber-700 mr-1">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.25h-3a.75.75 0 000 1.5h3.75a.75.70a.75.75 0 00.75-.75V5.75z" clipRule="evenodd" />
                </svg>
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center mx-2 my-1">
                <span role="img" aria-label="servings" className="text-amber-700 text-2xl mr-1">🍽️</span>
                <span>{recipe.servings}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{recipe.description}</p>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
            {ingredientsToDisplay.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 text-lg space-y-3">
            {instructionsToDisplay.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {/* Ratings & Comments Section (Placeholder) */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ratings & Comments</h2>
          <p className="text-gray-600 leading-relaxed">
            This section will display user ratings and comments, and allow logged-in users to add their own. (Pending API integration)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;