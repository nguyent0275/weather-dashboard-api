// geo coding api call to get longitude and latitude of a city / state / country code
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// example is New Brunswick below
// https://api.openweathermap.org/geo/1.0/direct?q=New+Brunswick&limit=1&appid=161b355a9dd41b55204725cd903f95ab
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

$(function () {
  // 'https://api.openweathermap.org/geo/1.0/direct?q=' + '{user-input}' + '&limit=1&appid=161b355a9dd41b55204725cd903f95ab'
  let locationURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=New+Brunswick&limit=1&appid=161b355a9dd41b55204725cd903f95ab";

  async function requestLocation() {
    let response = await fetch(locationURL);
    let jsonData = await response.json();
    // console.log(jsonData[0].lat)
    // console.log(jsonData[0].lon)
    // console.log(Object.keys(jsonData))
    // console.log(typeof(jsonData))
    var latitude = "lat=" + String(jsonData[0].lat) + "&";
    var longitude = "lon=" + String(jsonData[0].lon);
    requestWeather(latitude, longitude)
  }
  // pass longitude and latitude down here
  // let weatherURL = 'https://api.openweathermap.org/data/2.5/weather?' + latitude + longitude +  '&units=imperial&appid=161b355a9dd41b55204725cd903f95ab';
  // let weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=40.4862174&lon=-74.4518173&units=imperial&appid=161b355a9dd41b55204725cd903f95ab'
  async function requestWeather(param1, param2) {
    await requestLocation()
    let weatherURL =
      "https://api.openweathermap.org/data/2.5/weather?" +
      param1 +
      param2 +
      "&units=imperial&appid=161b355a9dd41b55204725cd903f95ab";
    let response = await fetch(weatherURL);
    let jsonData = await response.json();
    console.log(Object.keys(jsonData));
  }
  requestWeather()

  // $(function() {
  //     let forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=40.4862174&lon=-74.4518173&units=imperial&appid=161b355a9dd41b55204725cd903f95ab';

  //     async function requestForecast() {
  //         let response = await fetch(forecastURL);
  //         let jsonData = await response.json();
  //         console.log(Object.keys(jsonData))
  //     }
});

// let searchButton = document.getElementById('search')
// searchButton.addEventListener('click', weatherToday)
// function weatherToday(){
//     //create
//     todayContainer = document.createElement('div')
//     todayDate = document.createElement('h1')
//     weatherContainer = document.createElement('ul')
//     temp = document.createElement('li')
//     wind = document.createElement('li')
//     humidity = document.createElement('li')
//     //attr
//     todayContainer.classList.add('today')
//     todayDate.textContent = "Today's data"
//     weatherContainer.classList.add('today')
//     temp.textContent = 'Temperature'
//     wind.textContent = 'Wind'
//     humidity.textContent = 'Humidity'
//     //append
//     document.body.appendChild(todayContainer)
//     todayContainer.appendChild(todayDate)
//     todayContainer.appendChild(weatherContainer)
//     weatherContainer.appendChild(temp)
//     weatherContainer.appendChild(wind)
//     weatherContainer.appendChild(humidity)

//     weatherForecast()
// }

// function weatherForecast(){
//     forecastContainer = document.createElement('div')
//     forecastText = document.createElement('h2')
//     for (let i = 0; i < 5; i++) {
//         //create
//         forecastBox = document.createElement('div')
//         forecastDate = document.createElement('h3')
//         forecastIcon = document.createElement('div')
//         forecastTemp = document.createElement('li')
//         forecastWind = document.createElement('li')
//         forecastHumidity = document.createElement('li')

//         //attr
//         forecastBox.classList.add('forecast')
//         forecastDate.textContent = 'Forecast Date'
//         forecastIcon.textContent = 'cloudy'
//         forecastTemp.textContent = 'Forecast Temp'
//         forecastWind.textContent = 'Forecast Wind'
//         forecastHumidity.textContent = 'Forecast Humidity'

//         //append
//         document.body.appendChild(forecastBox)
//         forecastBox.appendChild(forecastDate)
//         forecastBox.appendChild(forecastIcon)
//         forecastBox.appendChild(forecastTemp)
//         forecastBox.appendChild(forecastWind)
//         forecastBox.appendChild(forecastHumidity)
//     }
// }
