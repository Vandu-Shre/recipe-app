// server/src/routes/ratingRoutes.ts
import { Router } from 'express';
import {
  createRating,
  getRecipeRatings,
  updateRating,
  deleteRating,
} from '../controllers/ratingController';
import { protect } from '../middleware/authMiddleware'; // Import our authentication middleware

const router = Router();

// Route for creating a rating (protected)
router.post('/', protect, createRating); // POST /api/ratings

// Route for getting all ratings for a specific recipe (public)
// Note: This route will typically be nested under /api/recipes/:recipeId/ratings
// but for now, we'll keep it simple as /api/ratings/:recipeId
router.get('/:recipeId', getRecipeRatings); // GET /api/ratings/:recipeId

// Routes for updating and deleting a specific rating (protected)
router.put('/:ratingId', protect, updateRating); // PUT /api/ratings/:ratingId
router.delete('/:ratingId', protect, deleteRating); // DELETE /api/ratings/:ratingId

export default router;