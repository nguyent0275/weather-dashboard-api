let currentDate = dayjs().format("MMMM DD YYYY");
let previousLocation = $("#locations");
let weatherDivContainer = $("#weather");
let forecastDivContainer = $("#forecast");
let arraySavedCities = localStorage.getItem("cities"); //string
var cities = [];
if (arraySavedCities && arraySavedCities.length > 0) {
  const savedCities = JSON.parse(arraySavedCities); //array
  if (savedCities && savedCities.length > 0) {
    loadSavedLocations(savedCities);
  }
}
// empty array that will be populated by each of the user's inputs

// search button will run 2 functions,
// 1. a function for populating the page with html and data
// 2. a fuction for creating save data and redirect buttons
// $("#search").on("click", createElement);
$("#search").on("click", saveLocation);

// clear the html of the divs and repopulate them
async function createElement() {
  weatherDivContainer.html("");
  forecastDivContainer.html("");
  $("#loading-icon").css("display", "block");
  await requestLocation();
}

// clears the local storage and the html of the div
$("#delete").on("click", clearData);

function clearData() {
  previousLocation.html("");
  localStorage.clear();
  cities = [];
}

// saving the user data and storing to local storage
function saveCities() {
  const stringifiedCities = JSON.stringify(cities);
  localStorage.setItem("cities", stringifiedCities);
}

// getting array from local storage and creating buttons to redirect user to previous searches
function loadSavedLocations(savedCitiesToLoad) {
  for (let i = 0; i < savedCitiesToLoad.length; i++) {
    //create
    let storedCity = $("<button>");
    //attr
    cities.push(savedCitiesToLoad[i]);
    storedCity.text(savedCitiesToLoad[i]);
    storedCity.click(() => {
      $("#city").val(savedCitiesToLoad[i]);
      createElement();
    });
    //append
    previousLocation.append(storedCity);
  }
}

// saves the user search as a button and appends to page
function saveLocation() {
  let userLocation = $("#city").val();
  const citiesLowerCase = cities.map((city) => city.toLowerCase());
  const duplicate = citiesLowerCase.includes(userLocation.toLowerCase());
  if (userLocation && !duplicate) {
    cities.push(userLocation);
    saveCities();
    //create
    let previousCity = $("<button>");
    //attr
    previousCity.text(userLocation);
    previousCity.click(() => {
      $("#city").val(userLocation);
      createElement();
    });
    //append
    previousLocation.append(previousCity);
    createElement();
    $("#city").val("");
  } else {
    alert("Dupicate location or invalid data");
    const filteredCities = cities.filter((city) => city !== userLocation);
    const stringifiedCities = JSON.stringify(filteredCities);
    localStorage.setItem("cities", stringifiedCities);
    $("#city").val("");
  }
}

// uses geo coding api to take user input and returns a latitude and longitude cooordinate
async function requestLocation() {
  let geoAPIUrl = "https://api.openweathermap.org/geo/1.0/direct?";
  let locationQuery = $("#city").val();
  let geoParameters = {
    q: locationQuery,
    limit: 1,
    appid: "161b355a9dd41b55204725cd903f95ab",
  };
  let geoSearchParams = new URLSearchParams(geoParameters);
  let locationURL = geoAPIUrl + geoSearchParams;
  let geoResponse = await fetch(locationURL);
  $("#loading-icon").css("display", "none");
  let geoJsonData = await geoResponse.json();
  if (geoJsonData && geoJsonData.length > 0) {
    let latitude = geoJsonData[0].lat;
    let longitude = geoJsonData[0].lon;
    await requestWeather(latitude, longitude);
    await requestForecast(latitude, longitude);
  } else {
    alert("Please input a valid location");
    const citiesLowerCase = cities.map((city) => city.toLowerCase());
    const duplicate = citiesLowerCase.includes(locationQuery.toLowerCase());
    if (duplicate) {
      const filteredCities = cities.filter((city) => city !== locationQuery);
      const stringifiedCities = JSON.stringify(filteredCities);
      localStorage.setItem("cities", stringifiedCities);
    }
    $("#city").val("");
  }
}

