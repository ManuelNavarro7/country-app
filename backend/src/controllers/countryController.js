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
  let flagUrl;
  let iso3;

  try {
    const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryName,
    });
    flagUrl = flagResponse.data?.data?.flag || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Vlag_ontbreekt.svg/2560px-Vlag_ontbreekt.svg.png';
    iso3 = flagResponse.data?.data?.iso3;
  } catch (error) {
    console.log(`Error fetching flag with commonName (${countryName}), retrying with officialName (${officialName})`);
    try {
      const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
        country: officialName,
      });
      flagUrl = flagResponse.data?.data?.flag || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Vlag_ontbreekt.svg/2560px-Vlag_ontbreekt.svg.png';
      iso3 = flagResponse.data?.data?.iso3;
    } catch (error) {
      console.log(`Error fetching flag with officialName (${officialName})`);
      flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Vlag_ontbreekt.svg/2560px-Vlag_ontbreekt.svg.png'; // Fallback to default
      iso3 = null; // Fallback if iso3 is not available
    }
  }

  return { flagUrl, iso3 };
};

// Function to fetch population data with fallback to commonName, officialName, and iso3
const fetchPopulationData = async (countryName, officialName, iso3) => {
  let populationData;

  try {
    const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
      country: countryName,
    });
    populationData = populationResponse.data?.data?.populationCounts;
  } catch (error) {
    console.log(`Error fetching population with commonName (${countryName}), retrying with officialName (${officialName})`);
    try {
      const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
        country: officialName,
      });
      populationData = populationResponse.data?.data?.populationCounts;
    } catch (error) {
      console.log(`Error fetching population with officialName (${officialName}), retrying with iso3 (${iso3})`);
      try {
        const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
          iso3: iso3,
        });
        populationData = populationResponse.data?.data?.populationCounts;
      } catch (error) {
        console.log(`Error fetching population with iso3 (${iso3})`);
        throw new Error('Population data not available for this country');
      }
    }
  }

  return populationData;
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