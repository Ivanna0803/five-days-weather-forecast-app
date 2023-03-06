// OpenWeather API key""
const APIKey = "219c2e541d0b04c9a6bae69e7e337991";
// let todayForecast = $("#today");
// let futureForecast = $("#forecast");

// Takes data from URL
const params = (new URL(document.location)).searchParams;
const searchInput = params.get('search-input');

if (searchInput) {
    // Building the URL to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey;
    
    $.ajax({
         url: queryURL, 
         method: "GET"
        }).then(function(response) {        
            let city = response.name;
            let tempCelsius = Math.floor(response.main.temp - 273.15);
            let windSpeed = response.wind.speed;
            let humidity = response.main.humidity;

            $('.city').text(city);
            $('.temp').text("Temp: " + tempCelsius + "°C");
            $('.wind').text("Wind: " + windSpeed + " KPH");
            $('.humidity').text("Humidity: " + humidity + "%");
        });    
}