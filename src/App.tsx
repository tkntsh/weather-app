import React, { useState } from 'react'; //React and useState hook
import Weather from './components/Weather'; //Weather component
import Search from './components/Search'; //Search component

const App: React.FC = () => 
{
  //state initialization
  const [city, setCity] = useState<string>(''); 
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [darkMode, setDarkMode] = useState(false);

  //city search
  const handleSearch = (searchCity: string) => 
  { 
    console.log('Search triggered with:', searchCity);
    setCity(searchCity);
  };
  //metric:imperial toggle
  const toggleUnit = () => 
  { 
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };
  //toggle dark mode
  const toggleDarkMode = () => 
  { 
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative cloud-overlay ${darkMode ? 'dark' : ''}`}>
      <div className={`bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-4xl transform transition-all duration-300 hover:shadow-xl border border-blue-200 ${darkMode ? 'bg-gray-800/90 text-white' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Weather Forecast</h1>
          <div className="flex space-x-2">
            <button
              onClick={toggleUnit}
              className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-200 text-blue-800'} hover:bg-opacity-80 transition-colors`}
            >
              {unit === 'metric' ? '°C' : '°F'}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80 transition-colors`}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
        <Search onSearch={handleSearch} /> {/* Render Search component */}
        <Weather city={city} unit={unit} darkMode={darkMode} /> {/* Render Weather component */}
      </div>
    </div>
  );
};
//export app component
export default App; 