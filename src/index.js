import { format, parse } from "date-fns";

class WeatherData {
  constructor(date, icon, maxTemp, minTemp, currentTemp, feelsLike, weather) {
    this.date = date;
    this.icon = icon;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
    this.currentTemp = currentTemp;
    this.feelsLike = feelsLike;
    this.weather = weather;
  }
  setForecast(val) {
    this.forecast = val;
  }
  getDate() {
    return this.date;
  }
  getIcon() {
    return this.icon;
  }
  getMaxTemp() {
    return this.maxTemp;
  }
  getMinTemp() {
    return this.minTemp;
  }
  getCurrentTemp() {
    return this.currentTemp;
  }
  getFeelsLike() {
    return this.feelsLike;
  }
  getWeather() {
    return this.weather;
  }
}

function celcious(kelvin) {
  return Math.round(kelvin - 273.15);
}

async function getWeather(place) {
  const currentDom = document.querySelector("#current");
  const input = document.querySelector("input");
  input.value = "";

  const actualWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=e5e2dbe71b36b91fed62665eb83d995d`,
    { mode: "cors" }
  );
  const actualWeatherData = await actualWeather.json();

  const title = document.querySelector("#title");
  if (actualWeatherData.cod == "404") {
    loadingDom.style.display = "none";
    title.textContent = "No found!";
    return;
  }

  title.textContent = "Weather";
  const format_date = format(new Date(), "iii., LLLL do h:mm bbbb");
  const weatherObject = new WeatherData(
    format_date,
    actualWeatherData.weather[0].icon,
    celcious(actualWeatherData.main.temp_max),
    celcious(actualWeatherData.main.temp_min),
    celcious(actualWeatherData.main.temp),
    celcious(actualWeatherData.main.feels_like),
    actualWeatherData.weather[0].main
  );

  loadingDom.style.display = "none";

  const dateDom = document.querySelector(".date");
  dateDom.textContent = weatherObject.getDate();

  const locationDom = document.querySelector("#place_location");
  const placeStr = place.charAt(0).toUpperCase() + place.slice(1).toLowerCase();
  locationDom.textContent = placeStr;

  const temperatureDom = document.querySelector(".temperature");
  temperatureDom.textContent = weatherObject.getCurrentTemp() + "º";

  const imageIcon = document.createElement("img");
  imageIcon.src = `img/${weatherObject.getIcon()}.png`;
  imageIcon.setAttribute("id", "icon-weather");
  const iconDom = document.querySelector(".icon");
  iconDom.textContent = "";
  iconDom.appendChild(imageIcon);

  const weatherDom = document.querySelector(".weather");
  weatherDom.textContent = weatherObject.getWeather();

  const minmaxDom = document.querySelector(".minmax");
  minmaxDom.textContent = `${weatherObject.getMaxTemp()}º/${weatherObject.getMinTemp()}º`;

  const feelLikeDom = document.querySelector(".feelsLike");
  feelLikeDom.textContent = `Feels like ${weatherObject.getFeelsLike()}º`;

  currentDom.style.display = "block";

  const forecastArr = [];

  const forecastWeather = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=e5e2dbe71b36b91fed62665eb83d995d`,
    { mode: "cors" }
  );
  const forecastWeatherData = await forecastWeather.json();

  const forecastList = forecastWeatherData.list;
  forecastList.forEach((element) => {
    const date = element.dt_txt.split(" ")[0];
    const format_date = format(parse(date, "yyyy-MM-dd", new Date()), "eeee");
    if (forecastArr.every((x) => x.getDate() !== format_date)) {
      forecastArr.push(
        new WeatherData(
          format_date,
          element.weather[0].icon,
          celcious(element.main.temp_max),
          celcious(element.main.temp_min),
          celcious(element.main.temp),
          celcious(element.main.feels_like),
          element.weather[0].main
        )
      );
    }
  });

  const forecastDom = document.querySelector("#forecast");
  let textElements = "";
  forecastArr.forEach((element) => {
    textElements += `<div class="forecast-weather">
    <div class="forecast-day">${element.getDate()}</div>
    <div class="forecast-icon"><img src="img/${element.getIcon()}.png" alt="" /></div>
    <div class="forecast-limits">${element.getMaxTemp()}º/${element.getMinTemp()}º</div>
  </div>`;
  });
  forecastDom.innerHTML = textElements;
  forecastDom.style.display = "block";
}

const input = document.querySelector("input");
const searchButton = document.querySelector("#searchButton");
const loadingDom = document.querySelector("#loading");
const currentDom = document.querySelector("#current");
const forecastDom = document.querySelector("#forecast");
loadingDom.style.display = "block";
currentDom.style.display = "none";
forecastDom.style.display = "none";
getWeather("Lima");
searchButton.addEventListener("click", function () {
  loadingDom.style.display = "block";
  currentDom.style.display = "none";
  forecastDom.style.display = "none";
  getWeather(input.value);
});
