'use strict';

const flipCard = document.querySelector(".flip-card");
const cardFront = document.querySelector("#card-front");
const cardBack = document.querySelector("#card-back");
const buttonBack = document.querySelector("#back");
const buttonNext = document.querySelector("#next");
const buttonExam = document.querySelector("#exam");
const shuffleWords = document.querySelector("#shuffle-words");
const examCards = document.querySelector("#exam-cards");
const studyCards = document.querySelector(".study-cards");
const studyMode = document.querySelector("#study-mode");
const examMode = document.querySelector("#exam-mode");
const timer = document.querySelector("#time");
const wordsProgress = document.querySelector("#words-progress");
const examProgress = document.querySelector("#exam-progress");
const resultsModal = document.querySelector(".results-modal");
const wordStatsTemplate = document.querySelector("#word-stats");
const buttonRestart = document.querySelector("#restart");
const resultsContent = document.querySelector(".results-content");
const buttonTraining = document.querySelector("#training");
const examWords = [];
const dictionary = {};

let currentWord = +(document.querySelector("#current-word").textContent);
let counter = 0;
let correctPercent = parseInt(document.querySelector("#correct-percent").textContent);
let timerId = null;
let seconds = +timer.textContent.slice(-2);
let minutes = +timer.textContent.slice(0,2);
let attempts = 1;
let firstCard = null;
let secondCard = null;

const words = [
  {
    word: "street",
    translation: "улица",
    example: "There are many famous streets in the city",
    attempts: 1
  },
  {
    word: "home",
    translation: "дом",
    example: "Home is the best place",
    attempts: 1
  },
  {
    word: "apple",
    translation: "яблоко",
    example: "Apple is a healthy fruit",
    attempts: 1
  },
  {
    word: "popcorn",
    translation: "попкорн",
    example: "Popcorn is an ideal movie food",
    attempts: 1
  },
  {
    word: "cat",
    translation: "кошка",
    example: "The cat lives in the village",
    attempts: 1
  }
]; 

const copyWords = [...words];

// Получаем словарь
getDictionary();


// Создание первой карточки по умолчанию 
createFlipCard(words[counter]);


// Функция для получения словаря словаря
function getDictionary() {
  words.forEach((item) => {
    dictionary[item.word] = item.translation;
    dictionary[item.translation] = item.word;
  });
}


// Функция создание Флип-карточки
function createFlipCard(item) {
  cardFront.querySelector("h1").textContent = item.word;
  cardBack.querySelector("h1").textContent = item.translation;
  cardBack.querySelector("span").textContent = item.example;
}


// Функция создания карточек для "Тестирования"
function createCard(value) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.textContent = value;
  examCards.append(card);
}


// Функция создания статистики слова
function makeStatsByTemplate(obj) {
  const stats = wordStatsTemplate.content.cloneNode(true);

  stats.querySelector(".word").querySelector("span").textContent = obj.word;
  stats.querySelector(".attempts").querySelector("span").textContent = obj.attempts;

  resultsContent.append(stats);
}


// Функция перемешивания массива
function shuffle(arr){
	for(let i = 0; i < arr.length; i++){
		const randomIndex = Math.floor(Math.random() * arr.length);
		const temp = arr[randomIndex];
		arr[randomIndex] = arr[i];
		arr[i] = temp;
	}
  
	return arr;
}


// Функция получения массива слов и их карточек в рандомном порядке
function getWordCards() {
  words.forEach((item) => {
    examWords.push(item.word, item.translation);
  });

  shuffle(examWords).forEach((item) => {
    createCard(item);
  });
}


// Функция завершения тестирования
function finish() {
  setTimeout(() => {
    clearInterval(timerId);
    examCards.classList.add("hidden");
    resultsModal.classList.remove("hidden");
    buttonRestart.classList.remove("hidden");
    buttonTraining.classList.remove("hidden");

    resultsModal.querySelector("#timer").textContent = timer.textContent;

    words.forEach((item) => {
      makeStatsByTemplate(item);
    });    
  }, 10);
}


// Функция удаления карточек, если они совпали
function removeCards() {
  secondCard.classList.add("correct");

  firstCard.classList.add('fade-out');
  secondCard.classList.add('fade-out');

  examWords.splice(examWords.findIndex((item) => item === firstCard.textContent), 1);
  examWords.splice(examWords.findIndex((item) => item === secondCard.textContent), 1);

  firstCard = null;
  secondCard = null;

  correctPercent += 20;
  document.querySelector("#correct-percent").textContent = `${correctPercent}%`;
  examProgress.value += 20;
}


// Функция сброса карточек, если они не совпали
function resetCards() {
  secondCard.classList.add("wrong");

  words.forEach((item) => {
    if (item.word === secondCard.textContent || item.translation === secondCard.textContent) {
      item.attempts += 1;
      return;
    }
  });

  setTimeout(() => {
    firstCard.classList.remove('correct');
    secondCard.classList.remove('wrong');
    firstCard = null;
    secondCard = null;
  }, 500);
}


// Функция для сброса данных в начале тестирования 
function startTesting() {
  buttonRestart.classList.add("hidden");
  buttonTraining.classList.add("hidden");
  examCards.innerHTML = "";
  resultsContent.innerHTML = "";  

  seconds = 0;
  minutes = 0;
  timer.textContent = `${format(minutes)}:${format(seconds)}`;

  correctPercent = 0;
  document.querySelector("#correct-percent").textContent = `${correctPercent}%`;
  examProgress.value = 0;

  getWordCards();

  timerStart();  
}


// Функция форматирования времени
function format(value) {
  if (value < 10) {
    return `0${value}`;
  } else {
    return value;
  }
}


// Функция таймера
function timerStart() {
  timerId = setInterval(() => {
    if (seconds == 59) {
      seconds = 0;
      minutes += 1;
    } else {
      seconds++;    
      timer.textContent = `${format(minutes)}:${format(seconds)}`;
    }
  }, 1000);
}


// Обработчик для Флип-карточки
flipCard.addEventListener("click", () => {
  flipCard.classList.toggle("active");
});


// Обработчик для кнопки "Назад"
buttonBack.addEventListener("click", () => {
  if (counter === (copyWords.length - 1)) {
    buttonNext.disabled = false;
  }
  
  counter--;
  createFlipCard(copyWords[counter]);  
  currentWord -= 1;
  wordsProgress.value -= 20;
  document.querySelector("#current-word").textContent = currentWord;

  if (counter === 0) {
    buttonBack.disabled = true;
  }
});


// Обработчик для кнопки "Вперед"
buttonNext.addEventListener("click", () => {
  if (counter === 0) {
    buttonBack.disabled = false;
  }

  counter++;
  createFlipCard(copyWords[counter]);    
  currentWord += 1;
  wordsProgress.value += 20;
  document.querySelector("#current-word").textContent = currentWord;

  if (counter === (copyWords.length - 1)) {
    buttonNext.disabled = true;
  }
});


// Обработчик для кнопки перемешивания флип-карточек
shuffleWords.addEventListener("click", () => {
  shuffle(copyWords);
  createFlipCard(copyWords[counter]);
});


// Обработчик для кнопки "Тестирование"
buttonExam.addEventListener("click", () => {
  studyCards.classList.add("hidden");
  studyMode.classList.add("hidden");
  examMode.classList.remove("hidden");

  startTesting();
});


// Обработчик на карточки
examCards.addEventListener("click", (event) => {
  const element = event.target.closest('.card');

  if (!firstCard) {
    firstCard = element;
    firstCard.classList.add("correct")
  } else {
    secondCard = element;
  }

  if (secondCard.textContent === firstCard.textContent) {
    firstCard.classList.remove('correct');
    firstCard = null;
    secondCard = null;
    return;
  }

  if (firstCard && secondCard) {
    if (dictionary[firstCard.textContent] === secondCard.textContent) {
      removeCards();

      if (examWords.length === 0) {
        finish();
      }
    } else {
      resetCards();
    }
  }
});


// Обработчик для кнопки "Начать сначала"
buttonRestart.addEventListener("click", () => {
  resultsModal.classList.add("hidden");

  words.forEach((item) => {
    item.attempts = 1;
  });

  startTesting();
});


// Обработчик для кнопки "Тренировка"
buttonTraining.addEventListener("click", () => {
  examMode.classList.add("hidden");  
  resultsModal.classList.add("hidden");
  studyMode.classList.remove("hidden");
  studyCards.classList.remove("hidden");
  examCards.innerHTML = "";

  copyWords.splice(0, copyWords.length, ...words);
  counter = 0;
  createFlipCard(copyWords[counter]);
  currentWord = 1;
  wordsProgress.value = 20;
  document.querySelector("#current-word").textContent = currentWord;

  if (buttonNext.disabled) {
    buttonNext.disabled = false;
  }

  if (!buttonBack.disabled) {
    buttonBack.disabled = true;
  }
});

