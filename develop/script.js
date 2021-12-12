// what are we going to need?
// jQuery
// moment.js
// Ajax
// Weather api

// ----Variables-----
// userSearch | grab the users search
// main5D (current)|
// 5day5D |
// search boxes (ul)
// save the current day | moment()

// ----Functions-----
// function 1 - grab the value of the search (be in event listener)
// function 2 - get the current 5D (Main) -- date, icon, temp, humid,
// function 3 - display the info from function 2
// function 4 - get the 5d 5D for current city - (uv index for 2) date, icon, temp, humidity,
// function 5 - display the info from function 4
// function 6 - save search history

// ----what event listeners do we need? -----
// on click for the search button
// on click on the previous search

$(document).ready(function () {
    // vars
  
    // functions
    function getCurrent(queryUrl) {
      $.ajax({
        url: queryUrl,
        method: "GET",
      }).then(function (response) {
        let cityName = response.name;
        let icon = response.weather[0].icon;
        let temp = response.main.temp * (9 / 5) - 459.67;
        let tempf = Math.ceil(temp);
        let hum = response.main.humidity;
        let windSpeed = response.wind.speed;
  
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        displayCurrent(cityName, icon, tempf, hum, windSpeed);
        get5Day(lat, lon);
      });
    }
  
    function displayCurrent(cityName, icon, tempf, hum, windSpeed) {
      $("#cityCurrent").text(cityName);
      $("#date").text(moment().format("l"));
  
      $("#weather-icon").empty();
      let createIcon = $("<img>");
      createIcon.attr(
        "src",
        "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      );
      $("#weather-icon").append(createIcon);
      $("#temperature").text(tempf + "\u00B0F");
      $("#humidity").text(hum + "%");
      $("#wind").text(windSpeed + " MPH");
    }
  
    function get5Day(lat, lon) {
      let queryUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=current,minutely,hourly&appid=1028ca42c6427725e001251193e4e6ef";
  
      console.log(queryUrl);
      $.ajax({
        url: queryUrl,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        let uvIndex = response.daily[0].uvi;
        $("#uv").text(uvIndex);
        if (uvIndex >= 11) {
          $("#uv").attr("style", "background-color: mediumpurple");
        } else if (uvIndex >= 8) {
          $("#uv").attr("style", "background-color: red");
        } else if (uvIndex >= 6) {
          $("#uv").attr("style", "background-color: orange");
        } else if (uvIndex >= 3) {
          $("#uv").attr("style", "background-color: yellow");
        } else {
          $("#uv").attr("style", "background-color: green");
        }
  
        let dailyDateArr = [];
        let dailyIconArr = [];
        let dailyTempArr = [];
        let dailyHumidArr = [];
  
        for (let i = 1; i < 6; i++) {
          dailyIconArr.push(response.daily[i].weather[0].icon);
  
          let date = response.daily[i].dt;
          let dailyDate = new Date(date * 1000).toLocaleDateString("en-US");
          dailyDateArr.push(dailyDate);
  
          dailyTempArr.push(
            Math.ceil(response.daily[i].temp.day * (9 / 5) - 459.67)
          );
  
          dailyHumidArr.push(response.daily[i].humidity);
        }
  
        display5Day(dailyDateArr, dailyIconArr, dailyTempArr, dailyHumidArr);
      });
    }
  
    function display5Day(
      dailyDateArr,
      dailyIconArr,
      dailyTempArr,
      dailyHumidArr
    ) {
      for (let i = 0; i < dailyIconArr.length; i++) {
        // date
        let date5D = $("#5d-date-" + i);
        date5D.text(dailyDateArr[i]);
        // icon
        let icon5D = $("#5d-icon-" + i);
        icon5D.attr(
          "src",
          "http://openweathermap.org/img/wn/" + dailyIconArr[i] + "@2x.png"
        );
        // temp
        let temp5D = $("#5d-temperature-" + i);
        temp5D.text(dailyTempArr[i] + "\u00B0F");
        // Humidity
        let humid5D = $("#5d-humidity-" + i);
        humid5D.text(dailyHumidArr[i] + "%");
      }
    }
  
    function searchHistory(city) {
      let history = $("<li>");
      history.attr("id", "history");
      history.text(city);
      $("#search-boxes").prepend(history);
    }
  
    // event listeners
    $(".search-btn").on("click", function (event) {
      event.preventDefault();
  
      let cityName = $(".form-control").val().trim();
      searchHistory(cityName);
      let queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=1028ca42c6427725e001251193e4e6ef";
  
      getCurrent(queryUrl);
    });
  
    // history buttons
    $(document).on("click", "#history", function (event) {
      event.preventDefault();
      let city = event.target.textContent;
      let queryUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=b69a42c83210378fa102751081b2696f";
      getCurrent(queryUrl);
    });
  });