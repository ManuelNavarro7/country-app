import Link from 'next/link';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function CountryListPage() {
  // Fetch the list of countries from the API
  const res = await fetch(`${backendUrl}/api/countries/available`);

  // Handle error if the request fails
  if (!res.ok) {
    return <h1>Failed to load countries</h1>;
  }

  const countries = await res.json();

  return (<div>
                <main className="flex justify-center items-center h-96 bg-cover bg-center main-bkg flex-col" >
                  <h1 className="text-9xl font-bold text-white-600 mb-4 fancy">Explore</h1>
                  <h1 className="text-9xl font-bold text-white-600 mb-4 fancy">Countries</h1>
                  <h1 className="text-9xl font-bold text-white-600 mb-4 fancy">Worldwide</h1>
                </main>
                <div className="px-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-5">
                {countries.map((country) => (
                  <div key={country.countryCode} className="p-4 border rounded-lg shadow-md">
                    <Link 
                      href={`/country-list/${country.countryCode}`} 
                      className="h-full w-full flex justify-center items-center text-center"
                    >
                      {country.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
 
  );
}