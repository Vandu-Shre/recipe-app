// client/src/services/ratingService.ts
import axios from 'axios';
import api from './api';

// Interface for the rating data coming from the backend
export interface BackendRating {
  _id: string;
  recipe: string; // The ID of the recipe this rating belongs to
  user?: { // Make 'owner' property optional
    _id?: string; // Make '_id' optional within owner
    username?: string; // Make 'username' optional within owner
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for the frontend-ready Rating object
export interface Rating {
  id: string;
  recipeId: string;
  user: {
    id: string;
    username: string;
  };
  value: number; // Mapped from backend's 'rating'
  comment: string;
  createdAt: string;
}

// Interface for creating a new rating
export interface CreateRatingData {
  recipe: string; // recipe ID
  rating: number;
  comment: string;
}

// Interface for updating an existing rating
export interface UpdateRatingData {
  rating?: number;
  comment?: string;
}

// Helper to map backend rating to frontend rating
const mapBackendRatingToFrontend = (backendRating: BackendRating): Rating => ({
  id: backendRating._id,
  recipeId: backendRating.recipe,
  // Add defensive checks for 'owner' and its properties
  user: {
    id: backendRating.user?._id || 'unknown', // Use optional chaining and fallback
    username: backendRating.user?.username || 'Unknown User', // Use optional chaining and fallback
  },
  value: backendRating.rating,
  comment: backendRating.comment,
  createdAt: new Date(backendRating.createdAt).toLocaleDateString() // Format date for display
});

// API calls for ratings
const ratingService = {
  // Get all ratings for a specific recipe
  getRatingsForRecipe: async (recipeId: string): Promise<Rating[]> => {
    try {
      const response = await api.get<{ message: string; ratings: BackendRating[] }>(`/api/ratings/${recipeId}`);
      return response.data.ratings.map(mapBackendRatingToFrontend);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching ratings for recipe ${recipeId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `Failed to fetch ratings for recipe ${recipeId}`);
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error('An unexpected error occurred while fetching ratings.');
      }
    }
  },

  // Create a new rating
  createRating: async (data: CreateRatingData, token: string): Promise<Rating> => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await api.post<{ message: string; rating: BackendRating }>('/api/ratings', data, config);
      // This is line 86, which calls mapBackendRatingToFrontend
      return mapBackendRatingToFrontend(response.data.rating); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating rating:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create rating.');
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error('An unexpected error occurred while creating rating.');
      }
    }
  },

  // Update an existing rating
  updateRating: async (ratingId: string, data: UpdateRatingData, token: string): Promise<Rating> => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await api.put<{ message: string; rating: BackendRating }>(`/api/ratings/${ratingId}`, data, config);
      return mapBackendRatingToFrontend(response.data.rating);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error updating rating ${ratingId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `Failed to update rating ${ratingId}.`);
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error('An unexpected error occurred while updating rating.');
      }
    }
  },

  // Delete a rating
  deleteRating: async (ratingId: string, token: string): Promise<void> => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await api.delete(`/api/ratings/${ratingId}`, config);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error deleting rating ${ratingId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `Failed to delete rating ${ratingId}.`);
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error('An unexpected error occurred while deleting rating.');
      }
    }
  },
};

export default ratingService;