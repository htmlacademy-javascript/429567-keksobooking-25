import {isEscapeKey} from './util.js';
import {MAX_GUEST, MIN_ROOM, MAX_PRICE} from './data.js';
import {apartmentsSettings} from './enum.js';

const form = document.querySelector('.ad-form');
const formFiledset = form.querySelectorAll('fieldset');
const mapFilters = document.querySelector('.map__filters');
const mapSelects = mapFilters.querySelectorAll('select');

const roomSelect = form.querySelector('#room_number');
const guestSelect = form.querySelector('#capacity');

const errorMessage = document.querySelector('#error');
const errorElement = errorMessage.content.querySelector('.error').cloneNode(true);

const selectTypeAppartment = document.querySelector('#type');
const typePrice = document.querySelector('#price');

const timeIn  = document.querySelector('#timein');
const timeOut = document.querySelector('#timeout');

const disableForm = () => {
  form.classList.add('ad-form--disabled');
  formFiledset.forEach(
    (element) => {
      element.disabled = 'disabled';
    }
  );
  form.querySelector('.ad-form__slider').classList.add('ad-form__slider--disabled');

  mapFilters.classList.add('map__filters--disabled');
  mapSelects.forEach(
    (element) => {
      element.disabled = 'disabled';
    }
  );
};

const enableForm = () => {
  form.classList.remove('ad-form--disabled');
  formFiledset.forEach(
    (element) => {
      element.disabled = false;
    }
  );

  form.querySelector('.ad-form__slider').classList.remove('ad-form__slider--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  mapSelects.forEach(
    (element) => {
      element.disabled = false;
    }
  );
};

const checkRoomsAndGuests = () => {
  const optionRoomsSelect = Number(roomSelect.options[roomSelect.selectedIndex].value);
  const optionGuestsSelect = Number(guestSelect.options[guestSelect.selectedIndex].value);
  if (optionGuestsSelect > optionRoomsSelect && optionGuestsSelect !== MAX_GUEST && optionRoomsSelect !== MIN_ROOM) {
    return 'Количество гостей не может быть больше чем количество комнат';
  }
  if (optionGuestsSelect === MIN_ROOM) {
    return 'Необходим хотя бы 1 гость';
  }
  if (optionRoomsSelect === MAX_GUEST) {
    return 'Данный тип не предназначен для гостей';
  }
  return false;
};

const onEscKeydown = (evt) => {
  if(isEscapeKey(evt)) {
    evt.preventDefault();
    closeErrorMessage();
  }
};

function closeErrorMessage () {
  errorElement.remove();

  document.removeEventListener('keydown', onEscKeydown);
}


const showErrorMessage = (message) => {
  errorElement.querySelector('.error__message').textContent = message;
  document.querySelector('body').append(errorElement);

  errorElement.querySelector('.error__button').addEventListener('click', () => {
    errorElement.remove();
  });

  document.addEventListener('keydown', closeErrorMessage);
};

form.addEventListener('submit', (evt) => {
  const message = checkRoomsAndGuests();
  if (message) {
    evt.preventDefault();
    showErrorMessage(message);
  }
});

const changePlaceHolder = (evt) => {
  typePrice.placeholder = apartmentsSettings[selectTypeAppartment.options[evt.target.options.selectedIndex].value.toLowerCase()].minPrice;
};

selectTypeAppartment.addEventListener('change', changePlaceHolder);

const onChangeTimeIn = (evt) => {
  const timeInValue = timeIn.options[evt.target.options.selectedIndex].value;
  timeOut.value = timeInValue;
};

const onChangeTimeOut = (evt) => {
  const timeOutValue = timeOut.options[evt.target.options.selectedIndex].value;
  timeIn.value = timeOutValue;
};

timeIn.addEventListener('change', onChangeTimeIn);

timeOut.addEventListener('change', onChangeTimeOut);


//SLIDER
const slider = document.querySelector('.ad-form__slider');
const sliderInput = document.querySelector('#price');

noUiSlider.create(slider, {
  range: {
    min: 0,
    max: MAX_PRICE,
  },
  start: 5000,
  connect: 'lower',
  step: 1000,
  format: {
    to: function (value) {
      return value;
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

slider.noUiSlider.on('update', () => {
  typePrice.value = slider.noUiSlider.get();
});

sliderInput.addEventListener('change', () => {
  slider.noUiSlider.set(sliderInput.value);
});

export {disableForm, enableForm};
