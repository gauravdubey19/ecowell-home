'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { CiFilter } from "react-icons/ci";
import { CgSortAz } from "react-icons/cg";
import ProductCard from "../../ui/productCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory) params.append('category', activeCategory);
        if (sort) params.append('sort', sort);
        params.append('page', '1');
        params.append('limit', '12');

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        setProducts(data.products);
        setCategories(data.categories);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, sort]);

  const handleSort = (value) => {
    setSort(value);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? '' : category);
  };

  const loadPage = async (pageNumber) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory) params.append('category', activeCategory);
      if (sort) params.append('sort', sort);
      params.append('page', pageNumber.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 mt-28">
      <div className="w-full h-fit flex-center">
        <Button variant="link" size="sm" className="text-md">
          <CiFilter size={20} />
          Filter
        </Button>
      </div>
      <div className="flex-between space-x-4 overflow-x-auto mt-4 text-lg text-primary-clr border-b-2 border-primary-clr pb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`whitespace-nowrap ${
              activeCategory === category 
              ? 'text-secondary-clr' 
              : 'hover:text-secondary-clr'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-xl font-medium">
          {loading ? 'Loading...' : `${pagination.totalProducts} Products`}
          {activeCategory && ` in ${activeCategory}`}
        </h1>
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-md"
            onClick={() => {
              const menu = document.getElementById('sortMenu');
              menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }}
          >
            <CgSortAz size={20} />
            Sort by
          </Button>
          <div 
            id="sortMenu" 
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden z-10"
          >
            <div className="py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => handleSort('price-low-high')}
              >
                Price: Low to High
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => handleSort('price-high-low')}
              >
                Price: High to Low
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => handleSort('rating')}
              >
                Highest Rated
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => handleSort('newest')}
              >
                Newest First
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8 mb-8">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${
                    pagination.currentPage === i + 1
                      ? 'bg-[#004D3C] text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => loadPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;