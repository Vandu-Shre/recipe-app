// client/src/pages/HomePage.tsx
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-40">
      <h2 className="text-4xl font-lora font-semibold text-white tracking-wide text-center"> {/* Added text-center here too for robustness */}
        Your Culinary Journey Begins Here
      </h2>
    </div>
  );
};

export default HomePage;