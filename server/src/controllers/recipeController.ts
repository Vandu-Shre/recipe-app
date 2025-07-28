// server/src/controllers/recipeController.ts
import { Request, Response, NextFunction } from 'express';
import Recipe from '../models/Recipe';
import { Types } from 'mongoose';

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private (requires authentication)
export const createRecipe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found in request' });
  }

  const { name, description, ingredients, instructions, cookingTime, servings, image } = req.body;

  if (!name || !description || !ingredients || !instructions || !cookingTime || !servings) {
    return res.status(400).json({ message: 'Please include all required recipe fields' });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: 'Ingredients must be an array with at least one item' });
  }
  if (!Array.isArray(instructions) || instructions.length === 0) {
    return res.status(400).json({ message: 'Instructions must be an array with at least one step' });
  }

  try {
    const recipe = await Recipe.create({
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      image: image || '',
      owner: req.user._id as Types.ObjectId, // <-- Corrected: Explicitly cast _id
    });

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) { // Handle potential duplicate name if we added a unique constraint later
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ message: `A recipe with that ${field}: ${value} already exists.` });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during recipe creation' });
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getAllRecipes = async (req: Request, res: Response) => {
    try {
      // Populate the 'owner' field to get some user details (e.g., username)
      const recipes = await Recipe.find({})
        .populate('owner', 'username email'); // Only select username and email from the owner
  
      res.status(200).json({
        message: 'Recipes fetched successfully',
        count: recipes.length,
        recipes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching recipes' });
    }
  };
  
  // @desc    Get single recipe by ID
  // @route   GET /api/recipes/:id
  // @access  Public
  export const getRecipeById = async (req: Request, res: Response) => {
    try {
      // Validate if the ID is a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid recipe ID format' });
      }
  
      const recipe = await Recipe.findById(req.params.id)
        .populate('owner', 'username email'); // Populate owner details
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.status(200).json({
        message: 'Recipe fetched successfully',
        recipe,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching recipe' });
    }
  };  

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private (Owner only)
export const updateRecipe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found in request' });
  }

  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the logged-in user is the owner of the recipe
    // req.user._id is an ObjectId, recipe.owner is also an ObjectId
    if (recipe.owner.toString() !== (req.user._id as Types.ObjectId).toString()) { // <-- Corrected: Explicitly cast _id
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'username email');

    res.status(200).json({
      message: 'Recipe updated successfully',
      recipe,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during recipe update' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Owner only)
export const deleteRecipe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized, no user found in request' });
  }

  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the logged-in user is the owner of the recipe
    if (recipe.owner.toString() !== (req.user._id as Types.ObjectId).toString()) { // <-- Corrected: Explicitly cast _id
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during recipe deletion' });
  }
};