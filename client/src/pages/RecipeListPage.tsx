// client/src/pages/RecipeListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard'; // Import the RecipeCard component

const RecipeListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRecipes = await recipeService.getRecipes();
        setRecipes(fetchedRecipes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      // Added flex classes for centering, and light text for visibility on background
      <div className="flex items-center justify-center min-h-screen text-gray-200">
        Loading recipes...
      </div>
    );
  }

  if (error) {
    return (
      // Added flex classes for centering, and red text for error visibility
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    // Outer container for page padding and max-width
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Styled heading for the page */}
      <h1 className="text-4xl font-bold text-white mb-8 text-center">All Recipes</h1>

      {/* Tailwind CSS Grid for 3 columns:
          - grid-cols-1: 1 column on small screens (default)
          - sm:grid-cols-2: 2 columns on small-medium screens and up
          - lg:grid-cols-3: 3 columns on large screens and up
          - gap-8: Adds space between grid items
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.length === 0 ? (
          // Message for no recipes found, spanning all columns
          <div className="col-span-full text-center text-gray-300 text-xl">
            No recipes found. Start by creating one!
          </div>
        ) : (
          // Map through recipes and render RecipeCard for each
          recipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block"> {/* Use 'block' to make the Link take full card width */}
              <RecipeCard
                id={recipe.id} // Pass id if RecipeCard might use it internally
                image={recipe.image}
                title={recipe.title}
                author={recipe.author}
                rating={recipe.rating}
                time={recipe.time}
                servings={recipe.servings}
                ratingCount={recipe.ratingCount}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeListPage;