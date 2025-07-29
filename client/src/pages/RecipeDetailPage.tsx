// client/src/pages/RecipeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Needed for axios.isAxiosError
import recipeService, { type Recipe } from '../services/recipeService'; // Note the 'type' keyword for Recipe import
import './RecipeDetailPage.css'; // Make sure this CSS file exists in the same directory

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Recipe ID is missing from URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedRecipe = await recipeService.getRecipeById(id);
        setRecipe(fetchedRecipe);
      } catch (error: unknown) { // Type 'unknown' for robust error handling
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message || 'Failed to fetch recipe details.');
        } else {
          setError('An unexpected error occurred while fetching recipe details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="detail-page-message">Loading recipe...</div>;
  }

  if (error) {
    return <div className="detail-page-message error-message">Error: {error}</div>;
  }

  if (!recipe) {
    return <div className="detail-page-message">Recipe not found.</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-header">
        <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
        <div className="recipe-detail-info">
          <h1>{recipe.title}</h1>
          <p className="author-info">By: {recipe.author}</p>
          <div className="meta-info">
            <span>⭐ {recipe.rating.toFixed(1)} / 5 ({recipe.ratingCount || 0} ratings)</span>
            <span>⏰ {recipe.time}</span>
            <span>🍽️ {recipe.servings}</span>
          </div>
        </div>
      </div>
      
      <div className="recipe-detail-description">
        <h3>Description</h3>
        <p>{recipe.description}</p>
      </div>

      <div className="recipe-sections">
        <div className="ingredients-section">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;