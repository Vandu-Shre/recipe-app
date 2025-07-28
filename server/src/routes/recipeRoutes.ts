// server/src/routes/recipeRoutes.ts
import { Router } from 'express';
// Corrected import: All functions are named exports from recipeController
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController'; // <--- Corrected this import line
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes (no authentication needed to view recipes)
router.get('/', getAllRecipes); // GET /api/recipes
router.get('/:id', getRecipeById); // GET /api/recipes/:id

// Private routes (authentication required)
// Apply 'protect' middleware before the controller function
router.post('/', protect, createRecipe); // POST /api/recipes
router.put('/:id', protect, updateRecipe); // PUT /api/recipes/:id
router.delete('/:id', protect, deleteRecipe); // DELETE /api/recipes/:id

export default router;