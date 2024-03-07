const APIKEY = "bedd81aab35b46aee7f7356339be92b1";
let city = "";
let forecast;
let userForecast;
let today = new Date();
let weekday = new Intl.DateTimeFormat("en-us", { weekday: "long" }).format(today);
let userLatitude = null;
let userLongitude = null;
const loading = document.querySelector('.forecast__spinner')

    function getUserLocation(lat, lon){
        axios 
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`)
            .then((response) => {
                forecast = response.data;
                console.log(forecast)
                updateWeatherCard(forecast)
                loading.classList.add('no')
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    async function getPosition() { 
        navigator.geolocation.getCurrentPosition((position) => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        console.log(userLatitude + "" + userLongitude)
        getUserLocation(userLatitude, userLongitude);
        })
        loading.src = "spinner.gif";
        loading.classList.remove('no')
    };
    getPosition();

const searchInput = document.getElementById('#search');
searchInput.addEventListener('change', (event) => {
    city = event.target.value;
    console.log(city)
    handleSearch(city)
})

function handleSearch(city) {
    if (!city) return; 
        axios
            .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`)
            .then((response) => {
                forecast = response.data;
                updateWeatherCard(forecast)
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

function updateWeatherCard(forecast) {
    const location = document.getElementById('#location')
    if (forecast.city) {
    location.innerText = forecast.city.name;
    } else if (forecast.name) {
        location.innerText = forecast.name;
    }

    const date = document.getElementById('#date')
    date.innerText = weekday;

    const time = document.getElementById('#time')
    time.innerText = today.toLocaleTimeString(undefined, {
        hour: 'numeric', minute: 'numeric', hour12: true 
    });

    const temp = document.getElementById('#temp')
    if (forecast.list) {
    temp.innerText = parseInt(forecast.list[0].main.temp - 273.15) * 9/5 + 32;
    } else if (forecast.main.temp) {
        temp.innerText = parseInt(forecast.main.temp - 273.15) * 9/5 + 32;
    }

    const icon = document.getElementById('#icon');

    const details = document.getElementById('#details')
    details.innerText
    }
        




const foreCastSection = document.querySelector('.forecast__weather-wrapper');

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

