// client/src/services/recipeService.ts
import axios from 'axios'; // Needed for axios.isAxiosError
import api from './api';    // Your configured Axios instance

// IMPORTANT: Defines the structure of a SINGLE recipe object AS IT COMES DIRECTLY FROM YOUR BACKEND'S 'recipes' array.
interface BackendRecipe {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  image: string;
  owner?: {
    _id: string;
    username: string;
  };
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// THIS IS THE COMPLETE 'Recipe' INTERFACE for your frontend components.
// It includes all fields needed by both RecipeCard and RecipeDetailPage.
export interface Recipe {
  id: string; // Mapped from _id
  image: string;
  title: string; // Mapped from name
  author: string; // Mapped from owner.username
  rating: number; // Mapped from averageRating
  time: string; // Mapped from cookingTime (needs conversion)
  servings: string; // Mapped from servings (needs conversion)
  description: string; // Added for RecipeDetailPage
  ingredients: string[]; // Added for RecipeDetailPage
  instructions: string[]; // Added for RecipeDetailPage
  ratingCount: number; // Added for RecipeDetailPage
}

export interface CreateRecipeData {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  image: string;
}

// Helper function to map BackendRecipe to Frontend Recipe
const mapBackendRecipeToFrontend = (backendRecipe: BackendRecipe): Recipe => ({
  id: backendRecipe._id,
  image: backendRecipe.image,
  title: backendRecipe.name,
  author: backendRecipe.owner?.username || 'Unknown Author',
  rating: backendRecipe.averageRating,
  time: `${backendRecipe.cookingTime} min`,
  servings: `${backendRecipe.servings} servings`,
  description: backendRecipe.description,
  ingredients: backendRecipe.ingredients,
  instructions: backendRecipe.instructions,
  ratingCount: backendRecipe.ratingCount
});

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await api.get<{ message: string; count: number; recipes: BackendRecipe[] }>('/api/recipes');
    return response.data.recipes.map(mapBackendRecipeToFrontend);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching recipes:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred while fetching recipes');
    }
  }
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  try {
    const response = await api.get<BackendRecipe>(`/api/recipes/${id}`);
    return mapBackendRecipeToFrontend(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error(`Error fetching recipe with ID ${id}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `Failed to fetch recipe with ID ${id}`);
    } else {
        console.error(`An unexpected error occurred while fetching recipe with ID ${id}:`, error);
        throw new Error(`An unexpected error occurred while fetching recipe with ID ${id}`);
    }
  }
};

export const createRecipe = async (recipeData: CreateRecipeData, authToken?: string): Promise<Recipe> => {
  try {
    const config = authToken ? {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    } : {};

    const response = await api.post<BackendRecipe>('/api/recipes', recipeData, config);
    return mapBackendRecipeToFrontend(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating recipe:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create recipe');
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred while creating recipe');
    }
  }
};

const recipeService = {
  getRecipes,
  getRecipeById,
  createRecipe,
};

export default recipeService;