// client/src/pages/EditRecipePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe, type Recipe, type UpdateRecipeData } from '../services/recipeService'; 
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the recipe ID from the URL
  const navigate = useNavigate();
  const { authToken, isLoading: authLoading } = useAuth(); // Auth context for token
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateRecipeData | null>(null); 

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Recipe ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const fetchedRecipe = await getRecipeById(id);
        setRecipe(fetchedRecipe);
        // Initialize form data with fetched recipe data
        setFormData({
            name: fetchedRecipe.title, 
            description: fetchedRecipe.description,
            ingredients: fetchedRecipe.ingredients,
            instructions: fetchedRecipe.instructions,
            cookingTime: parseInt(fetchedRecipe.time),
            servings: parseInt(fetchedRecipe.servings),
            image: fetchedRecipe.image,
        });
      } catch (err) {
        setError(`Failed to fetch recipe: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const items = value.split('\n').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => prev ? { ...prev, [name]: items } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !authToken || !formData) return;
    setLoading(true);
    try {
      await updateRecipe(id, formData, authToken); 
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(`Failed to update recipe: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10 text-xl">{error}</div>;
  }

  if (!recipe || !formData) {
    return <div className="text-center mt-10 text-xl">Recipe not found or data not loaded.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Recipe: {recipe.title}</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-300 text-sm font-bold mb-2">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-gray-300 text-sm font-bold mb-2">Ingredients (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients.join('\n')}
            onChange={handleArrayChange}
            rows={6}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="instructions" className="block text-gray-300 text-sm font-bold mb-2">Instructions (one per line)</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions.join('\n')}
            onChange={handleArrayChange}
            rows={8}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cookingTime" className="block text-gray-300 text-sm font-bold mb-2">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="servings" className="block text-gray-300 text-sm font-bold mb-2">Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            // --- FIX APPLIED HERE ---
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipePage;