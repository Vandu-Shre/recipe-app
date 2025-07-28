// client/src/pages/RecipeListPage.tsx
import React from 'react';
import RecipeCard from '../components/RecipeCard';

const DUMMY_RECIPES = [
  {
    id: 'r1',
    image: 'https://picsum.photos/id/1080/400/300',
    title: 'Chicken Liver Salad',
    author: 'Valery Ponomarevas',
    rating: 4.7,
    time: '25 min',
    servings: 'Easy',
  },
  {
    id: 'r2',
    image: 'https://picsum.photos/id/282/400/300',
    title: 'Ultimate Tomahawk Steak',
    author: 'Hector Jimenez Bravo',
    rating: 4.9,
    time: '45 min',
    servings: 'Medium',
  },
  {
    id: 'r3',
    image: 'https://picsum.photos/id/238/400/300',
    title: 'Key West Chicken and Shrimp',
    author: 'Brenda Venable',
    rating: 4.6,
    time: '30 min',
    servings: 'Easy',
  },
  {
    id: 'r4',
    image: 'https://picsum.photos/id/292/400/300',
    title: 'Mediterranean Salmon',
    author: 'Chef Remy',
    rating: 4.8,
    time: '35 min',
    servings: 'Medium',
  },
  {
    id: 'r5',
    image: 'https://picsum.photos/id/296/400/300',
    title: 'Spicy Vegan Tacos',
    author: 'Plant-Based Pete',
    rating: 4.4,
    time: '20 min',
    servings: 'Easy',
  },
  {
    id: 'r6',
    image: 'https://picsum.photos/id/252/400/300',
    title: 'Classic Margherita Pizza',
    author: 'Valery Ponomarevas',
    rating: 4.2,
    time: '35 min',
    servings: 'Easy',
  },
  {
    id: 'r7',
    image: 'https://picsum.photos/id/1070/400/300',
    title: 'Hearty Lentil Soup',
    author: 'Hector Jimenez Bravo',
    rating: 4.9,
    time: '45 min',
    servings: 'Medium',
  },
  {
    id: 'r8',
    image: 'https://picsum.photos/id/1083/400/300',
    title: 'Berry Smoothie Bowl',
    author: 'Brenda Venable',
    rating: 4.5,
    time: '10 min',
    servings: 'Easy',
  },
];

const RecipeListPage = () => {
  return (
    <div
      className="min-h-screen py-8"
      // Background style is now handled globally in index.css
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
            Recipes
          </h1>
          <p className="text-white text-lg drop-shadow">The most popular holiday dishes</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Uncooked vegetarian food', 'Light Cuisine', 'High Proteins', 'Vegetarian', 'Fish', 'Vegan'].map((filter) => (
            <button key={filter} className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition duration-200 shadow-sm">
              {filter}
            </button>
          ))}
          <button className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition duration-200 shadow-sm flex items-center">
            Popular <span className="ml-1 text-gray-500">▼</span>
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition duration-200 shadow-sm flex items-center">
            More Filter <span className="ml-1 text-gray-500">▼</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DUMMY_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="py-3 px-10 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 ease-in-out"> {/* UPDATED: Button color to amber-800 */}
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeListPage;