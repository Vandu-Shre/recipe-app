import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';

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
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading recipes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container font-[Poppins] mx-auto mt-5 mb-10 px-4 py-2 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {recipes.length === 0 ? (
          <div className="col-span-full text-center text-gray-300 text-xl">
            No recipes found. Start by creating one!
          </div>
        ) : (
          recipes.map((recipe) => (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block">
              <RecipeCard
                id={recipe.id}
                image={recipe.image}
                title={recipe.title}
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