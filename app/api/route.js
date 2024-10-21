import { NextResponse } from "next/server"; //Import Next Response from the next/server module
import menuData from '../api/data/menu.json'; //Import the menu data from the data folder




console.log('Line 3 in app/api/menu/index.js');//debuggin code
export async function GET(req) {
  console.log("You have reached the API route");//debuggin code
  const { searchParams } = new URL(req.url);//searchParams object is created from the URL object
  const filter = searchParams.get('filter');//get the filter parameter from the searchParams object
  const value = searchParams.get('value');//get the value parameter from the searchParams object

  let responseData = menuData;//store the initial menu data in the responseData variable

  if (filter && value) {
    responseData = menuData.filter(item => {//if there is a filter selected, then filter the data based ont the filter selected
      if (filter === 'category') {
        return item.category.toLowerCase() === value.toLowerCase();//filter
      } else if (filter === 'restaurantName') {
        return item.restaurantName.toLowerCase() === value.toLowerCase();//filter
      } else if (filter === 'delivery') {
        return item.delivery.toLowerCase() === value.toLowerCase();//filter
      }
      console.log("No filter applied");//debuggin code
      return false;
    });
  }

  return NextResponse.json(responseData, { status: 200 });//return the data as a JSON object
  
}
