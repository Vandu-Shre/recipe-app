// client/src/pages/AddRecipePage.tsx
import React, { useState } from 'react';
import recipeService, { type CreateRecipeData } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddRecipePage: React.FC = () => {
  const { authToken, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateRecipeData>({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookingTime: 0,
    servings: 0,
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Special handling for number inputs to ensure they are parsed as numbers
    if (name === "cookingTime" || name === "servings") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: 'ingredients' | 'instructions') => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index: number, field: 'ingredients' | 'instructions') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setError('You must be logged in to add a recipe.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Filter out empty strings from ingredients/instructions before sending
    const cleanedFormData = {
      ...formData,
      ingredients: formData.ingredients.filter(item => item.trim() !== ''),
      instructions: formData.instructions.filter(item => item.trim() !== ''),
    };

    try {
      await recipeService.createRecipe(cleanedFormData, authToken);
      setSuccess('Recipe added successfully!');
      setFormData({ // Reset form
        name: '', description: '', ingredients: [''], instructions: [''], cookingTime: 0, servings: 0, image: '',
      });
      navigate('/recipes'); // Navigate to the recipe list after adding
    } catch (err: any) {
      setError(err.message || 'Failed to add recipe.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center text-white text-xl">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 flex flex-col items-center justify-center text-red-500 text-xl">
        <p>You must be logged in to add a recipe.</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-4 py-2 px-6 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition duration-300"
        >
          Login / Register
        </button>
      </div>
    );
  }

  return (
    // Adjust container for consistency with other pages' backgrounds
    <div className="w-full px-4 py-8 min-h-screen"> 
      <div className="max-w-2xl mx-auto"> {/* Inner container for centering content */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">Add New Recipe</h1>
        <form onSubmit={handleSubmit} className="bg-gray-200 p-8 rounded-lg shadow-xl space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              // ADDED: text-gray-800 and placeholder-gray-500
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
              placeholder="e.g., Spicy Chicken Curry"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              // ADDED: text-gray-800 and placeholder-gray-500
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
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
              // ADDED: text-gray-800 and placeholder-gray-500
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
              placeholder="A delicious and easy-to-make chicken curry..."
            ></textarea>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleArrayChange(e, index, 'ingredients')}
                  placeholder={`Ingredient ${index + 1}`}
                  // ADDED: text-gray-800 and placeholder-gray-500
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'ingredients')}
                    className="p-2 text-red-600 hover:text-red-800 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 3a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('ingredients')}
              className="mt-2 text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <textarea
                  value={instruction}
                  onChange={(e) => handleArrayChange(e, index, 'instructions')}
                  placeholder={`Step ${index + 1}`}
                  rows={2}
                  // ADDED: text-gray-800 and placeholder-gray-500
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
                ></textarea>
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'instructions')}
                    className="p-2 text-red-600 hover:text-red-800 transition duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 3a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('instructions')}
              className="mt-2 text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              + Add Step
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-1">Cooking Time (minutes)</label>
              <input
                type="number"
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime === 0 ? '' : formData.cookingTime} // Show empty string if 0, else show value
                onChange={handleChange}
                required
                min="0"
                // ADDED: text-gray-800 and placeholder-gray-500
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings === 0 ? '' : formData.servings} // Show empty string if 0, else show value
                onChange={handleChange}
                required
                min="1"
                // ADDED: text-gray-800 and placeholder-gray-500
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-800 placeholder-gray-500"
                placeholder="e.g., 4"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-md text-white font-semibold transition duration-300 ${
              loading ? 'bg-amber-600 opacity-70 cursor-not-allowed' : 'bg-amber-800 hover:bg-amber-900'
            }`}
          >
            {loading ? 'Adding Recipe...' : 'Add Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipePage;