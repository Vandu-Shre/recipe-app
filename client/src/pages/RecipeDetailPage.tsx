// client/src/pages/RecipeDetailPage.tsx
import React, { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <--- ADDED 'Link' HERE
import axios from 'axios';
import recipeService, { type Recipe } from '../services/recipeService';
import ratingService, { type Rating, type CreateRatingData, type UpdateRatingData } from '../services/ratingService';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './RecipeDetailPage.css';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, authToken } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for ratings
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState<boolean>(true);
  const [ratingsError, setRatingsError] = useState<string | null>(null);

  // State for adding a new rating
  const [newRatingValue, setNewRatingValue] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [submitRatingError, setSubmitRatingError] = useState<string | null>(null);

  // State for editing an existing rating
  const [editingRatingId, setEditingRatingId] = useState<string | null>(null);
  const [editingRatingValue, setEditingRatingValue] = useState<number>(0);
  const [editingComment, setEditingComment] = useState<string>('');
  const [isUpdatingRating, setIsUpdatingRating] = useState<boolean>(false);
  const [updateRatingError, setUpdateRatingError] = useState<string | null>(null);


  // --- Fetch Recipe Details ---
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
      } catch (error: unknown) {
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

  // --- Fetch Ratings for Recipe ---
  useEffect(() => {
    const fetchRatings = async () => {
      if (!id) return; // Don't fetch if recipe ID is missing

      setRatingsLoading(true);
      setRatingsError(null);
      try {
        const fetchedRatings = await ratingService.getRatingsForRecipe(id);
        setRatings(fetchedRatings);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setRatingsError(error.response?.data?.message || error.message || 'Failed to fetch ratings.');
        } else {
          setRatingsError('An unexpected error occurred while fetching ratings.');
        }
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchRatings();
  }, [id]); // Re-fetch ratings when recipe ID changes

  // --- Handlers for Adding a Rating ---
  const handleRatingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !authToken) {
      setSubmitRatingError("You must be logged in to submit a rating.");
      return;
    }
    if (!id || newRatingValue === 0) {
      setSubmitRatingError("Please provide a rating and a comment (optional).");
      return;
    }

    setIsSubmittingRating(true);
    setSubmitRatingError(null);

    const ratingData: CreateRatingData = {
      recipe: id,
      rating: newRatingValue,
      comment: newComment,
    };

    try {
      const createdRating = await ratingService.createRating(ratingData, authToken);
      setRatings(prevRatings => [createdRating, ...prevRatings]); // Add new rating to top
      setNewRatingValue(0); // Reset form
      setNewComment('');
      // Optionally, re-fetch recipe to update average rating and count immediately
      if (recipe) {
        const updatedRecipe = await recipeService.getRecipeById(recipe.id);
        setRecipe(updatedRecipe);
      }

    } catch (err: any) {
      setSubmitRatingError(err.message || "Failed to submit rating.");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // --- Handlers for Editing a Rating ---
  const handleEditClick = (ratingToEdit: Rating) => {
    setEditingRatingId(ratingToEdit.id);
    setEditingRatingValue(ratingToEdit.value);
    setEditingComment(ratingToEdit.comment);
  };

  const handleEditCancel = () => {
    setEditingRatingId(null);
    setEditingRatingValue(0);
    setEditingComment('');
    setUpdateRatingError(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !authToken || !editingRatingId) {
      setUpdateRatingError("Authentication error or no rating selected for update.");
      return;
    }
    if (editingRatingValue === 0) {
      setUpdateRatingError("Rating value cannot be 0.");
      return;
    }

    setIsUpdatingRating(true);
    setUpdateRatingError(null);

    const updateData: UpdateRatingData = {
      rating: editingRatingValue,
      comment: editingComment,
    };

    try {
      const updatedRating = await ratingService.updateRating(editingRatingId, updateData, authToken);
      setRatings(prevRatings => prevRatings.map(r => 
        r.id === editingRatingId ? updatedRating : r
      ));
      handleEditCancel(); // Reset edit state
      // Optionally, re-fetch recipe to update average rating and count immediately
      if (recipe) {
        const updatedRecipe = await recipeService.getRecipeById(recipe.id);
        setRecipe(updatedRecipe);
      }
    } catch (err: any) {
      setUpdateRatingError(err.message || "Failed to update rating.");
    } finally {
      setIsUpdatingRating(false);
    }
  };

  // --- Handlers for Deleting a Rating ---
  const handleDeleteRating = async (ratingId: string) => {
    if (!user || !authToken) {
      alert("You must be logged in to delete a rating.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this rating?")) {
      return;
    }

    try {
      await ratingService.deleteRating(ratingId, authToken);
      setRatings(prevRatings => prevRatings.filter(r => r.id !== ratingId)); // Remove from UI
      // Optionally, re-fetch recipe to update average rating and count immediately
      if (recipe) {
        const updatedRecipe = await recipeService.getRecipeById(recipe.id);
        setRecipe(updatedRecipe);
      }
      alert("Rating deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to delete rating.");
    }
  };

  // --- Handler for Deleting the Recipe ---
  const handleDeleteRecipe = async () => {
    // Corrected: Use user.id instead of user._id
    if (!user || !authToken || !id || recipe?.authorId !== user.id) { 
      alert("You are not authorized to delete this recipe.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id, authToken);
      alert("Recipe deleted successfully!");
      navigate('/'); // Redirect to home page after deletion
    } catch (err: any) {
      alert(err.message || "Failed to delete recipe.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading recipe...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 text-xl p-4">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-400 text-xl p-4">
        <p className="mb-4">Recipe not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const ingredientsToDisplay = recipe.ingredients ?? [];
  const instructionsToDisplay = recipe.instructions ?? [];
  
  // Check if the current user is the owner of the recipe
  // Corrected: Use user.id instead of user._id
  const isRecipeOwner = user && recipe.authorId === user.id;

  return (
    <div className="w-full min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-200 p-6 sm:p-8 rounded-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-700 hover:text-amber-800 transition-colors duration-300 text-lg font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Recipes
        </button>

        {/* Recipe Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-800 leading-tight mb-2">
            {recipe.title}
          </h1>
          <p className="text-gray-700 text-lg">
            by <span className="font-semibold">{recipe.author}</span>
          </p>
        </div>

        {/* Recipe Owner Actions: Edit & Delete Recipe */}
        {isRecipeOwner && (
          <div className="flex justify-center space-x-4 mb-8">
            <Link to={`/edit-recipe/${recipe.id}`} // Assuming you'll add an edit recipe page later
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
              Edit Recipe
            </Link>
            <button
              onClick={handleDeleteRecipe}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Delete Recipe
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:space-x-8 mb-10">
          {/* Image & Meta Info Section */}
          <div className="md:w-1/2 flex flex-col items-center">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-72 sm:h-96 object-cover rounded-lg shadow-xl mb-6" 
            />
            <div className="flex flex-wrap justify-around w-full bg-amber-50 p-4 rounded-lg shadow-md text-gray-800 text-center text-lg font-medium">
              <div className="flex items-center mx-2 my-1">
                <span className="text-yellow-500 text-2xl mr-1">★</span>
                <span>{recipe.rating?.toFixed(1) || 'N/A'} / 5</span>
                <span className="text-sm text-gray-500 ml-1">({recipe.ratingCount || 0} ratings)</span>
              </div>
              <div className="flex items-center mx-2 my-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-amber-700 mr-1">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.25h-3a.75.75 0 000 1.5h3.75a.75.70a.75.75 0 00.75-.75V5.75z" clipRule="evenodd" />
                </svg>
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center mx-2 my-1">
                <span role="img" aria-label="servings" className="text-amber-700 text-2xl mr-1">🍽️</span>
                <span>{recipe.servings}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{recipe.description}</p>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
            {ingredientsToDisplay.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700 text-lg space-y-3">
            {instructionsToDisplay.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {/* Ratings & Comments Section */}
        <div className="p-6 bg-gray-200 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Comments</h2>

          {/* Add Rating Form */}
          {user ? (
            <form onSubmit={handleRatingSubmit} className="mb-8 p-4 bg-gray-100 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Your Rating</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your Rating:
                </label>
                <StarRating value={newRatingValue} onChange={setNewRatingValue} />
              </div>
              <div className="mb-4">
                <label htmlFor="newComment" className="block text-gray-700 text-sm font-bold mb-2">
                  Your Comment:
                </label>
                <textarea
                  id="newComment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                  placeholder="Share your thoughts on this recipe..."
                ></textarea>
              </div>
              {submitRatingError && (
                <p className="text-red-500 text-sm mb-4">{submitRatingError}</p>
              )}
              <button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmittingRating || newRatingValue === 0}
              >
                {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          ) : (
            <p className="mb-8 text-gray-600 text-lg text-center">
              <Link to="/auth" className="text-amber-500 hover:underline font-semibold">Log in</Link> to add your rating and comments!
            </p>
          )}

          {/* List of Existing Ratings */}
          <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">User Reviews ({ratings.length})</h3>
          {ratingsLoading ? (
            <p className="text-gray-600 text-center">Loading comments...</p>
          ) : ratingsError ? (
            <p className="text-red-500 text-center">Error loading comments: {ratingsError}</p>
          ) : ratings.length === 0 ? (
            <p className="text-gray-600 text-center">No comments yet. Be the first to add one!</p>
          ) : (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border p-4 rounded-lg bg-off-white shadow-sm">
                  {editingRatingId === rating.id ? (
                    // Edit Rating Form
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Edit Your Rating</h4>
                      <div>
                        <StarRating value={editingRatingValue} onChange={setEditingRatingValue} />
                      </div>
                      <div>
                        <label htmlFor="editComment" className="block text-gray-700 text-sm font-bold mb-2">
                          Comment:
                        </label>
                        <textarea
                          id="editComment"
                          value={editingComment}
                          onChange={(e) => setEditingComment(e.target.value)}
                          rows={3}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                        ></textarea>
                      </div>
                      {updateRatingError && (
                        <p className="text-red-500 text-sm">{updateRatingError}</p>
                      )}
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isUpdatingRating}
                        >
                          {isUpdatingRating ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditCancel}
                          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Rating
                    <>
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-800 mr-2">{rating.user.username}</span>
                        <StarRating value={rating.value} readOnly />
                        <span className="text-gray-500 text-sm ml-auto">{rating.createdAt}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{rating.comment}</p>
                      {user && rating.user.id === user.id && ( // <--- Corrected: Use user.id here too
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(rating)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRating(rating.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;