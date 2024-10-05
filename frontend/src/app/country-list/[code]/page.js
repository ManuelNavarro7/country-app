'use client'; // This component will now be treated as a Client Component
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for react-chartjs-2 charts

export default function CountryPage({ params }) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // Example of useRef usage

  useEffect(() => {
    async function fetchCountryData() {
      const codeUppercase = params.code.toUpperCase();
      const res = await fetch(`${backendUrl}/api/countries/info/${codeUppercase}`);
      
      if (res.ok) {
        const countryData = await res.json();
        setCountry(countryData);
      } else {
        setCountry(null);
      }
      setLoading(false);
    }

    fetchCountryData();
  }, [params.code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!country) {
    return (
    <div>
          <h1>Country not found</h1>
          <div className="mt-8">
          <Link className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300" href="/">
              Go Back to Home
          </Link>
        </div>
    </div>
   
  );
  }

  const populationData = {
    labels: country.populationData.map((entry) => entry.year),
    datasets: [
      {
        label: 'Population Over Time',
        data: country.populationData.map((entry) => entry.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  {/* Country Name and Flag */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold text-gray-800">{country.countryName}</h1>
    <img
      src={country.flagUrl}
      alt={`Flag of ${country.countryName}`}
      className="w-32 h-auto rounded-lg shadow-md"
    />
  </div>

{/* Border Countries Section */}
<div className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Border Countries</h2>
  {country.borders && country.borders.length > 0 ? (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {country.borders.map((borderCountry) => (
        <li key={borderCountry.countryCode} className="bg-gray-100 border border-gray-300 rounded-lg shadow h-full">
          <Link href={`/country-list/${borderCountry.countryCode}`} className="block h-full w-full flex justify-center items-center text-center p-4">
            <span className="text-blue-600 hover:underline">
              {borderCountry.commonName}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600">No border countries available.</p>
  )}
</div>

  {/* Population Chart Section */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Population Over Time</h2>
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <div style={{ width: '100%', height: '400px' }}>
        <Line ref={chartRef} data={populationData} />
      </div>
    </div>
  </div>

  <div className="mt-8">
    <Link className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300" href="/">
        Go Back to Home
    </Link>
  </div>
</div>


  );
}
