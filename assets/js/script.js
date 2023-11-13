let currentDate = dayjs().format("MMMM DD YYYY")
let previousLocation = $('.locations')
const savedCities = []
loadSavedLocations()
$("#search").on("click", createElement);
async function createElement() {
  await requestLocation();
  saveLocation()
}
function loadSavedLocations(){
  let arraySavedCities = localStorage.getItem('cities') //string
  const citiesArrayParsed = JSON.parse(arraySavedCities) //array
  if (arraySavedCities){
    for (let i = 0; i < citiesArrayParsed.length; i++) {
      //create
      let previousCity = ('<li>')
      //attr
      previousCity.text(citiesArrayParsed[i])
      //append
      previousLocation.append(previousCity)
    }
  }
}
function saveLocation(){
  savedCities.push($("input:text").val())
  const stringSavedCities = JSON.stringify(savedCities)
  localStorage.setItem("cities", stringSavedCities)
  let arraySavedCities = localStorage.getItem('cities')
  const citiesArrayParsed = JSON.parse(arraySavedCities)
  console.log(citiesArrayParsed)
  //create
  let previousCity = $('<li>')
  //attr
  previousCity.text(citiesArrayParsed[citiesArrayParsed.length - 1])
  //append
  previousLocation.append(previousCity)
}

async function requestLocation() {
  let geoAPIUrl = "https://api.openweathermap.org/geo/1.0/direct?";
  let locationQuery = $("input:text").val();
  let geoParameters = {
    q: locationQuery,
    limit: 1,
    appid: "161b355a9dd41b55204725cd903f95ab",
  };
  let geoSearchParams = new URLSearchParams(geoParameters);
  let locationURL = geoAPIUrl + geoSearchParams;
  let geoResponse = await fetch(locationURL);
  let geoJsonData = await geoResponse.json();
  console.log(locationURL);
  let latitude = geoJsonData[0].lat;
  let longitude = geoJsonData[0].lon;
  console.log(latitude);
  console.log(longitude);
  await requestWeather(latitude, longitude);
  await requestForecast(latitude, longitude);
}

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
  console.log(weatherJsonData);
  weatherTodayEl(weatherJsonData);
}

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
  console.log(forecastJsonData);
  fiveDayForecastEl(forecastJsonData);
}
let iconUrl = "https://openweathermap.org/img/wn/"
let iconTag = "@2x.png"

function weatherTodayEl(weatherJsonData) {
  //create
  let todayContainer = $("<div>");
  let todayDate = $("<h1>");
  let weatherContainer = $("<ul>");
  let weatherIcon = $("<img>")
  let temp = $("<li>");
  let wind = $("<li>");
  let humidity = $("<li>");
  //attr
  todayContainer.addClass("today");
  todayDate.text($("input:text").val() + " " + currentDate);
  weatherContainer.addClass("today");
  weatherIcon.attr("src", iconUrl + weatherJsonData.weather[0].icon + iconTag); 
  temp.text("Temperature: " + weatherJsonData.main.temp + " °F");
  wind.text("Wind: " +weatherJsonData.wind.speed + " mph");
  humidity.text("Humidity: " +weatherJsonData.main.humidity + " %");
  //append
  $(document.body).append(todayContainer);
  todayContainer.append(todayDate);
  todayContainer.append(weatherIcon)
  todayContainer.append(weatherContainer);
  weatherContainer.append(temp);
  weatherContainer.append(wind);
  weatherContainer.append(humidity);
}

function fiveDayForecastEl(forecastJsonData) {
  let forecastContainer = $("<div>");
  let forecastText = $("<h2>");
  forecastContainer.addClass("forecast-container")
  forecastText.text("5 Day Forecast")
  $(document.body).append(forecastText)
  $(document.body).append(forecastContainer)

  for (let i = 0; i < 5; i++) {
    //create
    console.log(forecastJsonData.list[i].weather[0].icon)
    console.log(typeof(forecastJsonData.list[i].weather[0].icon))
    let forecastBox = $("<div>");
    let forecastDate = $("<h3>");
    let forecastIcon = $("<img>");
    let forecastTemp = $("<li>");
    let forecastWind = $("<li>");
    let forecastHumidity = $("<li>");

    //attr
    forecastBox.addClass("forecast");
    forecastDate.text("Forecast Date: " + dayjs().add(i, 'day').format("MMMM DD YYYY"));
    forecastIcon.attr("src", iconUrl + forecastJsonData.list[i].weather[0].icon + iconTag);  
    forecastTemp.text("Temperature: " + forecastJsonData.list[i].main.temp + " °F");
    forecastWind.text("Wind: " + forecastJsonData.list[i].wind.speed + " mph");
    forecastHumidity.text("Humidity: " + forecastJsonData.list[i].main.humidity + " %");

    //append
    forecastContainer.append(forecastBox);
    forecastBox.append(forecastDate);
    forecastBox.append(forecastIcon);
    forecastBox.append(forecastTemp);
    forecastBox.append(forecastWind);
    forecastBox.append(forecastHumidity);
  }
}

// geo coding api call to get longitude and latitude of a city / state / country code
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// example is New Brunswick below
// https://api.openweathermap.org/geo/1.0/direct?q=New+Brunswick&limit  =1&appid=161b355a9dd41b55204725cd903f95ab
// [{"name":"New Brunswick","local_names":{"en":"New Brunswick"},"lat":40.4862174,"lon":-74.4518173,"country":"US","state":"New Jersey"}]

// weather api call to get weather of a longitude and latitude
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid={API key}
// example is New Brunswick's weather
// https://api.openweathermap.org/data/2.5/weather?lat=40.4862174&lon=-74.4518173&units=imperial&appid=161b355a9dd41b55204725cd903f95ab
// {"coord":{"lon":-74.4518,"lat":40.4862},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":296.57,"feels_like":296.77,"temp_min":294.57,"temp_max":298.42,"pressure":1017,"humidity":69},"visibility":10000,"wind":{"speed":1.79,"deg":292,"gust":4.47},"clouds":{"all":0},"dt":1698505393,"sys":{"type":2,"id":2076514,"country":"US","sunrise":1698492162,"sunset":1698530418},"timezone":-14400,"id":5101717,"name":"New Brunswick","cod":200}

// weather api call to get weather for 5 days 3 hour forecast
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid={API key}
// example is New Brunswick 5 day forecast
// https://api.openweathermap.org/data/2.5/forecast?lat=40.4862174&lon=-74.4518173&units=imperial&appid=161b355a9dd41b55204725cd903f95ab
//
// $(function () {
// 'https://api.openweathermap.org/geo/1.0/direct?q=' + '{user-input}' + '&limit=1&appid=161b355a9dd41b55204725cd903f95ab'
