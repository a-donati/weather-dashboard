var currentWeather = $('#current-weather');
var searchButton = document.querySelector('#search-button');
var cityEntry = document.querySelector('#city');
var cityName = $('#current-weather-city');
var displayCurrentWeather = $('#current-weather-container');
var date = moment().format("l");
var fiveDayForecastContainer = $('#five-day-forecast');
var currentWeatherCard;
var listOfCities;
var cityHistory = $('#list-group');
var city;
var APIkey = "&units=imperial&appid=e96c7cdf8719334c7ad87ba089d635e4"
var lat;
var lon;

//empty current ul list
function init() {
    cityHistory.empty();
    displaySearchHistory();
}

// display search history from local storage
function displaySearchHistory() {
    if (localStorage.getItem("cities") === null) {
        listOfCities = [];
    }
    else {
        listOfCities = JSON.parse(localStorage.getItem("cities"));
    }
    // create li for each city from ls array
    for (var i = 0; i < listOfCities.length; i++) {
        var li = $('<li></li>');
        li.addClass('list-group-item');
        li.css('cursor', 'pointer');
        li.text(listOfCities[i]);
        cityHistory.append(li);
    }


    var liList = $('li');
    // when clicking on items in the list, the innertext content (city) will be passed back into API to display weather search results
    for (var i = 0; i < liList.length; i++) {
        liList[i].addEventListener('click', function (event) {
            console.log(this.textContent);
            getAPI(this.textContent);
        })
    }
};

// collect user input value to pass to API
var searchCity = function (event) {
    event.preventDefault();

    //set the city searched value to variable
    city = cityEntry.value.trim();

    if (city) {
        getAPI(city);
        currentWeather.textContent = '';
        cityEntry.value = '';
    } else {
        // alert('Please enter a city');
        showAlert("Please enter a city");
        // $('#message').removeClass('d-none'); 
    }
};
// pass in alert message to display error
function showAlert(message) {
    let div = $("<div>");
    div.addClass("alert alert-warning");
    div.text(message);
    $(".append").append(div);

    setTimeout(function () {
        $(".alert").remove();
    }, 3000);
}

// get api for requested city
function getAPI(cityCurrent) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityCurrent + APIkey
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data, cityCurrent);
                });
            } else {
                showAlert("The city was not found.  Please check the name and spelling.");
                // alert(`Error: ${response.statusText}`)          
                // location.reload();
            }
        })
        .catch(function (error) {
            alert('unable to connect to open Weather');
            location.reload();
        });
};



//display data for current weather 
var displayWeather = function (currentWeatherToDisplay, cityCurrentWeather) {

    //sets to empty array if nothing in ls
    if (localStorage.getItem("cities") === null) {
        listOfCities = [];
    }
    //if data is in ls, retrieve object
    else {
        listOfCities = [];
        listOfCities = JSON.parse(localStorage.getItem("cities"));
    }

    //puts new city into ls

    if (listOfCities.indexOf(currentWeatherToDisplay.name) === -1) {
        listOfCities.push(currentWeatherToDisplay.name);
        localStorage.setItem("cities", JSON.stringify(listOfCities));
    }

    cityHistory.empty();
    // iterate through cities array from ls, creating list item for each
    for (var i = 0; i < listOfCities.length; i++) {
        var li = $('<li>');
        li.addClass('list-group-item');
        li.css('cursor', 'pointer');
        li.text(listOfCities[i]);
        cityHistory.append(li);
    }

    liList = $('li');
    // when clicking list item, it will run getAPI with targeted city from textcontent
    for (var i = 0; i < liList.length; i++) {
        liList[i].addEventListener('click', function (event) {
            getAPI(this.textContent);
        });
    }

    //display titles for current weather and 5 day forecast
    $('h2').removeClass('d-none');
    $('div').removeClass('d-none');
    //remove previous values in current weather and 5 day forecast
    displayCurrentWeather.empty();
    fiveDayForecastContainer.empty();

    //add city searched and current date to container display
    cityName.text(currentWeatherToDisplay.name + "  (" + date + ")");

    //obtain current latitude and longitude from location searched 
    var lat = currentWeatherToDisplay.coord.lat;
    var lon = currentWeatherToDisplay.coord.lon;
    // create card for current weather values to display
    currentWeatherCard = $('<div>');
    currentWeatherCard.addClass('card');
    displayCurrentWeather.append(currentWeatherCard);
    // create and append icon to display weather icon
    var icon = $('<img>')
    icon.addClass('img');
    icon.attr('src', "https://openweathermap.org/img/wn/" + currentWeatherToDisplay.weather[0].icon + "@2x.png")
    currentWeatherCard.append(icon);
    // create p tag to display temp data
    var temperature = $('<p>');
    temperature.attr('class', 'temp');
    temperature.text("Temperature: " + Math.floor(currentWeatherToDisplay.main.temp) + " °F");
    currentWeatherCard.append(temperature);
    // create p tag to display humidity data
    var humidity = $('<p>');
    humidity.attr('class', 'humidity');
    humidity.text("Humidity: " + currentWeatherToDisplay.main.humidity + " %");
    currentWeatherCard.append(humidity);
    // create p tag to display windspeed and direction
    var windSpeed = $('<p>');
    windSpeed.attr('class', 'wind-speed');
    windSpeed.text("WindSpeed: " + Math.floor(currentWeatherToDisplay.wind.speed) + "mph, Direction: " +
        currentWeatherToDisplay.wind.deg +
        "°");
    currentWeatherCard.append(windSpeed);
    // call getUV with our obtained latitude and longitude values
    getUV(lat, lon);
}

