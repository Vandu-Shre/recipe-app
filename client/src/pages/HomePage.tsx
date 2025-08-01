import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService from '../services/recipeService';
import type { IFrontendRecipe } from '../interfaces/recipe';
import HomePageBanner from '../assets/HomePageBanner.jpeg';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute top-1/2 left-4 z-10 cursor-pointer p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
    onClick={onClick}
  >
    <ArrowLeftIcon className="h-6 w-6" />
  </div>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute top-1/2 right-4 z-10 cursor-pointer p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
    onClick={onClick}
  >
    <ArrowRightIcon className="h-6 w-6" />
  </div>
);

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<IFrontendRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await recipeService.getRecipes();
        const sortedRecipes = fetchedRecipes
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        setRecipes(sortedRecipes);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl font-[Poppins] bg-neutral-50">
        👨‍🍳 Yum recipes await thee...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-[Poppins] bg-neutral-50">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full font-[Poppins] min-h-screen bg-neutral-50">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center sr-only">
        Yum recipes await thee!
      </h1>
      
      <div className="w-full relative">
        <img 
          src={HomePageBanner} 
          alt="Food banner" 
          className="w-full h-[30rem] md:h-[55rem] object-cover" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white text-3xl md:text-5xl font-bold font-[Poppins] drop-shadow-md p-4 leading-relaxed tracking-wide">
            Your ultimate guide<br />to culinary inspiration.
          </p>
          <Link to="/recipes">
            <button className="mt-8 px-8 py-4 text-lg md:text-xl font-bold bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300 transform hover:scale-105">
              Explore Recipes
            </button>
          </Link>
        </div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto mt-16 px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold font-[Poppins] text-orange-500 mb-8">
          Newly Added Recipes
        </h2>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-0 mb-16">
        {recipes.length > 0 ? (
          <Slider {...sliderSettings}>
            {recipes.map((recipe) => (
              <div key={recipe.id} className="p-2">
                <Link to={`/recipes/${recipe.id}`}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-80 object-cover rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
                  />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="flex items-center justify-center h-96 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-center text-lg">No recipes found. Be the first to add one!</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto text-center py-8 px-4">
        <h3 className="text-2xl font-semibold text-gray-700 font-[Poppins]">
          Hungry for something new? 
          <Link to="/recipes" className="text-orange-500 hover:text-orange-600 ml-2 hover:underline">
            Explore all our recipes!
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default HomePage;