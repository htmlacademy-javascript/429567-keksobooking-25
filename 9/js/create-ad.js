import {getRandomInt,
  getRandomFloat, shuffle} from './util.js';
import {RENT_TYPE,
  RENT_CHECKIN,
  RENT_CHECKOUT,
  RENT_FEATURES,
  RENT_FOTOS,
  MIN_LAT,
  MAX_LAT,
  MIN_LNG,
  MAX_LNG,
  MAX_GUEST,
  MAX_ROOMS,
  MAX_PRICE,
  ads} from './data.js';

function createAd (count) {
  for (let i = 1; i < count + 1; i++) {
    const author = {
      avatar: `img/avatars/user${i < 10 ? `0${i}` : i}.png`
    };

    const location = {
      lat: getRandomFloat (MIN_LAT, MAX_LAT, 5),
      lng: getRandomFloat (MIN_LNG, MAX_LNG, 5)
    };

    const offer = {
      title: `Заголовок ${i}`,
      address: `${location.lat},${location.lng}`,
      price: getRandomInt(0, MAX_PRICE),
      type: RENT_TYPE[getRandomInt(0, RENT_TYPE.length - 1)],
      rooms: getRandomInt(0, MAX_ROOMS),
      guests: getRandomInt(0, MAX_GUEST),
      checkin: RENT_CHECKIN[getRandomInt(0, RENT_CHECKIN.length - 1)],
      checkout: RENT_CHECKOUT[getRandomInt(0, RENT_CHECKOUT.length - 1)],
      features: shuffle(RENT_FEATURES),
      description: `Описание объявления ${i}`,
      photos: shuffle(RENT_FOTOS)
    };

    ads[i] = {
      author,
      offer,
      location
    };
  }
}

export {createAd, ads};
