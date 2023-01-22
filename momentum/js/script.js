import playlist from "./playlist.js";

const greetingTranslation = {
  'ru': [
    ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи'],
    ['[Введите имя]']
  ],
  'en': [
    ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
    ['[Enter name]']
  ]
};
const weatherTranslation = {
  'ru': [
    ['Скорость ветра:', 'м/с', 'Влажность:', 'Ошибка! Введите город', 'Ошибка, город не найден']
  ],
  'en': [
    ['Wind speed:', 'm/s', 'Humidity:', 'Error! Nothing to geocode for!', 'Error! city not found for']
  ]
};

const quotesJson = { 'en': ['../assets/quotes.json'], 'ru': ['../assets/quotes-ru.json'] };
let lang = 'en';

function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;

  showDate();
  showGreeting(lang);
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const data = document.querySelector('.date');
  const date = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = date.toLocaleDateString(lang, options);
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


function showGreeting(lang = 'en') {
  const greeting = document.querySelector('.greeting');
  const index = ['morning', 'afternoon', 'evening', 'night'].indexOf(getTimeOfDay());
  greeting.textContent = `${greetingTranslation[lang][0][index]}`;
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
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
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

const slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', () => {
  if (unsplash.selected) {
    getLinkToImageUnsplash();
  } else if (flickr.selected) {
    getLinkToImageFlickr();
  } else {
    getSlideNext();
  }
});

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
slidePrev.addEventListener('click', () => {
  if (unsplash.selected) {
    getLinkToImageUnsplash();
  } else if (flickr.selected) {
    getLinkToImageFlickr();
  } else {
    getSlidePrev();
  }
});

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
if (city.value == '') {
  city.placeholder = '[Enter city]';
}

const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=df03f79709a93dd0dbb3c45d94366c54&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  try {
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${weatherTranslation[lang][0][0]} ${Math.floor(data.wind.speed)} ${weatherTranslation[lang][0][1]}`;
    humidity.textContent = `${weatherTranslation[lang][0][2]} ${data.main.humidity}%`;
    weatherError.textContent = '';
  } catch {
    weatherIcon.textContent = '';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    if (data.cod == 400) {
      weatherError.textContent = `${weatherTranslation[lang][0][3]}`;
    } else if (data.cod == 404) {
      weatherError.textContent = `${weatherTranslation[lang][0][4]} ${city.value}`;
      console.log(`${weatherTranslation[lang][0][4]}`);
    }
  }
}


function setCity(event) {
  getWeather(event.target.value);
}

city.addEventListener('change', setCity);


async function getQuotes() {
  const quotes = `${quotesJson[lang][0]}`;
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
let playNum = 0;

const audio = new Audio();
audio.src = playlist[playNum].src;

const play = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const songTitle = document.querySelector('.song-title');
const songTitleNumber = () => songTitle.textContent = `${playNum + 1}. ${playlist[playNum].title}`;
songTitleNumber();
const playerTimeCurrent = document.querySelector('.player-time-current');
playerTimeCurrent.textContent = '00:00 /\u00A0';
const playerTimeLength = document.querySelector('.player-time-length');
const playerTimeDuratation = () => playerTimeLength.textContent = `${playlist[playNum].duratation}`;
playerTimeDuratation();
const progressBar = document.querySelector('.progress-bar');
let audioLength;
let isPlay = false;


function audioTimeTracker(currentTimeOfTrack, el) {
  let minutes = Math.floor(currentTimeOfTrack / 60);
  let seconds = currentTimeOfTrack % 60;

  if (currentTimeOfTrack < 10) {
    el.textContent = `00:0${seconds} /\u00A0`;
  } else if (currentTimeOfTrack >= 10 && currentTimeOfTrack < 60) {
    el.textContent = `00:${seconds} /\u00A0`;
  } else if (currentTimeOfTrack >= 60) {
    if (minutes < 10 && seconds < 10) {
      el.textContent = `0${minutes}:0${seconds} /\u00A0`;
    }
    if (minutes < 10 && seconds >= 10) {
      el.textContent = `0${minutes}:${seconds} /\u00A0`;
    }
  }
}

audio.addEventListener('ended', playNext);

function playAudio() {
  audio.play();
  songTitleNumber();
  playerTimeDuratation();
  setInterval(() => {
    let audioTime = Math.round(audio.currentTime);
    audioLength = Math.round(audio.duration);
    audioTimeTracker(audioTime, playerTimeCurrent);
    progressBar.value = (audioTime * 100) / audioLength;
  }, 100);
}


function progressBarChange(changeValue) {
  if (isPlay == true) {
    audio.currentTime = Math.round(audioLength * changeValue / 100);
  } else {
    audio.currentTime = 0;
  }
}

progressBar.addEventListener('input', function () {
  progressBarChange(this.value);
});


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
  setActiveSong();
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

const playItem = document.querySelectorAll('.play-item');

playItem.forEach((el, index) => el.setAttribute('id', index));

playItem.forEach((el, index) => el.addEventListener('click', function () {
  playNum = index;

  if (el.classList.contains('item-active') && isPlay == true) {
    isPlay = false;
    pauseAudio();
    play.classList.remove('pause');
  } else if (el.classList.contains('item-active') && audio.paused) {
    isPlay = true;
    playAudio();
    play.classList.add('pause');
  } else {
    isPlay = true;
    audio.src = playlist[playNum].src;
    setActiveSong();
    playAudio();
    play.classList.add('pause');
  }
}));


function setActiveSong() {
  const currentSong = document.getElementById(`${playNum}`);
  playItem.forEach((el) => el.classList.remove('item-active'));
  currentSong.classList.add('item-active');
}
setActiveSong();


function playNext() {
  isPlay = true;
  play.classList.add('pause');
  if (playNum < 3) {
    playNum += 1;
  } else if (playNum >= 3) {
    playNum = 0;
  }
  audio.src = playlist[playNum].src;
  setActiveSong();
  playAudio();
}

playNextBtn.addEventListener('click', playNext);


function playPrev() {
  isPlay = true;
  play.classList.add('pause');
  if (playNum > 0) {
    playNum -= 1;
  } else if (playNum == 0) {
    playNum = 3;
  }
  audio.src = playlist[playNum].src;
  setActiveSong();
  playAudio();
}

playPrevBtn.addEventListener('click', playPrev);

const playerVolumeButton = document.querySelector('.player-volume-button');
const volumeOnAdd = () => playerVolumeButton.classList.add('player-volume-on');
const volumeOnRemove = () => playerVolumeButton.classList.remove('player-volume-on');
const volumeOffAdd = () => playerVolumeButton.classList.add('player-volume-off');
const volumeOffRemove = () => playerVolumeButton.classList.remove('player-volume-off');
let isVolume = true;

function toggleVolume() {
  if (isVolume == true) {
    isVolume = false;
    volumeOnRemove();
    volumeOffAdd();
    audio.volume = 0;
  } else {
    if (isVolume == false) {
      isVolume = true;
      volumeOffRemove();
      volumeOnAdd();
      audio.volume = 0.85;
    }
  }
}

playerVolumeButton.addEventListener('click', toggleVolume);


const playerVolumeControl = document.querySelector('.player-volume-control');

function changeAudioVolume(valueOfVolume) {
  audio.volume = valueOfVolume / 100;
}

playerVolumeControl.addEventListener('input', function () {
  changeAudioVolume(this.value);
});


const settingsButton = document.querySelector('.settings-button');
const settingsButtonAdd = () => settingsButton.classList.add('settings-button-active');
const settingsButtonRemove = () => settingsButton.classList.remove('settings-button-active');
const settings = document.querySelector('.settings');
const settingsAdd = () => settings.classList.add('settings-active');
const settingsRemove = () => settings.classList.remove('settings-active');
const settingsClose = document.querySelector('.settings-close');
const toggleSlider = document.querySelectorAll('.toggle-slider');
const timeOn = document.querySelector('.time-on');
const dateOn = document.querySelector('.date-on');
const greetingOn = document.querySelector('.greeting-on');
const quotesOn = document.querySelector('.quotes-on');
const playerOn = document.querySelector('.player-on');
const weatherOn = document.querySelector('.weather-on');

const hideWeather = () => {
  const weather = document.querySelector('.weather');
  if (weatherOn.classList.contains('has-toggle-on')) {
    weather.classList.add('hidden');
  } else {
    weather.classList.remove('hidden');
  }
};
weatherOn.addEventListener('click', hideWeather);

const hidePlayer = () => {
  const player = document.querySelector('.player');
  if (playerOn.classList.contains('has-toggle-on')) {
    player.classList.add('hidden');
  } else {
    player.classList.remove('hidden');
  }
};
playerOn.addEventListener('click', hidePlayer);

const hideQuotes = () => {
  const quotes = document.querySelector('.quote-wrapper');
  if (quotesOn.classList.contains('has-toggle-on')) {
    quotes.classList.add('hidden');
  } else {
    quotes.classList.remove('hidden');
  }
};
quotesOn.addEventListener('click', hideQuotes);



const hideGreeting = () => {
  const greeting = document.querySelector('.greeting');
  const name = document.querySelector('.name');
  if (greetingOn.classList.contains('has-toggle-on')) {
    greeting.classList.add('hidden');
    name.classList.add('hidden');
  } else {
    greeting.classList.remove('hidden');
    name.classList.remove('hidden');
  }
};
greetingOn.addEventListener('click', hideGreeting);



const hideDate = () => {
  const date = document.querySelector('.date');
  if (dateOn.classList.contains('has-toggle-on')) {
    date.classList.add('hidden');
  } else {
    date.classList.remove('hidden');
  }
};
dateOn.addEventListener('click', hideDate);



const hideTime = () => {
  const time = document.querySelector('.time');
  if (timeOn.classList.contains('has-toggle-on')) {
    time.classList.add('hidden');
  } else {
    time.classList.remove('hidden');
  }
};
timeOn.addEventListener('click', hideTime);

settingsButton.addEventListener('click', () => {
  if (settings.classList.contains('settings-active')) {
    settingsButtonRemove();
    settingsRemove();
  } else {
    settingsButtonAdd();
    settingsAdd();
  }
});

settingsClose.addEventListener('click', () => {
  settingsButtonRemove();
  settingsRemove();
});

window.addEventListener('click', (e) => {
  if (!e.target.closest('.settings') && !e.target.closest('.settings-button')) {
    settingsButtonRemove();
    settingsRemove();
  }
});

toggleSlider.forEach((el) => el.addEventListener('click', () => {
  const toggleOnAdd = () => el.classList.add('has-toggle-on');
  const toggleOnRemove = () => el.classList.remove('has-toggle-on');
  const toggleOffAdd = () => el.classList.add('has-toggle-off');
  const toggleOffRemove = () => el.classList.remove('has-toggle-off');
  if (el.classList.contains('has-toggle-on')) {
    toggleOnRemove();
    toggleOffAdd();
  } else {
    toggleOffRemove();
    toggleOnAdd();
  }
}));

const languageButton = document.querySelectorAll('.language-button');
const name = document.querySelector('.name');
const settingName = document.querySelectorAll('.setting-name');

const translateLanguageRu = () => {
  lang = 'ru';
  showGreeting(lang);
  name.placeholder = '[Введите имя]';
  city.placeholder = '[Введите город]';

  if (city.value === 'Minsk') {
    city.value = 'Минск';
  }

  getWeather(lang);
  showDate(lang);
  getQuotes(lang);
  settingName[0].textContent = 'Изменить язык';
  settingName[1].textContent = 'Время';
  settingName[2].textContent = 'Дата';
  settingName[3].textContent = 'Приветствие';
  settingName[4].textContent = 'Цитаты';
  settingName[5].textContent = 'Аудио плеер';
  settingName[6].textContent = 'Погода';
  settingName[7].textContent = 'Фоновое изображение';
};

const translateLanguageEn = () => {
  lang = 'en';
  showGreeting(lang);
  name.placeholder = '[Enter name]';
  city.placeholder = '[Enter city]';

  if (city.value === 'Минск') {
    city.value = 'Minsk';
  }

  getWeather(lang);
  showDate(lang);
  getQuotes(lang);
  settingName[0].textContent = 'Change language';
  settingName[1].textContent = 'Time';
  settingName[2].textContent = 'Date';
  settingName[3].textContent = 'Greeting';
  settingName[4].textContent = 'Quotes';
  settingName[5].textContent = 'Audio player';
  settingName[6].textContent = 'Weather';
  settingName[7].textContent = 'Background';
};

languageButton.forEach((el) => el.addEventListener('click', () => {

  const languageActiveRemove = () => languageButton.forEach((el) => el.classList.remove('language-button-active'));
  const languageActiveAdd = () => el.classList.add('language-button-active');
  languageActiveRemove();
  languageActiveAdd();

  if (el.textContent === 'RU') {
    translateLanguageRu();
  } else {
    translateLanguageEn();
  }
}));

async function getLinkToImageUnsplash() {
  const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=gnCgwDcRPu-bAMgzvp52Lm7p-xLHPP89lY8B8YwKN7I';
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = data.urls.regular;
  const backgroundUnsplash = img.src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${backgroundUnsplash})`;
  };
}

async function getLinkToImageFlickr() {
  const url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=89227889b4c0daea409061b494f237c1&tags=nature&extras=url_l&format=json&nojsoncallback=1';
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  let min = Math.ceil(1);
  let max = Math.floor(20);
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  img.src = `${data.photos.photo[randomNum].url_l}`;
  const backgroundFlickr = img.src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${backgroundFlickr})`;
  };
}

const select = document.querySelector('.select');
const unsplash = document.querySelector('.unsplash');
const flickr = document.querySelector('.flickr');

select.addEventListener('change', () => {
  if (unsplash.selected) {
    getLinkToImageUnsplash();
  } else if (flickr.selected) {
    getLinkToImageFlickr();
  } else {
    setBg();
  }
});


