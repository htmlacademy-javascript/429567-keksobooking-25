//Функция возвращает рандомное целое число из диапазона включительно
function getRandomInt(min, max) {
  if (min < 0 || max < 0) {
    throw new Error('negative value');
  }
  if (min > max) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция возвращает рандомное число с запятое из диапазона включительно. передается точность после запятой
function getRandomFloat (min, max, accuracy) {
  if (min < 0 || max <0) {
    throw new Error('negative float value');
  }
  if (min > max) {
    [min, max] = [max, min];
  }
  return getRandomInt (Math.floor(min * Math.pow(10,accuracy)), Math.floor(max * Math.pow(10, accuracy))) / Math.pow(10, accuracy);
}

const RENT_TYPE = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const RENT_CHECKIN = ['12:00', '13:00', '14:00'];
const RENT_CHECKOUT = ['12:00', '13:00', '14:00'];
const RENT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const RENT_FOTOS = ['https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg', 'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'];
const MIN_LAT = 35.65000;
const MAX_LAT = 35.70000;
const MIN_LNG = 139.70000;
const MAX_LNG = 139.80000;
const MAX_ADS = 10;
const MAX_GUEST = 5;
const MAX_ROOMS = 7;
const MAX_PRICE = 22800;
const ADS = [];

//взята с https://learn.javascript.ru/task/shuffle
function shuffle(arrayInput) {
  const maxElementArray = getRandomInt(1, arrayInput.length - 1);
  const array = arrayInput.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

    // поменять элементы местами
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(maxElementArray);
}

function createAD (count) {
  for (let i = 0; i < count; i++) {
    const author = {
      avatar: 'img/avatars/user'+ i +'.png'
    };

    const location = {
      lat: getRandomFloat (MIN_LAT, MAX_LAT, 5),
      lng: getRandomFloat (MIN_LNG, MAX_LNG, 5)
    };

    const offer = {
      title: 'Заголовок ' + i,
      address: location.lat + ',' + location.lng,
      price: getRandomInt(0, MAX_PRICE),
      type: RENT_TYPE[getRandomInt(0, RENT_TYPE.length - 1)],
      rooms: getRandomInt(0, MAX_ROOMS),
      guests: getRandomInt(0, MAX_GUEST),
      checkin: RENT_CHECKIN[getRandomInt(0, RENT_CHECKIN.length - 1)],
      checkout: RENT_CHECKOUT[getRandomInt(0, RENT_CHECKOUT.length - 1)],
      features: shuffle(RENT_FEATURES),
      description: 'Описание объявления ' + i,
      photos: shuffle(RENT_FOTOS)
    };

    ADS[i] = [
      author,
      offer,
      location
    ];
  }
}

createAD(MAX_ADS);
console.log(ADS);
