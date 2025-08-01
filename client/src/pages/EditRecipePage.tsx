import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recipeService, { getRecipeById, type Recipe, type UpdateRecipeData } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const categories = [
  'Breakfast',
  'Soup',
  'Indian',
  'Chinese',
  'Italian',
  'Mexican',
  'Pizza',
  'Dessert',
  'Beverages',
];

interface UpdatedUpdateRecipeData extends UpdateRecipeData {
    category: string;
}

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authToken, isLoading: authLoading } = useAuth();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdatedUpdateRecipeData | null>(null);

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
            category: fetchedRecipe.category,
        });
      } catch (err) {
        setError(`Failed to fetch recipe: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "cookingTime" || name === "servings") {
        setFormData(prev => prev ? { ...prev, [name]: Number(value) } : null);
    } else {
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    }
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
      await recipeService.updateRecipe(id, formData, authToken);
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
    <div className="w-full p-10 min-h-screen font-[Poppins]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-orange-400 text-center mb-8">Edit Recipe | {recipe.title}</h1>
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-xl space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
              placeholder="e.g., Spicy Chicken Curry"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-8 border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white"
            >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
              placeholder="http://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
              placeholder="A delicious and easy-to-make chicken curry..."
            ></textarea>
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredients (one per line)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients.join('\n')}
              onChange={handleArrayChange}
              rows={6}
              className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
            ></textarea>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions (one per line)</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions.join('\n')}
              onChange={handleArrayChange}
              rows={8}
              className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-1">Cooking Time (minutes)</label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-800"
              />
            </div>
          </div>
          
          {error && <p className="text-red-600 text-center">{error}</p>}
          
          <div className="flex items-center justify-between mt-10">
            <button
              type="submit"
              className="w-full mr-2 py-3 px-6 rounded-full text-white font-semibold transition duration-300 bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Recipe'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/recipes/${id}`)}
              className="w-full ml-2 py-3 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold transition duration-300 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipePage;