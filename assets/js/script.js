// Takes data from URL
const params = (new URL(document.location)).searchParams;
const searchInput = params.get('search-input');
// OpenWeather API key
const APIKey = "219c2e541d0b04c9a6bae69e7e337991";
// Building the URL to query the database
let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=" + APIKey;

const currentForecast = $("#this-day-forecast");
const futureWeatherHeader = $("#future-weather-header");
const futureForecastCards = $("#future-weather-cards");

let currentDate = moment().format("DD/MM/YY");

function searchCityWeatherForecast () {
    $.ajax({
         url: queryURL, 
         method: "GET"
        }).then(function(response) {
            let city = response.city.name;        
            let tempCelsius = Math.floor(response.list[0].main.temp - 273.15);
            let windSpeed = response.list[0].wind.speed;
            let humidity = response.list[0].main.humidity;

            currentForecast.append(
                `<h2>${city} (${currentDate})</h2>
                <p>Temp: ${tempCelsius}</p>
                <p>Wind: ${windSpeed}</p>
                <p>Humidity ${humidity}:</p>
                <p></p>`);
        })     
}
 

function fiveDaysWeather() {
    $.ajax({
         url: queryURL, 
         method: "GET"
        }).then(function(response) {
            futureWeatherHeader.append("5-Days Forecast:");
            for(i = 7; i < response.list.length; i += 8) {

            let futureDate = response.list[i].dt_txt;
            let futureTemp = Math.floor(response.list[i].main.temp - 273.15);
            let futureWind = response.list[i].wind.speed;
            let futureHumidity = response.list[i].main.humidity;

            futureForecastCards.append(
                `<div class="card" style="width: 10rem;">
                   <div class="card-body">
                      <p>${futureDate}</p>
                      <p>Temp: ${futureTemp}</p>
                      <p>Wind: ${futureWind}</p>
                      <p>Humidity: ${futureHumidity}</p>
                    </div>
                </div>`);
        }    
    })
}

searchCityWeatherForecast();
fiveDaysWeather();