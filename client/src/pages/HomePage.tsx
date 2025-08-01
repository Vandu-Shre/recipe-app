import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipeService, { type Recipe } from '../services/recipeService';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import BreakfastCategory from '../assets/categories/BreakfastCategory.jpeg'
import SoupCategory from '../assets/categories/SoupCategory.jpeg'
import ChineseCategory from '../assets/categories/ChineseCategory.jpeg'
import IndianCategory from '../assets/categories/IndianCategory.jpeg'
import ItalianCategory from '../assets/categories/ItalianCategory.jpeg'
import MexicanCategory from '../assets/categories/MexicanCategory.jpeg'
import PizzaCategory from '../assets/categories/PizzaCategory.jpeg'
import DessertCategory from '../assets/categories/DessertCategory.jpeg'
import BeveragesCategory from '../assets/categories/BeveragesCategory.jpeg'



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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: 'Breakfast', image: BreakfastCategory  },
    { name: 'Soup', image: SoupCategory },
    { name: 'Indian', image: IndianCategory },
    { name: 'Chinese', image: ChineseCategory },
    { name: 'Italian', image: ItalianCategory },
    { name: 'Mexican', image: MexicanCategory },
    { name: 'Pizza', image: PizzaCategory },
    { name: 'Dessert', image: DessertCategory },
    { name: 'Beverages', image: BeveragesCategory },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await recipeService.getRecipes();
        setRecipes(fetchedRecipes);
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
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl font-[Poppins] bg-neutral-50">
        Loading recipes...
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
    <div className="w-full font-[Poppins] py-8 min-h-screen bg-neutral-50">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 text-center sr-only">
        👨‍🍳 Yum recipes await thee!
      </h1>
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg">
        {recipes.length > 0 ? (
          <Slider {...sliderSettings}>
            {recipes.map((recipe) => (
              <div key={recipe.id}>
                <Link to={`/recipes/${recipe.id}`}>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-96 md:h-[600px] object-cover"
                  />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="flex items-center justify-center h-96 md:h-[600px]">
            <p className="text-gray-600 text-center text-lg">No recipes found. Be the first to add one!</p>
          </div>
        )}
      </div>
      <div className="mt-16 w-full max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 sr-only">Browse Categories</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center">
              <Link to={`/recipes?category=${category.name}`} className="group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <p className="mt-3 text-sm md:text-base font-semibold text-gray-700 text-center">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;