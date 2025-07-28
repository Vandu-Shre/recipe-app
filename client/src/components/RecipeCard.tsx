// client/src/components/RecipeCard.tsx
import React from 'react';

interface RecipeCardProps {
  id: string;
  image: string;
  title: string;
  author: string;
  rating: number; // e.g., 4.5
  time: string;   // e.g., "25 min"
  servings: string; // e.g., "4 servings" or "Easy"
}

const RecipeCard: React.FC<RecipeCardProps> = ({ id, image, title, author, rating, time, servings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">By {author}</p>
        
        <div className="flex items-center text-gray-700 text-sm mb-4 mt-auto"> {/* mt-auto pushes content to bottom */}
          {/* Star Rating Placeholder */}
          <div className="flex items-center mr-3">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{rating.toFixed(1)} ({Math.floor(rating * 20)})</span> {/* Example: 4.5 (90) */}
          </div>
          {/* Time Icon Placeholder */}
          <div className="flex items-center mr-3">
            <span role="img" aria-label="clock" className="text-gray-500 mr-1">🕒</span>
            <span>{time}</span>
          </div>
          {/* Servings/Difficulty Icon Placeholder */}
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