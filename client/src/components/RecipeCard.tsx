// client/src/components/RecipeCard.tsx
import React from 'react';

interface RecipeCardProps {
  id: string;
  image: string;
  title: string;
  author: string;
  rating: number;
  time: string;
  servings: string;
  ratingCount: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ image, title, author, rating, time, servings, ratingCount }) => {
  return (
    // Added 'h-full' to make the card take the full height available in its grid cell
    <div className="bg-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col h-full">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        {/* 'line-clamp-2' will limit the title to 2 lines, truncating with ellipses if longer */}
        <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h3>
        {/* 'line-clamp-1' for author and static text to ensure they don't wrap unexpectedly */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">{author}</p>
        <p className="text-gray-500 text-xs line-clamp-1">Cookbook Author, Little</p>

        <div className="flex items-center text-gray-700 text-sm mt-auto pt-3">
          <div className="flex items-center mr-3">
            <span className="text-yellow-500 text-base">★</span>
            <span className="ml-1">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({ratingCount})</span>
          </div>
          <div className="flex items-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v4.25h-3a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V5.75z" clipRule="evenodd" />
            </svg>
            <span className="ml-1">{time}</span>
          </div>
          <div className="flex items-center">
            <span role="img" aria-label="user" className="text-gray-500 mr-1">🍽️</span>
            <span>{servings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;