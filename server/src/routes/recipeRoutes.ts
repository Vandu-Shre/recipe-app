// server/src/routes/recipeRoutes.ts
import express from 'express';
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Route for creating a recipe (and getting all recipes)
// The 'protect' middleware MUST come BEFORE createRecipe for POST requests
router.route('/')
  .post(protect, createRecipe) // <-- Make sure 'protect' is here for POST
  .get(getAllRecipes);

// Routes for specific recipe by ID
router.route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe) // <-- 'protect' here for PUT
  .delete(protect, deleteRecipe); // <-- 'protect' here for DELETE

export default router;