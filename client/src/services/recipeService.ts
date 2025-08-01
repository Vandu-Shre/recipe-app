import axios from 'axios';
import api from './api';

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
  category: string;
}

interface SingleRecipeApiResponse {
  message: string;
  recipe: BackendRecipe;
}

export interface Recipe {
  id: string;
  image: string;
  title: string;
  author: string;
  authorId: string;
  rating: number;
  time: string;
  servings: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  ratingCount: number;
  category: string;
}

export interface CreateRecipeData {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  image: string;
  category: string;
}

export interface UpdateRecipeData {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  image: string;
  category: string;
}

const mapBackendRecipeToFrontend = (backendRecipe: BackendRecipe): Recipe => ({
  id: backendRecipe._id,
  image: backendRecipe.image,
  title: backendRecipe.name,
  author: backendRecipe.owner?.username || 'Unknown Author',
  authorId: backendRecipe.owner?._id || '',
  rating: backendRecipe.averageRating,
  time: `${backendRecipe.cookingTime} min`,
  servings: `${backendRecipe.servings} servings`,
  description: backendRecipe.description,
  ingredients: backendRecipe.ingredients,
  instructions: backendRecipe.instructions,
  ratingCount: backendRecipe.ratingCount,
  category: backendRecipe.category,
});

export const getRecipes = async (category?: string, searchTerm?: string): Promise<Recipe[]> => {
  try {
    const params: { category?: string; search?: string } = {};
    if (category) {
      params.category = category;
    }
    if (searchTerm) {
      params.search = searchTerm;
    }
    const response = await api.get<{ message: string; count: number; recipes: BackendRecipe[] }>('/api/recipes', { params });
    return response.data.recipes.map(mapBackendRecipeToFrontend);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    } else {
      throw new Error('An unexpected error occurred while fetching recipes');
    }
  }
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  try {
    const response = await api.get<SingleRecipeApiResponse>(`/api/recipes/${id}`);
    const mappedRecipe = mapBackendRecipeToFrontend(response.data.recipe);
    return mappedRecipe;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || `Failed to fetch recipe with ID ${id}`);
    } else {
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
      throw new Error(error.response?.data?.message || 'Failed to create recipe');
    } else {
      throw new Error('An unexpected error occurred while creating recipe');
    }
  }
};

export const updateRecipe = async (
  recipeId: string, 
  recipeData: UpdateRecipeData, 
  token: string
): Promise<Recipe> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.put<BackendRecipe>(`/api/recipes/${recipeId}`, recipeData, config);
    return mapBackendRecipeToFrontend(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to update recipe ${recipeId}.`);
    } else {
      throw new Error('An unexpected error occurred while updating recipe.');
    }
  }
};

export const deleteRecipe = async (recipeId: string, token: string): Promise<void> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await api.delete(`/api/recipes/${recipeId}`, config);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to delete recipe ${recipeId}.`);
    } else {
      throw new Error('An unexpected error occurred while deleting recipe.');
    }
  }
};

const recipeService = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};

export default recipeService;