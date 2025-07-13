import { useState, useEffect } from 'react';
import AddTokenForm from './components/AddTokenForm';
import PortfolioTable from './components/PortfolioTable';
import RefreshButton from './components/RefreshButton';
import { fetchCoinData } from './services/coingecko';

function App() {
  // State for portfolio items
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load portfolio from localStorage on initial render
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio);
        setPortfolio(parsedPortfolio);
        refreshPortfolioData(parsedPortfolio.map(item => item.id));
      } catch (err) {
        console.error('Error parsing saved portfolio:', err);
      }
    }

    // Check for user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (portfolio.length > 0) {
      localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
    }
  }, [portfolio]);

  // Function to add a new coin to the portfolio
  const handleAddCoin = async (coinId, quantity) => {
    try {
      setLoading(true);
      setError('');

      // Check if coin already exists in portfolio
      const existingCoin = portfolio.find(coin => coin.id === coinId);
      if (existingCoin) {
        // Update quantity if coin already exists
        const updatedPortfolio = portfolio.map(coin => 
          coin.id === coinId 
            ? { ...coin, quantity: coin.quantity + quantity } 
            : coin
        );
        setPortfolio(updatedPortfolio);
        return;
      }

      // Fetch coin data from API
      const coinData = await fetchCoinData([coinId]);
      
      if (!coinData || coinData.length === 0) {
        throw new Error(`Coin with ID "${coinId}" not found`);
      }

      // Add quantity to coin data
      const newCoin = { ...coinData[0], quantity };
      
      // Add new coin to portfolio
      setPortfolio(prevPortfolio => [...prevPortfolio, newCoin]);
    } catch (err) {
      setError(err.message);
      console.error('Error adding coin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh portfolio data
  const refreshPortfolioData = async (coinIds = null) => {
    if (portfolio.length === 0) return;

    try {
      setLoading(true);
      setError('');

      // If coinIds not provided, use existing portfolio coin IDs
      const ids = coinIds || portfolio.map(coin => coin.id);
      
      // Fetch updated coin data
      const updatedCoinsData = await fetchCoinData(ids);
      
      // Update portfolio with new data while preserving quantities
      const updatedPortfolio = portfolio.map(portfolioCoin => {
        const updatedCoin = updatedCoinsData.find(coin => coin.id === portfolioCoin.id);
        return updatedCoin 
          ? { ...updatedCoin, quantity: portfolioCoin.quantity } 
          : portfolioCoin;
      });
      
      setPortfolio(updatedPortfolio);
    } catch (err) {
      setError('Failed to refresh portfolio data');
      console.error('Error refreshing portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a coin from portfolio
  const handleRemoveCoin = (coinId) => {
    setPortfolio(prevPortfolio => prevPortfolio.filter(coin => coin.id !== coinId));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              🪙 Crypto Portfolio
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Track your crypto investments in real-time
            </p>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-gray-700'}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Card with glass effect */}
            <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800/80' : 'bg-white/80 backdrop-blur-sm'}`}>
              <div className="p-6">
                <AddTokenForm onAddCoin={handleAddCoin} darkMode={darkMode} />
              </div>
            </div>
            
            {/* Refresh button */}
            <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800/80' : 'bg-white/80 backdrop-blur-sm'} p-6`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Actions</h3>
              <RefreshButton onRefresh={() => refreshPortfolioData()} loading={loading} />
            </div>

            {/* Stats card */}
            {portfolio.length > 0 && (
              <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800/80' : 'bg-white/80 backdrop-blur-sm'} p-6`}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Portfolio Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Assets:</span>
                    <span className="font-medium">{portfolio.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Last Updated:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800/80' : 'bg-white/80 backdrop-blur-sm'}`}>
              <PortfolioTable 
                portfolio={portfolio} 
                loading={loading} 
                darkMode={darkMode} 
                onRemoveCoin={handleRemoveCoin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
