import React from 'react';

function RefreshButton({ onRefresh, loading, darkMode = false }) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className={`w-full flex items-center justify-center px-4 py-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg shadow-sm text-sm font-medium ${loading ? (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500') : (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white')} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Refreshing...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Prices
        </>
      )}
    </button>
  );
}

export default RefreshButton;