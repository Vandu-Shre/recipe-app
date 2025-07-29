// client/src/components/StarRating.tsx
import React from 'react';

interface StarRatingProps {
  value: number; // Current rating value (e.g., 3.5)
  onChange?: (value: number) => void; // Optional: function to call when rating changes
  readOnly?: boolean; // Optional: if true, stars are just for display
  maxStars?: number; // Optional: total number of stars, default 5
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readOnly = false, maxStars = 5 }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  for (let i = 1; i <= maxStars; i++) {
    let starClass = "text-gray-300"; // Empty star color
    if (i <= fullStars) {
      starClass = "text-yellow-500"; // Full star color
    } else if (hasHalfStar && i === fullStars + 1) {
      starClass = "text-yellow-500 opacity-50"; // Visual for half star
      // A more complex implementation would use SVG for true half stars
    }

    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 inline-block cursor-pointer ${readOnly ? 'cursor-default' : ''} ${starClass}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => !readOnly && onChange && onChange(i)}
        onMouseMove={(e) => { // Optional: for hover selection
          if (!readOnly && onChange) {
            const starRect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - starRect.left;
            // Simplified half-star logic for hover, might need refinement
            if (mouseX < starRect.width / 2) {
              onChange(i - 0.5); // Consider half star on left side
            } else {
              onChange(i);
            }
          }
        }}
        onMouseLeave={() => { // Reset on leave, if selecting
          if (!readOnly && onChange && value === 0) { // Only reset if not already selected
             // onChange(0); // If you want to clear on mouse leave
          }
        }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    );
  }

  return (
    <div className="flex items-center">
      {stars}
    </div>
  );
};

export default StarRating;