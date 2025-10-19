import React, { useState } from 'react'; //React and useState hook

interface SearchProps 
{
  //callback for search action
  onSearch: (city: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => 
{
  //search input state
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => 
  { 
    e.preventDefault();
    if (city.trim()) onSearch(city);
    //clear input after search
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={city}
        //update city state on input change
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};
//exporting search component
export default Search;