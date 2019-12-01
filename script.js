$(document).ready(function() {
  
  getUserInfo();
  $(".toggleFC").click(function() {
    var degree = toggleFC($(this).text());
    $(this).text(degree);
    var temp = toggleTemp($("#temp").text(), degree);
    $("#temp").text(temp);
  });
});

var x = document.getElementById("location");
var temp = document.getElementById("temp");
var cond = document.getElementById("conditions");
var icon = document.getElementById("icon");

function getUserInfo () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition (position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var apiLinkGM = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlon + "&key=AIzaSyBLilWwDtdymiAABzXQzt_AZ-_fiBRrrbw";
  var apiLinkDS = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e6af5b5feb891b272e18f5e2fc0370a6/" + latlon;
  
  getLocationAPI(apiLinkGM); 
  getWeatherAPI(apiLinkDS); 
}

function getLocationAPI (apiLinkGM) {
  fetch(apiLinkGM, {
    method: 'GET'
  }).then(function(response) {
    response.json().then(function(data) {
      var user_hood = data.results[0].address_components[2].long_name;
      var user_city = data.results[0].address_components[3].long_name;
      var user_state = data.results[0].address_components[5].long_name;
      x.innerHTML = user_hood + ", " + user_city + ", " + user_state;
    });
  });
}

function getWeatherAPI (apiLinkDS) {  
  fetch(apiLinkDS, {
    method: 'GET',
  }).then(function(response) {
    return response.json()
  }).then(function(data) {
    temp.innerHTML = Math.round(data.currently.temperature);
    cond.innerHTML = data.currently.summary;
    weatherIcon(data.currently.icon);
  }); 
}

function weatherIcon (weatherType) {
  console.log(weatherType);
  var skycon = new Skycons({"color": "white"});
  
  switch (weatherType) {
    case "clear-day":
      skycon.add("icon", Skycons.CLEAR_DAY);
      break;
    case "clear-night":
      skycon.add("icon", Skycons.CLEAR_NIGHT);
      break;
    case "partly-cloudy-day":
      skycon.add("icon", Skycons.PARTLY_CLOUDY_DAY);
      break;
    case "partly-cloudy-night":
      skycon.add("icon", Skycons.PARTLY_CLOUDY_NIGHT);
      break;
    case "cloudy":
      skycon.add("icon", Skycons.CLOUDY);
      break;
    case "rain":
      skycon.add("icon", Skycons.RAIN);
      break;
    case "sleet":
      skycon.add("icon", Skycons.SLEET);
      break;
    case "snow":
      skycon.add("icon", Skycons.SNOW);
      break;
    case "wind":
      skycon.add("icon", Skycons.WIND);
      break;
    case "fog":
      skycon.add("icon", Skycons.FOG);
      break;
  }
  skycon.play();
}

function toggleFC(val) {
  if (val == "F") {
    return "C";
  }  
  return "F";
}

function toggleTemp(val, x) {
  if (x == "F") {
    return Math.round(val * (9/5) + 32);
  }  
  return Math.round((val - 32) * (5/9));
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED: 
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}