//get UV index from api
function getUV(lat, lon) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + "lat=" + lat + "&lon=" + lon + APIkey
    console.log(requestUrl);
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    displayUV(data);
                });
            } else {
                alert('Error:' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('unable to connect to open Weather');
        });
}

//display the UV index
var displayUV = function (dataForUV) {
    var uvIndex = $('<p>');
    uvIndex.text("UV Index: ");
    currentWeatherCard.append(uvIndex);


    var uvIndexValue = $('<span>')

    if (dataForUV.current.uvi < 3) {
        uvIndexValue.addClass('green');
    } else if (dataForUV.current.uvi < 6) {
        uvIndexValue.addClass('yellow');
    } else if (dataForUV.current.uvi < 8) {
        uvIndexValue.addClass('orange');
    } else if (dataForUV.current.uvi < 11) {
        uvIndexValue.addClass('red');
    } else {
        uvIndexValue.addClass('purple');
    }

    uvIndexValue.text(dataForUV.current.uvi);
    uvIndex.append(uvIndexValue);
    //send data to next function for five day forecast
    displayFiveDay(dataForUV);
}

//display five day forecast
var displayFiveDay = function (fiveDayWeatherToDisplay) {

    //loop for each day of the five day forecast
    for (var i = 1; i < 6; i++) {

        //create container for each day of the five day forecast
        var dayContainer = $('<div>');
        dayContainer.addClass('card col-sm el-5-day');
        fiveDayForecastContainer.append(dayContainer);

        //function to convert unix date to human date
        function timeConverter(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
            var month = months[a.getMonth()];
            var date = a.getDate();
            var year = a.getFullYear();
            var time = month + '/' + date + '/' + year
            return time;
        }

        //create element for date, get date from api, append to five day forecast container
        var eachDate = $('<h5>');
        eachDate.addClass('card-title');
        eachDate.text(timeConverter(fiveDayWeatherToDisplay.daily[i].dt));
        dayContainer.append(eachDate)

        //create element for icon, get icon from api, append to five day forecast container
        var icon = $('<img>')
        icon.addClass('img');
        icon.attr('src', "https://openweathermap.org/img/wn/" + fiveDayWeatherToDisplay.daily[i].weather[0].icon + ".png")
        dayContainer.append(icon);

        //create element for temp, get temp from api, append to five day forecast container 
        var fiveDayTemp = $('<p>');
        fiveDayTemp.attr('class', 'temp');
        fiveDayTemp.text("Temp: " + Math.floor(fiveDayWeatherToDisplay.daily[i].temp.day) + "°F");
        dayContainer.append(fiveDayTemp);

        // create element for wind, get windspeed from api, append to five day forecast container
        var fiveDayWind = $('<p>');
        fiveDayWind.attr('class', 'wind');
        fiveDayWind.text("WindSpeed: " + Math.floor(fiveDayWeatherToDisplay.daily[i].wind_speed) + "mph");
        dayContainer.append(fiveDayWind);

        //create element for humidity, get humidity from api, append to five day forecast container
        var humidity = $('<p>');
        humidity.attr('class', 'humidity');
        humidity.text("Humidity: " + fiveDayWeatherToDisplay.daily[i].humidity + " %");
        dayContainer.append(humidity);
    }
};

init();
searchButton.addEventListener('click', searchCity);