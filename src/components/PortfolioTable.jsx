import React from 'react';

function PortfolioTable({ portfolio, loading, darkMode = false, onRemoveCoin }) {
  // Calculate total portfolio value
  const totalValue = portfolio.reduce((total, coin) => {
    return total + (coin.current_price * coin.quantity);
  }, 0);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'exceptZero'
    }).format(value / 100);
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading portfolio data...</p>
      </div>
    );
  }

  // If portfolio is empty, show empty state
  if (portfolio.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className={`rounded-full p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} mb-4`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your portfolio is empty</h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Add your first cryptocurrency using the form on the left</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Asset
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              24h
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Value
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {portfolio.map((coin) => {
            const coinValue = coin.current_price * coin.quantity;
            const priceChangeClass = coin.price_change_percentage_24h > 0 
              ? 'text-green-500' 
              : coin.price_change_percentage_24h < 0 
                ? 'text-red-500' 
                : darkMode ? 'text-gray-400' : 'text-gray-500';

            return (
              <tr key={coin.id} className={darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}>
                {/* Asset */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={coin.image} alt={coin.name} />
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{coin.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                
                {/* Price */}
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(coin.current_price)}
                </td>
                
                {/* 24h Change */}
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${priceChangeClass}`}>
                  <div className="flex items-center justify-end">
                    {coin.price_change_percentage_24h > 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : coin.price_change_percentage_24h < 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : null}
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </div>
                </td>
                
                {/* Quantity */}
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {coin.quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}
                </td>
                
                {/* Value */}
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(coinValue)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button 
                    onClick={() => onRemoveCoin(coin.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="row" colSpan="4" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Total Portfolio Value
            </th>
            <td className="px-6 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalValue)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default PortfolioTable;