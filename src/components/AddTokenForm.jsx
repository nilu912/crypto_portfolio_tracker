import { useState } from 'react';
import { searchCoins } from '../services/coingecko';

function AddTokenForm({ onAddCoin, darkMode = false }) {
  const [coinId, setCoinId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!coinId) {
      setError('Please select a coin');
      return;
    }
    
    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    
    // Clear error if validation passes
    setError('');
    
    // Call the onAddCoin function from props
    await onAddCoin(coinId, parseFloat(quantity));
    
    // Reset form fields
    setCoinId('');
    setQuantity('');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle search input change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setCoinId('');
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await searchCoins(query);
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } catch (err) {
      console.error('Error searching coins:', err);
      setError('Failed to search coins');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a coin from search results
  const handleSelectCoin = (coin) => {
    setCoinId(coin.id);
    setSearchQuery(coin.name);
    setSearchResults([]);
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Add New Token
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-3 border-red-500 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coin search with autocomplete */}
        <div className="relative">
          <label 
            htmlFor="searchQuery" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Search Coin
          </label>
          <div className="relative">
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or symbol"
              className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {searchResults.map((coin) => (
                  <li 
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin)}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="h-6 w-6 mr-3 rounded-full" />
                      )}
                      <div className="flex flex-col">
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{coin.name}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Quantity input */}
        <div>
          <label 
            htmlFor="quantity" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            step="any"
            min="0"
            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Add to Portfolio
        </button>
      </form>
    </div>
  );
}

export default AddTokenForm;