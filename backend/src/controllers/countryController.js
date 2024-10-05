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
const getCountryInfo = async (req, res) => {
  const { countryCode } = req.params;

  try {
    // Fetch country info (including borders) from Nager.Date API
    const borderResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
    const countryName = borderResponse.data.commonName;
    const borderCountries = borderResponse.data.borders;

    // Fetch population data from countriesnow API
    const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
      country: countryName,
    });
    const populationData = populationResponse.data.data.populationCounts;

    // Fetch flag URL from countriesnow API
    const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryName,
    });
    const flagUrl = flagResponse.data.data.flag;

    // Return all data
    res.status(200).json({
      countryName: countryName,
      borders: borderCountries,
      populationData: populationData,
      flagUrl: flagUrl,
    });
  } catch (error) {
    // Improved error handling
    console.error("Error fetching country info:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching country info', error: error.message });
  }
};

module.exports = {
  getAvailableCountries,
  getCountryInfo,
};
