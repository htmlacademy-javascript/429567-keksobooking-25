import {ALERT_SHOW_TIME, PLACE_HOLDER, LAT_TOKIO, LNG_TOKIO} from './data.js';
import {resetMainPinMarker} from './map.js';

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

//взята с https://learn.javascript.ru/task/shuffle
function shuffle(arrayInput) {
  const maxElementArray = getRandomInt(1, arrayInput.length - 1);
  const array = arrayInput.slice(); //копия массива
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

    // поменять элементы местами
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(maxElementArray); // обрезаю массив
}

const isEscapeKey = (evt) => evt.key === 'Escape';

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const form = document.querySelector('.ad-form');
const titleForm = document.querySelector('#title');
const descriptionForm = document.querySelector('#description');
const featuresCheckBoxes = document.querySelectorAll('.features__checkbox');
const fileForm = document.querySelector('#images');
const avatarForm = document.querySelectorAll('#avatar');
const address = document.querySelector('#address');
const typePrice = document.querySelector('#price');
const selectTypeAppartment = document.querySelector('#type');
const roomSelect = form.querySelector('#room_number');
const guestSelect = form.querySelector('#capacity');
const timeIn  = document.querySelector('#timein');
const timeOut = document.querySelector('#timeout');

const resetForm = (slider) => {
  titleForm.value = '';
  address.value = `${LAT_TOKIO}, ${LNG_TOKIO}`;
  typePrice.placeholder = PLACE_HOLDER;
  slider.set(PLACE_HOLDER);
  typePrice.value = '';
  selectTypeAppartment.selectedIndex = 1;
  roomSelect.selectedIndex = 0;
  guestSelect.selectedIndex = 0;
  descriptionForm.value = '';
  timeIn.selectedIndex = 0;
  timeOut.selectedIndex = 0;
  featuresCheckBoxes.forEach(
    (element) => {
      element.checked = false;
    }
  );
  fileForm.value = '';
  avatarForm.value = '';
  resetMainPinMarker();
};

export {getRandomInt, getRandomFloat, shuffle, isEscapeKey, showAlert, resetForm};
