import playlist from "./playlist.js";

function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;

  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const data = document.querySelector('.date');
  const date = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = date.toLocaleDateString('en-US', options);
  data.textContent = currentDate;
}
showDate();

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 0 && hours < 6) {
    return 'night';
  } else if (hours >= 6 && hours < 12) {
    return 'morning';
  } else if (hours >= 12 && hours < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}
getTimeOfDay();

function showGreeting() {
  const greeting = document.querySelector('.greeting');
  const timeOfDay = getTimeOfDay();
  const greetingText = `Good ${timeOfDay}`;
  greeting.textContent = greetingText;
}
showGreeting();

function setLocalStorage() {
  const name = document.querySelector('.name');
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const name = document.querySelector('.name');
  city.value = 'Minsk';
  if (localStorage.getItem('name') || localStorage.getItem('city')) {
    name.value = localStorage.getItem('name');
    city.value = localStorage.getItem('city');
  }
  getWeather();
}
window.addEventListener('DOMContentLoaded', getLocalStorage);



function getRandomNum() {
  const min = Math.ceil(1);
  const max = Math.floor(20);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
getRandomNum();

const timeOfDay = getTimeOfDay();
let bgNum = getRandomNum().toString().padStart(2, "0");
let randomNum = bgNum;

function setBg() {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
    document.body.style.backgroundSize = 'cover';
  };
}
setBg();

let slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', getSlideNext);

function getSlideNext() {
  randomNum++;
  bgNum = randomNum.toString().padStart(2, "0");
  if (randomNum >= 20) {
    randomNum = 0;
    setBg(timeOfDay, bgNum);
  } else {
    setBg(timeOfDay, bgNum);
  }
}


const slidePrev = document.querySelector('.slide-prev');
slidePrev.addEventListener('click', getSlidePrev);

function getSlidePrev() {
  randomNum--;
  bgNum = randomNum.toString().padStart(2, "0");
  if (randomNum <= 1) {
    randomNum = 21;
    setBg(timeOfDay, bgNum);
  } else {
    setBg(timeOfDay, bgNum);
  }
}

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=df03f79709a93dd0dbb3c45d94366c54&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  try {
    if (city.value == '') {
      city.placeholder = '[Enter city]';
    }
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${data.wind.speed} m/c`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherError.textContent = '';
  } catch {
    weatherIcon.textContent = '';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    if (data.cod == 400) {
      weatherError.textContent = 'Error! Nothing to geocode for!';
    } else if (data.cod == 404) {
      weatherError.textContent = `Error! city not found for '${city.value}'`;
    }
  }
}


function setCity(event) {
  getWeather(event.target.value);
}

city.addEventListener('change', setCity);


async function getQuotes() {
  const quotes = '../assets/quotes.json';
  const res = await fetch(quotes);
  const data = await res.json();
  const quote = document.querySelector('.quote');
  const author = document.querySelector('.author');
  let randomQuotes = Math.floor(Math.random() * data.length);
  quote.textContent = `"${data[randomQuotes].text}"`;
  author.textContent = data[randomQuotes].author;
}
getQuotes();

const changeQuote = document.querySelector('.change-quote');
changeQuote.addEventListener('click', getQuotes);

const audio = new Audio();
const play = document.querySelector('.play');
let isPlay = false;

function playAudio() {
  audio.src = playlist[1].src;
  audio.currentTime = 0;
  audio.play();
}

function pauseAudio() {
  audio.pause();
}

function playPause() {
  if (isPlay == false) {
    isPlay = true;
    playAudio();
  } else {
    isPlay = false;
    pauseAudio();
  }
}

function toggleBtn() {
  playPause();
  play.classList.toggle('pause');
}
play.addEventListener('click', toggleBtn);

const playlistContainer = document.querySelector('.play-list');
playlist.forEach((el) => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = el.title;
  playlistContainer.append(li);
});

