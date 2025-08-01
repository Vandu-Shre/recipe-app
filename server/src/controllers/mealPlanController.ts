// server/src/controllers/mealPlanController.ts
import { Request, Response } from 'express';
import MealPlan from '../models/MealPlan';
import { IUser } from '../models/User'; 

interface AuthRequest extends Request {
    user?: IUser;
}


export const getMealPlan = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const mealPlans = await MealPlan.find({ userId: req.user?._id }).populate('recipeId');
        res.status(200).json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch meal plan', error });
    }
};

export const addMealToPlan = async (req: AuthRequest, res: Response): Promise<void> => {
    const { recipeId, date, mealType } = req.body;
    try {
        const newMealPlan = new MealPlan({
            userId: req.user?._id,
            recipeId,
            date,
            mealType,
        });
        const savedMealPlan = await newMealPlan.save();
        res.status(201).json(savedMealPlan);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add meal to plan', error });
    }
};

export const removeMealFromPlan = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const mealPlan = await MealPlan.findByIdAndDelete(id);
        if (!mealPlan) {
            res.status(404).json({ message: 'Meal plan entry not found' });
            return;
        }
        res.status(200).json({ message: 'Meal plan entry removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove meal plan entry', error });
    }
};