const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const apartmentsSettings = {
  palace: {
    name: 'Дворец',
    minPrice: 10000
  },
  flat: {
    name: 'Квартира',
    minPrice: 1000
  },
  house: {
    name:  'Дом',
    minPrice: 5000
  },
  bungalow: {
    name: 'Бунгало',
    minPrice: 0
  },
  hotel: {
    name:  'Отель',
    minPrice: 3000
  }
};

const priceValue = {
  low: {
    name : 'low',
    price: 10000
  },
  middle: {
    name: 'middle',
    price: 50000
  },
  high: {
    name: 'high',
    price: 100000
  }
};

export {apartmentsSettings, priceValue, FILE_TYPES};
