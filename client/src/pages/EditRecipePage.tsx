// client/src/pages/EditRecipePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe, type Recipe, type UpdateRecipeData } from '../services/recipeService'; 
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authToken, isLoading: authLoading } = useAuth();
  
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
    return <div className="text-center text-red-500 mt-10 text-xl font-[Poppins]">{error}</div>;
  }

  if (!recipe || !formData) {
    return <div className="text-center mt-10 text-xl font-[Poppins]">Recipe not found or data not loaded.</div>;
  }

  return (
  <div className="w-full bg-neutral-100 p-10 min-h-screen font-[Poppins]"> 
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-600">Edit Recipe: {recipe.title}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-xl space-y-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-orange-500 text-sm font-semibold mb-2">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block text-orange-500 text-sm font-semibold mb-2">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-orange-500 text-sm font-semibold mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="ingredients" className="block text-orange-500 text-sm font-semibold mb-2">Ingredients (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients.join('\n')}
            onChange={handleArrayChange}
            rows={6}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="instructions" className="block text-orange-500 text-sm font-semibold mb-2">Instructions (one per line)</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions.join('\n')}
            onChange={handleArrayChange}
            rows={8}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="cookingTime" className="block text-orange-500 text-sm font-semibold mb-2">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="servings" className="block text-orange-500 text-sm font-semibold mb-2">Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="flex items-center justify-between mt-10">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  <div />
  </div>
  );
};

export default EditRecipePage;