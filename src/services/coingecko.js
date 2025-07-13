/**
 * CoinGecko API service
 * Handles API calls to the CoinGecko API
 */

// Base URL for CoinGecko API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch coin data for the specified coin IDs
 * @param {string[]} coinIds - Array of coin IDs to fetch data for
 * @returns {Promise<Array>} - Promise resolving to an array of coin data
 */
export const fetchCoinData = async (coinIds) => {
  try {
    if (!coinIds || coinIds.length === 0) {
      return [];
    }

    // Join coin IDs with comma for API request
    const ids = coinIds.join(',');

    // Fetch data from CoinGecko API
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw error;
  }
};

/**
 * Search for coins by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Promise resolving to an array of search results
 */
export const searchCoins = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }

    // Fetch search results from CoinGecko API
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract and format coin data from search results
    const coins = data.coins.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large || coin.thumb,
      market_cap_rank: coin.market_cap_rank
    }));

    return coins;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};