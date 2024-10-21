"use client";

import { useState, useEffect } from 'react';// useState, useEffect from react



export default function Home() {
  const [menuItems, setMenuItems] = useState([]); //useState to store the menu items
  const [filter, setFilter] = useState({ filter: '', value: '' }); //useState to store the filter
  const [options, setOptions] = useState([]);//useState to store the options - this is so there are different options that can be displayed depending on the filter selected
  console.log('Line 10');//debugging code
  useEffect(() => {//useEffect hook to fetch all items and display them initially without any parameters
    console.log('Fetching menu items...');//debugging code
    // Fetch all menu items initially
    fetchMenuItems();
  }, []);
  
  const fetchMenuItems = async (filterParams) => { //once initial load, fetch the menu items is dependent on the filtered parameters
    let url = '/api/'; //call the api file
    console.log('Making request to:', url);//debugging code
    if (filterParams && filterParams.filter && filterParams.value) { //if there are filter parameters, then add them to the url
      url += `?filter=${filterParams.filter}&value=${filterParams.value}`;
    }
    try {
      // const res = await fetch('http://localhost:3000/api/');//debuging code
      const res = await fetch(url);//fetch the data from the url
      if (!res.ok) {//if the response is not ok, then throw an error
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();//convert the response to json
      setMenuItems(data);//set the menu items to the data that is returned in the response
    } catch (error) {
      console.error('Error fetching menu items:', error);//if there is an error, then log the error
    }
  };
  const handleFilterChange = (e) => {//function to handle the filter change
    const { name, value } = e.target;//get the name and value of the target that is selected
    setFilter({ ...filter, [name]: value });//set the filter based on the name and value
    // Set options based on selected filter
    if (name === "filter") {//if the name is filter, then set the options based on the filter selected
      let newOptions = [];
      if (value === "category") {
        newOptions = [...new Set(menuItems.map(item => item.category))];//set the options based on the categories available in the JSON
      } else if (value === "restaurantName") {
        newOptions = [...new Set(menuItems.map(item => item.restaurantName))];//set the options based on the restaurant names available in the JSON
      } else if (value === "delivery") {
        newOptions = [...new Set(menuItems.map(item => item.delivery))];//set the options based on the delivery options available in the JSON
      }
      setOptions(newOptions);//set the options based on the newOptions
      setFilter({ filter: value, value: '' }); // Reset value when filter changes
    }
  };

  const handleValueChange = (e) => {
    setFilter({ ...filter, value: e.target.value });
  };

  const applyFilter = () => {
    fetchMenuItems(filter);
  };

//HTML code to display the menu items
  return (
    <div className="flex flex-col items-center min-h-screen p-8 sm:p-20 bg-gray-100">
      <main className="flex flex-col gap-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Menu Items</h1>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="filter"
              onChange={handleFilterChange}
              value={filter.filter}
              className="p-2 rounded border border-gray-300 bg-white"
            >
              <option value="">Filter by...</option>
              <option value="category">Category</option>
              <option value="restaurantName">Restaurant Name</option>
              <option value="delivery">Delivery Option</option>
            </select>
            <select
              name="value"
              onChange={handleValueChange}
              value={filter.value}
              disabled={!filter.filter}
              className="p-2 rounded border border-gray-300 bg-white"
            >
              <option value="">Select value...</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={applyFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Apply Filter
            </button>
          </div>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{item.itemName}</h3>
              <p className="text-gray-600 mb-2">{item.itemDescription}</p>
              <p className="text-sm text-gray-700">Category: {item.category}</p>
              <p className="text-sm text-gray-700">Price: ${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-700">Restaurant: {item.restaurantName}</p>
              <p className="text-sm text-gray-700">Delivery: {item.delivery}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}