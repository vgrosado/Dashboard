const WEATHERAPIKEY = "bedd81aab35b46aee7f7356339be92b1";
const NEWSAPIKEY = "pub_40178b237df6449c1b856e7f72118db880c99";
let city = "";
let weather;
let weatherDescription = "";
let userWeather = "";
let forecast = [];
let hourlyWeather = [];
let timezone = "";
let localTimeInTargetZone = "";
let localTime = new Date().toLocaleTimeString('en-US', {
	hour: 'numeric', minute: 'numeric', hour12: true
});
let UTC = new Date().toLocaleTimeString();
let isNight = "";
let lowTemp;
let highTemp;
let sunrise = "";
let sunset = "";
let weekday = new Intl.DateTimeFormat("en-us", { weekday: "long" }).format(new Date());
let userLatitude = null;
let userLongitude = null;
const loading = document.querySelector('.forecast__spinner');
const locationIcon = document.getElementById('#locationicon')
const weatherIcon = document.getElementById('#weathergif');
const enviromentalCards = document.querySelectorAll('.enviromental-info__card');
const hourlyForecastWrapper = document.getElementById('#hourlyforecast');
let news = [];
let newsArticles = [];


// get users current weather
function getUserWeather(lat, lon) {
	axios
		.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHERAPIKEY}`)
		.then((response) => {
			weather = response.data;
			userWeather = weather?.timezone;
			updateWeather(weather)
			loading.classList.add('no')
			enviromentalCards.forEach((card) => {
				card.classList.remove('nothing');
			})
			enviromentalCards.forEach((card) => {
				card.classList.add('enviromental-info__card');
			})
			hourlyForecastWrapper.classList.remove('nothing')
			hourlyForecastWrapper.classList.add('hourly-forecast')
			weatherIcon.classList.remove('no')
			locationIcon.classList.remove('no')
		}).then(() => {
			axios
				.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHERAPIKEY}`)
				.then((response) => {
					forecast = response.data;
					hourlyWeather = forecast?.list;
					updateForecast(hourlyWeather);
					createHourlyItem(hourlyWeather)
					loading.classList.add('no')
					enviromentalCards.forEach((card) => {
						card.classList.remove('nothing');
					})
					enviromentalCards.forEach((card) => {
						card.classList.add('enviromental-info__card');
					})
					hourlyForecastWrapper.classList.remove('nothing')
					hourlyForecastWrapper.classList.add('hourly-forecast')
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
		getUserWeather(userLatitude, userLongitude);
	})
	loading.src = "./Assets/spinner.gif";
	enviromentalCards.forEach((card) => {
		card.classList.remove('enviromental-info__card');
	})
	enviromentalCards.forEach((card) => {
		card.classList.add('nothing');
	})
	loading.classList.remove('no')
	weatherIcon.classList.add('no')
	locationIcon.classList.add('no')
	hourlyForecastWrapper.classList.remove('hourly-forecast')
	hourlyForecastWrapper.classList.add('nothing')
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
		.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHERAPIKEY}`)
		.then((response) => {
			weather = response.data;
			updateWeather(weather)
		}).then(() => {
			axios
				.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHERAPIKEY}`)
				.then((response) => {
					forecast = response.data;
					hourlyWeather = forecast?.list;
					updateForecast(hourlyWeather);
					createHourlyItem(hourlyWeather)
					enviromentalCards.forEach((card) => {
						card.classList.remove('nothing');
					})
					enviromentalCards.forEach((card) => {
						card.classList.add('enviromental-info__card');
					})
					loading.classList.add('no')
					hourlyForecastWrapper.classList.remove('nothing')
					hourlyForecastWrapper.classList.add('hourly-forecast')
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
	isNight = localTimeInTargetZone >= sunset || localTimeInTargetZone < sunrise;
	weatherDescription = weather.weather[0].description;
	highTemp = Math.floor(parseInt((weather.main.temp_max - 273.15) * 9 / 5 + 32)) + "°";
	lowTemp = Math.floor(parseInt((weather.main.temp_min - 273.15) * 9 / 5 + 32)) + "°";
	const newTime = new Date();

	if (isNight) {
		body.classList.add('dark')
	} else {
		body.classList.remove('dark')
	}

	//check city timezone with regional US timeZones
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
	localTimeInTargetZone = newTime.toLocaleString('en-US', {
		timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true
	});

	sunrise = new Date(weather?.sys?.sunrise * 1000).toLocaleString('en-US', {
		timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true
	});
	sunset = new Date(weather?.sys?.sunset * 1000).toLocaleString('en-US', {
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
	} else if (weather.weather[0].main === "Snow") {
		weatherIcon.src = isNight ? "./Assets/partly-cloudy-night-snow.svg" : "./Assets/partly-cloudy-day-snow.svg";
	} else {
		weatherIcon.src = isNight ? "./Assets/starry-night.svg" : "./Assets/clear-day.svg";
	}

	const details = document.getElementById('#details')
	details.innerText = weather.weather[0].description;


	const location = document.getElementById('#location')
	location.innerText = weather.name;

	const date = document.getElementById('#date')
	date.innerText = weekday;

	const time = document.getElementById('#time')
	time.innerText = localTime;

	const feelsLike = document.getElementById('#feelslike')
	feelsLike.innerText = "Feels like " + Math.floor(parseInt((weather.main.feels_like - 273.15) * 9 / 5 + 32)) + "°";

	const humidity = document.getElementById('#humidity')
	humidity.innerText = weather.main.humidity + "%";

	const windSpeed = document.getElementById('#wind')
	windSpeed.innerText = Math.floor(weather.wind.speed) + " Mph";

	const sunrises = document.getElementById('#sunrise')
	sunrises.innerText = sunrise;

	const sunsets = document.getElementById('#sunset')
	sunsets.innerText = sunset;

}

const hourlyForecastList = document.querySelector('.hourly-forecast__list');
function updateForecast(hourlyWeather) {

	let mainWeather;
	if (hourlyWeather.weather === undefined) {
		mainWeather = null;
	} else {
		mainWeather = hourlyWeather.weather[0]?.main;
	}

	let details = document.getElementById('#weatherdetails')
	if (!isNight) {
		details.innerText = "High for the day is " + highTemp;
	} else {
		details.innerText = "Low for the night is " + lowTemp;
	}

	let hourlyItem = document.createElement('li');
	hourlyItem.classList.add('hourly-forecast__item');

	let hours = new Date(hourlyWeather.dt * 1000).toLocaleString('en-US', {
		timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: true
	});

	
	let hourly = document.createElement('p')
	hourly.classList.add('hourly-forecast__hour');
	hourly.innerText = hours;

	
	console.log("forecast Time " + hours + " vs " + sunset)
	console.log("forecast Time " + hours + " vs " + sunrise)

	let hourlyWeatherIcon = document.createElement('img');
	hourlyWeatherIcon.classList.add('hourly-forecast__weathericon')

	if (mainWeather === "Clouds") {
        hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night.svg" : "./Assets/partly-cloudy-day.svg";
    } else if (mainWeather === "Rain") {
        hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night-rain.svg" : "./Assets/partly-cloudy-day-rain.svg";
    } else if (mainWeather === "Snow") {
        hourlyWeatherIcon.src = isNight ? "./Assets/partly-cloudy-night-snow.svg" : "./Assets/partly-cloudy-day-snow.svg";
    } else {
        hourlyWeatherIcon.src = isNight ? "./Assets/starry-night.svg" : "./Assets/clear-day.svg";
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
	for (let i = 0; i < limit; i++) {
		let h = hourlyForecast[i]
		const item = updateForecast(h);
		hourlyForecastList.appendChild(item);
	}
}

axios
	.get(`https://newsdata.io/api/1/news?apikey=${NEWSAPIKEY}&country=us&language=en&image=1`)
	.then((response) => {
		news = response.data;
		newsArticles = news?.results;
	}).then(() => {
		const sortedArticles = newsArticles.filter((article, index) => {
			// Check if the current article's title is unique by comparing with previous titles
			return newsArticles.findIndex((prevArticle) => prevArticle?.title === article?.title) === index
		});
		createNewsArticles(sortedArticles);
	})
	.catch((error) => {
		console.error("Error fetching data:", error);
	});

const newsWrapper = document.getElementById('#newslist');
function updateNews(news) {

	const newsLink = document.createElement('a')
	newsLink.classList.add('news__item')
	newsLink.href = news.link;

	const newsCover = document.createElement('img');
	newsCover.classList.add('news__cover')
	newsCover.src = news.image_url;

	const newsTitle = document.createElement('p');
	newsTitle.classList.add('news__title')
	newsTitle.innerText = news.title;

	newsLink.appendChild(newsCover);
	newsLink.appendChild(newsTitle);
	
	return newsLink;
}

function createNewsArticles(articles) {
	for (let i = 0; i < articles.length; i++) {
		let a = articles[i]
		const thing = updateNews(a);
		newsWrapper.appendChild(thing);
	}
}









