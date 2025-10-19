import React, { useState, useEffect } from 'react'; //React and hooks
import axios from 'axios'; //axios: API calls
import { motion } from 'framer-motion'; //Framer Motion: animations
import { WiCloudy, WiRain, WiSnow, WiDaySunny } from 'react-icons/wi'; // weather icons

//weather properties
interface WeatherProps 
{
  city?: string; 
  unit: 'metric' | 'imperial';
  darkMode: boolean;
}
//weather data
interface WeatherData 
{
  temp: number; 
  description: string; 
  city: string; 
  humidity?: number; 
  windSpeed?: number; 
  sunrise?: number; 
  sunset?: number; 
}
//forecast data
interface ForecastData 
{
  list: Array<{ 
    dt_txt: string; 
    main: { temp: number }; 
    weather: Array<{ description: string }>; 
  }>;
}

const Weather: React.FC<WeatherProps> = ({ city, unit, darkMode }) => 
{
  //state initialization
  const [weather, setWeather] = useState<WeatherData | null>(null); 
  const [forecast, setForecast] = useState<ForecastData | null>(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [detailsOpen, setDetailsOpen] = useState(false); 
  //API key
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // 
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city || 'New York'}&appid=${API_KEY}&units=${unit}`; // Current weather API URL
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city || 'New York'}&appid=${API_KEY}&units=${unit}`; // Forecast API URL

  //fetch weather data on city
  useEffect(() => 
  { 
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          axios.get(weatherURL),
          axios.get(forecastURL),
        ]);
        if (mounted) {
          const { main, weather, name, wind, sys } = weatherResponse.data;
          setWeather({
            temp: main.temp,
            description: weather[0].description,
            city: name,
            humidity: main.humidity,
            windSpeed: wind.speed,
            sunrise: sys.sunrise,
            sunset: sys.sunset,
          });
          setForecast(forecastResponse.data);
        }
      } catch (err) {
        console.error('API Error:', err);
        if (axios.isAxiosError(err) && mounted) {
          setError(err.response?.data?.message || 'Failed to fetch weather data');
        } else if (mounted) {
          setError('An unexpected error occurred');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (city !== undefined) fetchData();
    return () => { mounted = false; };
  }, [city, unit, weatherURL, forecastURL]);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!weather || !forecast) return null;

  //get appropriate weather icon
  const getWeatherIcon = (description: string, isForecast = false) => 
  { 
    const lowerDesc = description.toLowerCase();
    const iconSize = isForecast ? 'text-4xl' : 'text-5xl';
    if (lowerDesc.includes('clear')) return <WiDaySunny className={`${iconSize} text-yellow-500`} />;
    if (lowerDesc.includes('cloud')) return <WiCloudy className={`${iconSize} text-gray-500`} />;
    if (lowerDesc.includes('rain')) return <WiRain className={`${iconSize} text-blue-500`} />;
    if (lowerDesc.includes('snow')) return <WiSnow className={`${iconSize} text-gray-300`} />;
    return <WiCloudy className={`${iconSize} text-gray-500`} />;
  };
  //format timestamp
  const formatTime = (timestamp: number) => 
  { 
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5); // Filter for 5-day forecast

  return (
    <motion.div
      className={`text-center p-6 rounded-2xl shadow-lg mt-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-blue-100 to-blue-200'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="text-5xl mb-4"
        initial={{ rotate: -15, y: -20 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        {getWeatherIcon(weather.description)}
      </motion.div>
      <motion.h2
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {weather.city}
      </motion.h2>
      <motion.p
        className="text-6xl font-extrabold mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        {Math.round(weather.temp)}°{unit === 'metric' ? 'C' : 'F'}
      </motion.p>
      <motion.p
        className="text-xl capitalize bg-white/50 p-2 rounded-full inline-block mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        {weather.description}
      </motion.p>

      {/* Details Section */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: detailsOpen ? 'auto' : 0, opacity: detailsOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className={`w-full text-left p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-200 hover:bg-blue-300'} transition-colors`}
        >
          {detailsOpen ? 'Hide Details' : 'Show Details'} ▼
        </button>
        {detailsOpen && (
          <div className="mt-2 text-left space-y-2">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
            <p>Sunrise: {formatTime(weather.sunrise!)}</p>
            <p>Sunset: {formatTime(weather.sunset!)}</p>
          </div>
        )}
      </motion.div>

      {/* 5-Day Forecast */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-6"
      >
        <h3 className="text-2xl font-semibold mb-2">5-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 bg-white/70 rounded-lg shadow-inner">
          {dailyForecast.map((day, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md flex flex-col items-center`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 + index * 0.1 }}
            >
              <p className="font-medium text-lg">{new Date(day.dt_txt).toLocaleDateString()}</p>
              <p className="text-2xl font-bold">{Math.round(day.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
              <p className="capitalize text-sm">{day.weather[0].description}</p>
              {getWeatherIcon(day.weather[0].description, true)}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
//export weather component
export default Weather; 