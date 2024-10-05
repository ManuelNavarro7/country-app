const axios = require('axios');

// Get Available Countries
const getAvailableCountries = async (req, res) => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available countries' });
  }
};
// Get detailed country info
// Function to fetch flag data and return flag URL and iso3 code
const fetchFlagData = async (countryName, officialName) => {
  const defaultFlagUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Vlag_ontbreekt.svg/2560px-Vlag_ontbreekt.svg.png';

  const requests = [
    axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', { country: countryName }),
    axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', { country: officialName }),
  ];

  // Use Promise.allSettled to attempt both requests in parallel
  const results = await Promise.allSettled(requests);

  // Iterate over the results and return the first successful response
  for (let result of results) {
    if (result.status === 'fulfilled') {
      const flagUrl = result.value.data?.data?.flag || defaultFlagUrl;
      const iso3 = result.value.data?.data?.iso3;
      return { flagUrl, iso3 };
    }
  }

  // If both requests fail, return the default flag URL and null iso3
  return { flagUrl: defaultFlagUrl, iso3: null };
};


// Function to fetch population data with fallback to commonName, officialName, and iso3
const fetchPopulationData = async (countryName, officialName, iso3) => {
  const requests = [
    axios.post('https://countriesnow.space/api/v0.1/countries/population', { country: countryName }),
    axios.post('https://countriesnow.space/api/v0.1/countries/population', { country: officialName }),
    iso3 ? axios.post('https://countriesnow.space/api/v0.1/countries/population', { iso3: iso3 }) : Promise.reject('No iso3 available'),
  ];

  // Use Promise.allSettled to attempt all requests in parallel
  const results = await Promise.allSettled(requests);

  // Iterate over the results and return the first successful response
  for (let result of results) {
    if (result.status === 'fulfilled') {
      const populationData = result.value.data?.data?.populationCounts;
      if (populationData) {
        return populationData;
      }
    }
  }

  throw new Error('Population data not available for this country');
};

// Main function to get country info
const getCountryInfo = async (req, res) => {
  const { countryCode } = req.params;

  try {
    // Fetch country info (including borders) from Nager.Date API
    const borderResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
    
    // Get commonName and officialName
    const countryName = borderResponse.data.commonName;
    const officialName = borderResponse.data.officialName;

    // Fetch flag data and iso3
    const { flagUrl, iso3 } = await fetchFlagData(countryName, officialName);

    // Fetch population data with fallback to iso3
    const populationData = await fetchPopulationData(countryName, officialName, iso3);

    // Return all data
    res.status(200).json({
      countryName: countryName || officialName,
      borders: borderResponse.data.borders,
      populationData: populationData,
      flagUrl: flagUrl,
    });
  } catch (error) {
    // Centralized error handling
    console.error("Error fetching country info:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching country info', error: error.message });
  }
};

module.exports = {
  getAvailableCountries,
  getCountryInfo,
};