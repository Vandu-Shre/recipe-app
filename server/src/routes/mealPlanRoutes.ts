// server/src/routes/mealPlanRoutes.ts
import express from 'express';
import { getMealPlan, addMealToPlan, removeMealFromPlan } from '../controllers/mealPlanController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getMealPlan)
  .post(protect, addMealToPlan);

router.route('/:id')
  .delete(protect, removeMealFromPlan);

export default router;