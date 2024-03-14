const APIKEY = "bedd81aab35b46aee7f7356339be92b1";
let city = "";
let weather;
let weatherDescription = "";
let userWeather;
let forecast;
let hourlyWeather;
let timezone = "";
let localTime = new Date().toLocaleTimeString('en-US', {
	hour: 'numeric', minute: 'numeric', hour12: true
});
let UTC = new Date().toLocaleTimeString();
let isNight;
let lowTemp; 
let highTemp; 
let sunrise;
let sunset;
let weekday = new Intl.DateTimeFormat("en-us", { weekday: "long" }).format(new Date());
let userLatitude = null;
let userLongitude = null;
const loading = document.querySelector('.forecast__spinner');
const locationIcon = document.getElementById('#locationicon')
const weatherIcon = document.getElementById('#weathergif');

// get users current weather
function getUserWeather(lat, lon) {
	axios
		.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`)
		.then((response) => {
			weather = response.data;
			userWeather = weather?.timezone;
			updateWeather(weather)
			console.log(weather)
			loading.classList.add('no')
			weatherIcon.classList.remove('no')
			locationIcon.classList.remove('no')
		}).then(() => {
			axios
				.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`)
				.then((response) => {
					forecast = response.data;
					hourlyWeather = forecast?.list;
					updateForecast(hourlyWeather);
					createHourlyItem(hourlyWeather)
					loading.classList.add('no')
					weatherIcon.classList.remove('no')
					locationIcon.classList.remove('no')
				})
		}).catch((error) => {
			console.error("Error fetching data:", error);
		});
};

//access user device's GPS
async function getPosition() {
	navigator.geolocation.getCurrentPosition((position) => {
		userLatitude = position.coords.latitude;
		userLongitude = position.coords.longitude;
		console.log(userLatitude + "" + userLongitude)
		getUserWeather(userLatitude, userLongitude);
	})
	loading.src = "./Assets/spinner.gif";
	loading.classList.remove('no')
	weatherIcon.classList.add('no')
	locationIcon.classList.add('no')
};
getPosition();



//triggers api call based on search input
const searchInput = document.getElementById('#search');
searchInput.addEventListener('change', (event) => {
	city = event.target.value;
	console.log(city)
	handleSearch(city)
})


//function to take city input and call api for weather
function handleSearch(city) {
	if (!city) return;
	axios
		.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`)
		.then((response) => {
			weather = response.data;
			console.log(weather)
			updateWeather(weather)
		}).then(() => {
			axios
				.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`)
				.then((response) => {
					forecast = response.data;
					hourlyWeather = forecast?.list;
					updateForecast(hourlyWeather);
					createHourlyItem(hourlyWeather)
					loading.classList.add('no')
					weatherIcon.classList.remove('no')
					locationIcon.classList.remove('no')
				})
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
		});
};


const body = document.querySelector('.body');
const themeWrapper = document.querySelector('.header__theme-wrapper');
const theme = document.querySelector('.header__theme');
const lightIcon = document.getElementById('#light');
const darkIcon = document.getElementById('#dark');
themeWrapper.addEventListener('click', handleTheme)
let light = false;

//Set theme from light to dark
function handleTheme() {
	if (!light) {
		darkIcon.classList.remove('none');
		lightIcon.classList.add('none');
		theme.classList.add('selected');
		body.classList.add('dark');
		light = true;
	}
	else {
		darkIcon.classList.add('none');
		lightIcon.classList.remove('none');
		theme.classList.remove('selected');
		body.classList.remove('dark');
		light = false;
	};
};


//update weather card with weather variable
function updateWeather(weather) {
	sunrise = new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString();
	sunset = new Date(weather?.sys?.sunset * 1000).toLocaleTimeString();
	weatherDescription = weather.weather[0].description;
	highTemp = Math.floor(parseInt((weather.main.temp_max - 273.15) * 9 / 5 + 32)) + "°";
	lowTemp = Math.floor(parseInt((weather.main.temp_min - 273.15) * 9 / 5 + 32)) + "°";
	const newTime = new Date();
	isNight = UTC < sunset || UTC > sunrise;

	console.log(sunset)
	console.log(sunrise)
    console.log(UTC)



	if(isNight) {
		body.classList.add('dark')
	} else {
		body.classList.remove('dark')
	}

	//check city timezone wit regional US timeZones
	switch (weather.timezone) {
		case -14400:
			timezone = "America/New_York"
			break;
		case -18000:
			timezone = "America/Chicago"
			break;
		case -25200:
			timezone = "America/Los_Angeles"
			break;
	}

	// Get the time in the specified timezone
	const localTimeInTargetZone = newTime.toLocaleString('en-US', {
		timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true
	});

	if (weather.timezone !== userWeather) {
		localTime = localTimeInTargetZone;
	}

	const temp = document.getElementById('#temp')
	temp.innerText = Math.floor(parseInt((weather.main.temp - 273.15) * 9 / 5 + 32)) + "°";

	//set weather icon, checks against current city conditions & local time vs sunset
	if (weather.weather[0].main === "Clouds") {
		weatherIcon.src = isNight ? "./Assets/partly-cloudy-night.svg" : "./Assets/partly-cloudy-day.svg";
	} else if (weather.weather[0].main === "Rain") {
		weatherIcon.src = isNight ? "./Assets/partly-cloudy-night-rain.svg" : "./Assets/partly-cloudy-day-rain.svg";
	} else if (weather.weather[0].main.includes("Snow")) {
		weatherIcon.src = isNight ? "./Assets/partly-cloudy-night-snow.svg" : "./Assets/partly-cloudy-day-snow.svg";
	} else {
		weatherIcon.src = isNight ? "./Assets/clear-night.svg" : "./Assets/clear-day.svg";
	}

	const details = document.getElementById('#details')
	details.innerText = weather.weather[0].description;


	const location = document.getElementById('#location')
	location.innerText = weather.name;

	const date = document.getElementById('#date')
	date.innerText = weekday;

	const time = document.getElementById('#time')
	time.innerText = localTime;

}


const hourlyForecastList = document.querySelector('.hourly-forecast__list');

function updateForecast(hourlyWeather) {
	
	let mainWeather;
	console.log("high " + highTemp)
	console.log("low " + lowTemp)

	if (hourlyWeather.weather === undefined) {
		mainWeather = null;
	} else {
		mainWeather = hourlyWeather.weather[0].main;
	}
	let hours = hourlyWeather?.dt * 1000;

	let details = document.getElementById('#weatherdetails')

	if(sunset >= UTC) {
		details.innerText = weatherDescription + "." + " High for the day is " + highTemp;
	} else {
		details.innerText = weatherDescription + "." + " Low for the night is " + lowTemp;
	}
	
	let hourlyItem = document.createElement('li');
	hourlyItem.classList.add('hourly-forecast__item');
	

	let hourly = document.createElement('p')
	hourly.classList.add('hourly-forecast__hour');
	hourly.innerText = new Date(hours).toLocaleString('en-US', {
		timeZone: timezone, hour: 'numeric', hour12: true
	});

	let hourlyWeatherIcon = document.createElement('img');
	hourlyWeatherIcon.classList.add('hourly-forecast__weathericon')
	
	if (mainWeather === "Clouds") {
		hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night.svg" : "./Assets/partly-cloudy-day.svg";
	} else if (mainWeather === "Rain") {
		hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night-rain.svg" : "./Assets/partly-cloudy-day-rain.svg";
	} else if (mainWeather === "Snow") {
		hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night-snow.svg" : "./Assets/partly-cloudy-day-snow.svg";
	} else {
		hourlyWeatherIcon.src = isNight ? "./Assets/clear-night.svg" : "./Assets/clear-day.svg";
	}

	let hourlyTemp = document.createElement('p')
	hourlyTemp.classList.add('hourly-forecast__temp')
	hourlyTemp.innerText = Math.floor(parseInt(hourlyWeather?.main?.temp - 273.15) * 9 / 5 + 32) + "°";

	hourlyItem.appendChild(hourly);
	hourlyItem.appendChild(hourlyWeatherIcon);
	hourlyItem.appendChild(hourlyTemp);

	return hourlyItem;
}

function createHourlyItem(hourlyForecast) {

	hourlyForecastList.innerHTML = "";

	const limit = Math.min(hourlyForecast.length, 3);
	for(let i = 0; i < limit; i++){
		let h = hourlyForecast[i]
		const item = updateForecast(h);
		hourlyForecastList.appendChild(item);
	}
}








