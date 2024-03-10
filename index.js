const APIKEY = "bedd81aab35b46aee7f7356339be92b1";
let city = "";
let weather;
let userWeather;
let forecast;
let localTime = new Date().toLocaleTimeString('en-US', {
	hour: 'numeric', minute: 'numeric', hour12: true
});
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
			userWeather = weather.timezone;
			console.log(weather)
			updateWeather(weather)
			loading.classList.add('no')
			weatherIcon.classList.remove('no')
			locationIcon.classList.remove('no')
		}).then(() => {
			axios
				.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}`)
				.then((response) => {
					forecast = response.data;
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
	const newTime = new Date();

	//check city timezone wit regional US timeZones
	let timezone = "";
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

	let sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString();

	const temp = document.getElementById('#temp')
	temp.innerText = Math.floor(parseInt((weather.main.temp - 273.15) * 9 / 5 + 32)) + "°";

	//set weather icon, checks against current city conditions & local time vs sunset
	if (weather.weather[0].main.includes("Clouds") && sunset < localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-night.svg"
	} else if (weather.weather[0].main.includes("Clouds") && sunset > localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-day.svg"
	} else if (weather.weather[0].main.includes("Rain") && sunset < localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-night-rain.svg"
	} else if (weather.weather[0].main.includes("Rain") && sunset > localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-day.svg"
	} else if (weather.weather[0].main.includes("Snow") && sunset < localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-day-snow.svg"
	} else if (weather.weather[0].main.includes("Snow") && sunset > localTime) {
		weatherIcon.src = "./Assets/partly-cloudy-night-snow.svg"
	} else if (sunset > localTime) {
		weatherIcon.src = "./Assets/clear-night.svg"
	} else {
		weatherIcon.src = "./Assets/clear-day.svg"
	}

	const details = document.getElementById('#details')
	details.innerText = weather.weather[0].description;


	const location = document.getElementById('#location')
	location.innerText = weather.name;

	const date = document.getElementById('#date')
	date.innerText = weekday;

	const time = document.getElementById('#time')
	time.innerText = localTime;



	// const foreCastSection = document.querySelector('.forecast__weather-wrapper');

	// function createWeatherCard(forecast) {
	//     const weatherCard = document.createElement('article');
	//     weatherCard.classList.add('forecast__weather-card');

	//     const timeDateLocationWrapper = document.createElement('div');
	//     timeDateLocationWrapper.classList.add('forecast__timedatelocation-wrapper');
	//     const location = document.createElement('h3');
	//     location.classList.add('forecast__location');
	//     location.innerText = forecast.city.name;

	//     const timeDateWrapper = document.createElement('div');
	//     timeDateWrapper.classList.add('forecast__timedate-wrapper');

	//     const date = document.createElement('h2');
	//     date.classList.add('forecast__date');
	//     date.innerText = weekday;

	//     const time = document.createElement('p');
	//     time.classList.add('forecast__time');
	//     time.innerText = today.toLocaleTimeString(undefined, {
	//         hour: 'numeric', minute: 'numeric', hour12: true 
	//     });

	//     const tempIconWrapper = document.createElement('div');
	//     tempIconWrapper.classList.add('forecast__tempicon-wrapper');

	//     const temp = document.createElement('p');
	//     temp.classList.add('forecast__temp');
	//     let temperature =  parseInt(forecast.list[0].main.temp - 273.15) * 9/5 + 32;
	//     temp.innerText = temperature;
	//     const weatherIcon = document.createElement('i');
	//     weatherIcon.classList.add('forecast__weathericon');

	//     const detailsWrapper = document.createElement('div');
	//     detailsWrapper.classList.add('forecast__details-wrapper');

	//     const category = document.createElement('p');
	//     category.classList.add('forecast__category');
	//     const categoryDetails = document.createElement('p');
	//     categoryDetails.classList.add('forecast__details');

	//     timeDateLocationWrapper.appendChild(location)
	//     timeDateLocationWrapper.appendChild(timeDateWrapper)

	//     timeDateWrapper.appendChild(date);
	//     timeDateWrapper.appendChild(time);

	//     tempIconWrapper.appendChild(temp);
	//     tempIconWrapper.appendChild(weatherIcon);

	//     detailsWrapper.appendChild(category);
	//     detailsWrapper.appendChild(categoryDetails);

	//     weatherCard.appendChild(timeDateLocationWrapper);
	//     weatherCard.appendChild(timeDateWrapper);
	//     weatherCard.appendChild(tempIconWrapper);
	//     weatherCard.appendChild(detailsWrapper);

	//     foreCastSection.appendChild(weatherCard);

	//     return weatherCard;
	// }
}
