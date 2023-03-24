// Takes data from URL
const params = (new URL(document.location)).searchParams;
const searchInput = params.get('search-input');

// OpenWeather API key
const APIKey = "219c2e541d0b04c9a6bae69e7e337991";

const currentForecast = $("#this-day-forecast");
const futureWeatherHeader = $("#future-weather-header");
const futureForecastCards = $("#future-weather-cards");

// Forecast for current day
function buildMainWeatherForecast (response) {
    const city = response.city.name;
    const date = moment(response.list[0].dt * 1000).format("DD/MM/YY");
    const icon = response.list[0].weather[0].icon;
    const iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    const tempCelsius = Math.floor(response.list[0].main.temp - 273.15);
    const windSpeed = response.list[0].wind.speed;
    const humidity = response.list[0].main.humidity;
    
    currentForecast.append(
        `<h2>${city} (${date}) <img src="${iconURL}"></h2>
        <p>Temp: ${tempCelsius}</p>
        <p>Wind: ${windSpeed}</p>
        <p>Humidity: ${humidity}</p>`);     
}

// Forecast for 5 next days
function buildFiveDaysWeatherForecast(response) {
    futureWeatherHeader.append("5-Days Forecast:");
    // Iteration throuth API responce, to take correct data for each day
    for(i = 7; i < response.list.length; i += 8) {
        const futureDate = moment(response.list[i].dt * 1000).format("DD/MM/YY");
        const futureIcon = response.list[i].weather[0].icon;
        const futureIconURL = "https://openweathermap.org/img/wn/" + futureIcon + "@2x.png";
        const futureTemp = Math.floor(response.list[i].main.temp - 273.15);
        const futureWind = response.list[i].wind.speed;
        const futureHumidity = response.list[i].main.humidity;

        futureForecastCards.append(    
            `<div class="card m-2 rounded" style="width: 10rem;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(21, 239, 210, 0.3);
            box-shadow:0 8px 32px 0 rgba(24, 90, 157, 0.37);">
                <div class="card-body rounded-lg">
                    <h5 class="text-center">${futureDate}</h6>
                    <img src="${futureIconURL}">
                    <p>Temp: ${futureTemp}</p>
                    <p>Wind: ${futureWind}</p>
                    <p>Humidity: ${futureHumidity}</p>
                </div>
            </div>`);
    }
}

function createWeatherForcast(city) {
    // Before building new weather forcast elements deleting old once
    currentForecast.empty();
    futureWeatherHeader.empty();
    futureForecastCards.empty();

    // Building the URL to query the database
    const  url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    $.ajax({url: url, method: "GET"}).then(function(response) {
        buildMainWeatherForecast(response);
        buildFiveDaysWeatherForecast(response);
        updateLocalStorageHistory(city);
    }).catch(function (e) {
        // In case of an error just generating history but no forcast
        createSearchHistory();
    });
}

function updateLocalStorageHistory(newCity) {
    // Getting previously searched cities list (history)
    const searchHistory = JSON.parse(localStorage.getItem("history")) || [];

    // If city already exists then move it to the top (by removing it)
    if (searchHistory.includes(newCity)) {
        searchHistory.splice(searchHistory.indexOf(newCity), 1)
    }

    // Adding searchInput city to the history as new entry
    searchHistory.unshift(newCity);

    // If we added 11 (more then 10) city to the history then removing the oldest entry
    if (searchHistory.length > 10) {
        searchHistory.pop()
    }

    localStorage.setItem('history', JSON.stringify(searchHistory))

    createSearchHistory();
}

// Function to creat a searched city buttons
function createSearchedCityButton(city) {
    const buttonGroup = $(".list-group");
    const buttonId = city.toLowerCase() + '-btn-id';
    buttonGroup.append(
        `<button id="${buttonId}" type="button" class="btn btn-secondary btn-sm btn-block">
            ${city}
        </button>`
    )
    $(`#${buttonId}`).on("click", function() {
        createWeatherForcast(city);
    });
}

// function to create a button to delete history
function createDeleteHistoryButton() {
    let deleteHistory = $("#history");
    deleteHistory.prepend(
      `<button type="button" class="btn btn-danger btn-sm btn-block" id="clear-history">Delete history</button>`
    );
    // Add event listener to the clear history button
    $("#clear-history").on("click", function() {
      localStorage.clear();
      $(".list-group").empty();
    });
}

function createSearchHistory() {
    $(".list-group").empty();

    // Getting previously searched cities list (history)
    const searchHistory = JSON.parse(localStorage.getItem("history")) || [];

    // Creating button for each previously searched city
    searchHistory.forEach(createSearchedCityButton);

    // Only creating delete button if there is any history stored
    if (searchHistory.length > 0) {
        createDeleteHistoryButton();
    }
}

// If searchInput is not empty then generating weather data
if (searchInput) {
    createWeatherForcast(searchInput);
} else {
    // If no searchInput given then just trying to generate history section
    createSearchHistory();
}

// Adding on form submit callback to validate input value
$("#search-form").submit(async function(evt) {
    // Getting search input value to validate it on submit
    const value = evt.currentTarget[0].value;

    // If empty value then doing nothing (skip)
    if (!value) {
        evt.preventDefault();
    }
});