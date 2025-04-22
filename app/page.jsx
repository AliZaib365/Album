// HomePage.jsx
'use client';

import { useEffect, useState } from 'react';
import CategoryCard from './components/CategoryCard';
import CustomCard from './components/CustomCard';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_WALLPAPER_API_ALL_CATEGORIES);
        const json = await res.json();

        if (json?.categories && Array.isArray(json.categories)) {
          setCategories(json.categories);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-semibold mb-8 text-center text-[#e60076]">Wallpaper Categories</h1>
      <div className="flex flex-wrap">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
        <CustomCard /> {/* Add the custom card */}
      </div>
    </div>
  );
};

export default HomePage;
