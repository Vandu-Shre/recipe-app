// server/src/models/Recipe.ts
import { Schema, model, Document, Types, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

// Define the interface for a Recipe document
export interface IRecipe extends Document {
  //user: Types.ObjectId | PopulatedDoc<IUser>;
  name: string;
  description: string;
  ingredients: string[]; // Array of strings, e.g., ["1 cup flour", "2 eggs"]
  instructions: string[]; // Array of strings, e.g., ["Mix ingredients", "Bake at 350F"]
  cookingTime: number; // In minutes
  servings: number;
  image: string; // URL to an image (optional)
  owner: Types.ObjectId | PopulatedDoc<IUser>; // Reference to the User who created the recipe
  averageRating: number; // Will store the calculated average rating
  ratingCount: number; // Number of ratings received
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true,
    minlength: [3, 'Recipe name must be at least 3 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  ingredients: {
    type: [String], // Array of strings
    required: [true, 'Ingredients are required'],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: 'At least one ingredient is required',
    },
  },
  instructions: {
    type: [String], // Array of strings
    required: [true, 'Instructions are required'],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: 'At least one instruction step is required',
    },
  },
  cookingTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute'],
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1'],
  },
  image: {
    type: String,
    trim: true,
    default: '', // Default to an empty string if no image provided
  },
  owner: {
    type: Schema.Types.ObjectId, // This defines a reference
    ref: 'User', // This tells Mongoose which model the ObjectId refers to
    required: [true, 'Recipe must have an owner'],
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field on save
RecipeSchema.pre<IRecipe>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Recipe = model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;