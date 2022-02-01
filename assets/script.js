// variables
var currentWeather = $('#current-weather');
var searchButton = document.querySelector('#search-button');
var cityEntry = document.querySelector('#city');
var cityName = $('#current-weather-city');
var displayCurrentWeather = $('#current-weather-container');
var date = moment().format("l");
var fiveDayForecastContainer = $('#five-day-forecast');
var currentWeatherCard;
var listOfCities;
var cityHistory = $('#list-group')
const APIkey = "e96c7cdf8719334c7ad87ba089d635e4";
let city;
let lat;
let lon;

// event listeners

searchButton.addEventListener('click', searchCity);

// use user search input 
function searchCity(e) {
    e.preventDefault();
    city = cityEntry.value.trim();
    console.log(city);

    if(city) {
        getAPI(city);
        displayCurrentWeather.textContent = "";
        city.value = "";
    } else {
        alert('Please enter a city');

    }

}
// get api for requested city
function getAPI(cityCurrent) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCurrent + `&units=imperial&appid=` + APIkey;
    console.log(requestUrl);
    fetch(requestUrl)
        .then(function (response){
            if(response.ok){
            console.log(response)
            response.json().then(function(data) {
                console.log(data);
                displayWeather(data, cityCurrent);
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    // .catch(function(error) {
    //     alert('unable to connect to open Weather');
    //     location.reload();
    // });
};


var displayWeather = function (currentWeatherToDisplay){
    // set empty array if nothing is stored in ls
    if(localStorage.getItem('cities') === null) {
        listOfCities = [];
    } else {
        listOfCities = [];
        listOfCities = JSON.parse(localStorage.getItem('cities'));
    }

    // put new city into ls
    if(listOfCities.indexOf(currentWeatherToDisplay.name) === -1) {
        listOfCities.push(currentWeatherToDisplay.name);
        localStorage.setItem('cities', JSON.stringify(listOfCities));
    }
    cityHistory.empty();
    // iterate through cities array from ls, creating list item for each
    for(let i = 0; i < listOfCities; i++) {
        let li = $('<li>');
        li.addClass('list-group-item');
        li.css('cursor', 'pointer');
        li.text(listOfCities[i]);
        cityHistory.append(li);
    }

    liList = $('li');
    // when clicking list item, it will run getAPI with targeted city from the textcontent
    for(let i=0; i < liList.length; i++) {
        liList[i].on('click', function(event) {
            getAPI(this.textContent);
        })
    }

    $('h2').removeClass('subtitle');
    $('div').removeClass('subtitle');
    // remove previous values in current weather and 5 day forecast
    displayCurrentWeather.empty();
    fiveDayForecastContainer.empty();

    // add city searched and current date to container display
    cityName.text(currentWeatherToDisplay.name + "  (" + date + ")");
    // obtain current latitude and longitude from current location
    let lat = currentWeatherToDisplay.coord.lat;
    var lon = currentWeatherToDisplay.coord.lon;
    // create card for current weather values to display
    currentWeatherCard = $('<div>');
    currentWeatherCard.addClass('card');
    displayCurrentWeather.append(currentWeatherCard);
    // create an append icon to display current weather icon
    let icon = $('<img>');
    icon.addClass('img');
    icon.attr('src', "https://openweathermap.org/img/wn/" + currentWeatherToDisplay.weather[0].icon + "@2x.png" );
    currentWeatherCard.append(icon);
    // create p tag to display temp text
    let temperature = $('<p>');
    temperature.attr('class', 'temp');
    temperature.text("Temperature: " + currentWeatherToDisplay.main.temp + "°F");
    currentWeatherCard.append(temperature);
    // create p tag to display humidity value
    let humidity = $('<p>');
    humidity.attr('class', 'humidity');
    humidity.text("Humidity: " + currentWeatherToDisplay.main.humidity + "%");
    currentWeatherCard.append(humidity);
    // create p tag ti display windspeed and direction
    let windSpeed = $('<p>');
    windSpeed.attr('class', 'wind-speed');
    windSpeed.text("Windspeed: " + currentWeatherToDisplay.wind.speed + "mph, Direction: " + currentWeatherToDisplay.wind.deg + "°");
    currentWeatherCard.append(windSpeed);
// call getUV
    getUV(lat, lon);
}

// get UV index using lat, lon values
function getUV(lat, lon) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
    console.log(requestUrl);
    
}

