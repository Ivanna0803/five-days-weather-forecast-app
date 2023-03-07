// OpenWeather API key
const APIKey = "219c2e541d0b04c9a6bae69e7e337991";
// let todayForecast = $("#today");
// let futureForecast = $("#forecast");

// Takes data from URL
const params = (new URL(document.location)).searchParams;
const searchInput = params.get('search-input');
let currentDate = moment().format("DD/MM/YY");

function searchCityWeatherForecast (searchInput) {
    // Building the URL to query the database
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=" + APIKey;

    $.ajax({
         url: queryURL, 
         method: "GET"
        }).then(function(response) {
            let city = searchInput;        
            let tempCelsius = Math.floor(response.list[0].main.temp - 273.15);
            let windSpeed = response.list[0].wind.speed;
            let humidity = response.list[0].main.humidity;

            $('.city').text(city + " (" + currentDate + ")");
            $('.temp').text("Temp: " + tempCelsius + "°C");
            $('.wind').text("Wind: " + windSpeed + " KPH");
            $('.humidity').text("Humidity: " + humidity + "%");
            console.log(queryURL);
        })       
}

searchCityWeatherForecast(searchInput);