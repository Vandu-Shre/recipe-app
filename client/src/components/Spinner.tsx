// client/src/components/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
        role="status"
      >
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center">
        👨‍🍳 Yum recipes await thee...
      </h1>
      </div>
    </div>
  );
};

export default Spinner;