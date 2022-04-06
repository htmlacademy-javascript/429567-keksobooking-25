import {isEscapeKey, showAlert, resetForm} from './util.js';
import {MAX_GUEST, MIN_ROOM, MAX_PRICE} from './data.js';
import {apartmentsSettings} from './enum.js';
import {sendData} from './server.js';

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

const address = document.querySelector('#address');
const submitButton = document.querySelector('.ad-form__submit');
const resetButton = document.querySelector('.ad-form__reset');

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

const checkRoomsAndGuestsAndCoordinate = () => {
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
  if(address.value.length === 0) {
    return 'Выберите на карте точку';
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

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

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

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const message = checkRoomsAndGuestsAndCoordinate();
  if (message) {
    showErrorMessage(message);
  }
  else {
    blockSubmitButton();
    sendData(
      () => {
        unblockSubmitButton();
        resetForm(slider.noUiSlider);
      },
      () => {
        showAlert('Не удалось отправить форму');
        unblockSubmitButton();
      },
      new FormData(evt.target)
    );
  }
});


slider.noUiSlider.on('slide', () => {
  typePrice.value = slider.noUiSlider.get();
});

typePrice.addEventListener('change', () => {
  slider.noUiSlider.set(typePrice.value);
});

resetButton.addEventListener('click', () => {
  resetForm(slider.noUiSlider);
});

export {disableForm, enableForm};
