import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_API_URL || 'http://localhost:5000'}/api/meal-planner`;

export interface MealPlanEntry {
  recipeId: string;
  recipeTitle: string;
}

export interface MealPlan {
  [date: string]: {
    [meal: string]: MealPlanEntry | null;
  };
}

export const getMealPlanForWeek = async (weekStart: string, authToken: string): Promise<MealPlan> => {
  try {
    const response = await axios.get(`${API_URL}?weekStart=${weekStart}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch meal plan:', error);
    return {}; // Return empty object on error
  }
};

export const saveMealPlan = async (mealPlan: MealPlan, authToken: string): Promise<void> => {
  try {
    await axios.post(API_URL, { mealPlan }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
  } catch (error) {
    console.error('Failed to save meal plan:', error);
    throw error;
  }
};