// passes the latitude and longitude from the geocode api to request the weather of the specified location
async function requestWeather(latitude, longitude) {
  let weatherAPIUrl = "https://api.openweathermap.org/data/2.5/weather?";
  let weatherParameters = {
    lat: latitude,
    lon: longitude,
    units: "imperial",
    appid: "161b355a9dd41b55204725cd903f95ab",
  };
  let weatherSearchParams = new URLSearchParams(weatherParameters);
  let weatherURL = weatherAPIUrl + weatherSearchParams;
  console.log(weatherURL);
  let weatherResponse = await fetch(weatherURL);
  let weatherJsonData = await weatherResponse.json();
  weatherTodayEl(weatherJsonData);
}

// passes the latitude and longitude from the geocode api to request the next 5 day forecast of the specified location
async function requestForecast(latitude, longitude) {
  let forecastAPIUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  let forecastParameters = {
    lat: latitude,
    lon: longitude,
    units: "imperial",
    appid: "161b355a9dd41b55204725cd903f95ab",
  };
  let forecastSearchParams = new URLSearchParams(forecastParameters);
  let forecastURL = forecastAPIUrl + forecastSearchParams;
  console.log(forecastURL);
  let forecastResponse = await fetch(forecastURL);
  let forecastJsonData = await forecastResponse.json();
  fiveDayForecastEl(forecastJsonData);
}

// url for getting icon based on the weather data
let iconUrl = "https://openweathermap.org/img/wn/";
let iconTag = "@2x.png";

// populates the page with html elements that contain info from the weatherapi fetch for today's weather data
function weatherTodayEl(weatherJsonData) {
  //create
  let todayContainer = $("<div>");
  let todayDate = $("<h1>");
  let weatherContainer = $("<ul>");
  let weatherIcon = $("<img>");
  let temp = $("<li>");
  let wind = $("<li>");
  let humidity = $("<li>");
  //attr
  todayContainer.addClass("today");
  todayDate.text($("#city").val() + " " + currentDate);
  weatherContainer.addClass("today");
  weatherIcon.attr("src", iconUrl + weatherJsonData.weather[0].icon + iconTag);
  temp.text("Temperature: " + weatherJsonData.main.temp + " °F");
  wind.text("Wind: " + weatherJsonData.wind.speed + " mph");
  humidity.text("Humidity: " + weatherJsonData.main.humidity + " %");
  //append
  $(weatherDivContainer).append(todayContainer);
  todayContainer.append(todayDate);
  todayContainer.append(weatherIcon);
  todayContainer.append(weatherContainer);
  weatherContainer.append(temp);
  weatherContainer.append(wind);
  weatherContainer.append(humidity);
}

// populates the page with html elements that contain info from the weather api fetch for forecast data
function fiveDayForecastEl(forecastJsonData) {
  let forecastContainer = $("<div>");
  let forecastText = $("<h2>");
  forecastContainer.addClass("forecast-container");
  forecastText.text("5 Day Forecast");
  $(forecastDivContainer).append(forecastText);
  $(forecastDivContainer).append(forecastContainer);

  for (let i = 0; i < 5; i++) {
    //create
    let forecastBox = $("<div>");
    let forecastDate = $("<h3>");
    let forecastIcon = $("<img>");
    let forecastTemp = $("<li>");
    let forecastWind = $("<li>");
    let forecastHumidity = $("<li>");

    //attr
    forecastBox.addClass("forecast");
    forecastDate.text(
      "Forecast Date: " +
        dayjs()
          .add(i + 1, "day")
          .format("MMMM DD YYYY")
    );
    forecastIcon.attr(
      "src",
      iconUrl + forecastJsonData.list[i].weather[0].icon + iconTag
    );
    forecastTemp.text(
      "Temperature: " + forecastJsonData.list[i].main.temp + " °F"
    );
    forecastWind.text("Wind: " + forecastJsonData.list[i].wind.speed + " mph");
    forecastHumidity.text(
      "Humidity: " + forecastJsonData.list[i].main.humidity + " %"
    );

    //append
    forecastContainer.append(forecastBox);
    forecastBox.append(forecastDate);
    forecastBox.append(forecastIcon);
    forecastBox.append(forecastTemp);
    forecastBox.append(forecastWind);
    forecastBox.append(forecastHumidity);
  }
}
