import { IoIosSearch } from "react-icons/io";
import { useState } from "react";

const SearchBar = ({ className = "", placeholder = "Search books", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className={className}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
        <div 
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={handleSearch}
        >
          <IoIosSearch className="h-5 w-5 text-slate-400 hover:text-slate-200 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;