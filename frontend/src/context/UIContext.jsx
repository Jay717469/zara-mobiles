import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  // Modal states
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search & Filter global states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategoryTab('all');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedStorage('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt-desc');
  };

  const handleSelectCategoryTab = (cat) => {
    setActiveCategoryTab(cat.id);
    if (cat.id === 'all') {
      setSelectedBrand('');
      setSelectedCategory('');
    } else if (cat.brand) {
      setSelectedBrand(cat.brand);
      setSelectedCategory('');
    } else if (cat.isAccessory) {
      setSelectedBrand('');
      setSelectedCategory('accessories');
    }
  };

  return (
    <UIContext.Provider
      value={{
        isOffersOpen,
        setIsOffersOpen,
        isInstagramOpen,
        setIsInstagramOpen,
        isExchangeOpen,
        setIsExchangeOpen,
        isFaqsOpen,
        setIsFaqsOpen,
        isContactOpen,
        setIsContactOpen,
        isFilterOpen,
        setIsFilterOpen,

        searchQuery,
        setSearchQuery,
        activeCategoryTab,
        setActiveCategoryTab,
        handleSelectCategoryTab,
        selectedBrand,
        setSelectedBrand,
        selectedCategory,
        setSelectedCategory,
        selectedStorage,
        setSelectedStorage,
        selectedCondition,
        setSelectedCondition,
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        sortBy,
        setSortBy,
        resetFilters,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
