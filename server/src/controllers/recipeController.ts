// server/src/controllers/recipeController.ts
import { Request, Response } from 'express';
import Recipe, { IRecipe } from '../models/Recipe'; // Import IRecipe if not already
import { Types } from 'mongoose'; // For ObjectId validation
import { IUser } from '../models/User'; // Import IUser

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req: Request, res: Response) => {
  console.log("--- DEBUG: createRecipe controller entered ---");

  if (!req.user) {
    console.error("ERROR: req.user is undefined in createRecipe. Protect middleware likely failed or was skipped.");
    return res.status(401).json({ message: res.__('not_authorized_user_not_found') });
  }

  console.log("DEBUG: req.user._id in createRecipe:", req.user._id);

  const { name, description, ingredients, instructions, cookingTime, servings, image } = req.body;

  if (!name || !description || !ingredients || !instructions || !cookingTime || !servings) {
    return res.status(400).json({ message: res.__('please_include_all_required_recipe_fields') });
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: res.__('ingredients_must_be_array') });
  }
  if (!Array.isArray(instructions) || instructions.length === 0) {
    return res.status(400).json({ message: res.__('instructions_must_be_array') });
  }

  try {
    const recipe = await Recipe.create({
      owner: new Types.ObjectId(req.user._id), // Mongoose will handle this as ObjectId automatically
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      image,
    });

    res.status(201).json({
      message: res.__('recipe_created_successfully'),
      recipe,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: res.__('validation_error_prefix') + messages.join(', ') });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(400).json({ message: res.__('duplicate_field_error', field, value) }); // Using a more generic key
    }
    console.error(error);
    res.status(500).json({ message: res.__('server_error_recipe_creation') });
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({})
      .populate('owner', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: res.__('recipes_fetched_successfully'),
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: res.__('server_error_fetching_recipes') });
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: res.__('invalid_recipe_id_format') });
  }

  try {
    const recipe = await Recipe.findById(id).populate('owner', ['username', 'email']);

    if (!recipe) {
      return res.status(404).json({ message: res.__('recipe_not_found') });
    }

    res.status(200).json({
      message: res.__('recipe_fetched_successfully'),
      recipe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: res.__('server_error_fetching_recipe') });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private (Owner only)
export const updateRecipe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: res.__('not_authorized_user_not_found') });
  }

  const { id } = req.params;
  const { name, description, ingredients, instructions, cookingTime, servings, image } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: res.__('invalid_recipe_id_format') });
  }

  try {
    // Select the 'user' field explicitly without populating, so it's guaranteed to be an ObjectId
    let recipe = await Recipe.findById(id).select('+user');

    if (!recipe) {
      return res.status(404).json({ message: res.__('recipe_not_found') });
    }

    // Now, recipe.user should be a Mongoose ObjectId directly,
    // so we can use .equals() for comparison which is type-safe.
    // Ensure both are treated as ObjectId types for comparison
    if (!(recipe.owner as Types.ObjectId).equals(req.user._id as Types.ObjectId)) {
      return res.status(403).json({ message: res.__('not_authorized_update_recipe') });
    }

    // Update fields only if provided in the request body
    if (name) recipe.name = name;
    if (description) recipe.description = description;
    if (ingredients) {
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: res.__('ingredients_must_be_array') });
      }
      recipe.ingredients = ingredients;
    }
    if (instructions) {
      if (!Array.isArray(instructions) || instructions.length === 0) {
        return res.status(400).json({ message: res.__('instructions_must_be_array') });
      }
      recipe.instructions = instructions;
    }
    if (cookingTime) recipe.cookingTime = cookingTime;
    if (servings) recipe.servings = servings;
    if (image) recipe.image = image;

    await recipe.save({ validateBeforeSave: true });

    res.status(200).json({
      message: res.__('recipe_updated_successfully'),
      recipe,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: res.__('validation_error_prefix') + messages.join(', ') });
    }
    console.error(error);
    res.status(500).json({ message: res.__('server_error_recipe_update') });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Owner only)
export const deleteRecipe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: res.__('not_authorized_user_not_found') });
  }

  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: res.__('invalid_recipe_id_format') });
  }

  try {
    // Select the 'user' field explicitly without populating
    const recipe = await Recipe.findById(id).select('+user');

    if (!recipe) {
      return res.status(404).json({ message: res.__('recipe_not_found') });
    }

    // Check if the logged-in user is the owner of this recipe
    if (!(recipe.owner as Types.ObjectId).equals(req.user._id as Types.ObjectId)) {
      return res.status(403).json({ message: res.__('not_authorized_delete_recipe') });
    }

    await Recipe.deleteOne({ _id: id });

    res.status(200).json({ message: res.__('recipe_deleted_successfully') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: res.__('server_error_recipe_deletion') });
  }
};