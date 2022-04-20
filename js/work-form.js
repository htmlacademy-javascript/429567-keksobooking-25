import {isEscapeKey, resetForm} from './util.js';
import {MAX_GUEST, MIN_ROOM, MAX_PRICE, LAT_TOKIO, LNG_TOKIO, MAX_ADS} from './data.js';
import {apartmentsSettings} from './limits.js';
import {sendData, getData} from './server.js';
import {createMarkers} from './map.js';

const form = document.querySelector('.ad-form');
const formFiledsets = form.querySelectorAll('fieldset');
const mapFilters = document.querySelector('.map__filters');
const mapSelects = mapFilters.querySelectorAll('select');

const roomSelect = form.querySelector('#room_number');
const guestSelect = form.querySelector('#capacity');

const errorMessage = document.querySelector('#error');
const errorElement = errorMessage.content.querySelector('.error').cloneNode(true);
const errorParagraph = errorElement.querySelector('.error__message');
const errorButton = errorElement.querySelector('.error__button');

const successMessage = document.querySelector('#success');
const successElement = successMessage.content.querySelector('.success').cloneNode(true);

const selectTypeAppartment = document.querySelector('#type');
const typePrice = document.querySelector('#price');

const timeIn  = document.querySelector('#timein');
const timeOut = document.querySelector('#timeout');

const address = document.querySelector('#address');
const submitButton = document.querySelector('.ad-form__submit');
const resetButton = document.querySelector('.ad-form__reset');

const disableForm = () => {
  form.classList.add('ad-form--disabled');
  formFiledsets.forEach(
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

const enableFilter = () => {
  mapFilters.classList.remove('map__filters--disabled');
  mapSelects.forEach(
    (element) => {
      element.disabled = false;
    }
  );
};

const enableForm = () => {
  form.classList.remove('ad-form--disabled');
  formFiledsets.forEach(
    (element) => {
      element.disabled = false;
    }
  );
  address.value = `${LAT_TOKIO}, ${LNG_TOKIO}`;

  form.querySelector('.ad-form__slider').classList.remove('ad-form__slider--disabled');

  getData((ads) => {
    ads.slice(0, MAX_ADS).forEach(
      (ad) => {
        createMarkers(ad);
      }
    );
    enableFilter();
  });
};

const validateInputData = () => {
  const errorsList = [];
  const optionRoomsSelect = Number(roomSelect.options[roomSelect.selectedIndex].value);
  const optionGuestsSelect = Number(guestSelect.options[guestSelect.selectedIndex].value);
  const formTitle = document.querySelector('#title');
  if (optionGuestsSelect > optionRoomsSelect && optionGuestsSelect !== MAX_GUEST && optionRoomsSelect !== MIN_ROOM) {
    errorsList.push('Количество гостей не может быть больше чем количество комнат');
  }
  if (optionGuestsSelect === MIN_ROOM) {
    errorsList.push('Необходим хотя бы 1 гость');
  }
  if (optionRoomsSelect === MAX_GUEST) {
    errorsList.push('Данный тип не предназначен для гостей');
  }
  if (address.value === '') {
    errorsList.push('Выберите на карте точку');
  }
  if (typePrice.value <= apartmentsSettings[selectTypeAppartment.value].minPrice) {
    errorsList.push(`Цена должна быть выше ${apartmentsSettings[selectTypeAppartment.value].minPrice}`);
  }
  if (formTitle.value.length < 30 || formTitle.value.length > 100) {
    errorsList.push('Заголовок должен быть больше 30 символов, но не больше 100');
  }
  return errorsList;
};

const onEscKeydown = (evt) => {
  if(isEscapeKey(evt)) {
    evt.preventDefault();
    closeErrorMessage();
    closeSuccessMessage();
  }
};

const onClickEmptyPlaceError = (evt) => {
  if (evt.target !== errorParagraph && evt.target !== errorButton) {
    closeErrorMessage();
  }
};

const onClickEmptyPlaceSuccsess = (evt) => {
  if (evt.target !== errorParagraph) {
    closeSuccessMessage();
  }
};

function closeErrorMessage () {
  errorElement.remove();
  document.removeEventListener('keydown', onEscKeydown);
  document.removeEventListener('click', onClickEmptyPlaceError);
}

function closeSuccessMessage () {
  successElement.remove();
  document.removeEventListener('keydown', onEscKeydown);
  document.removeEventListener('click', onClickEmptyPlaceSuccsess);
}

const showErrorMessage = (message) => {
  let textError = '';
  for (let i = 0; i< message.length; i++) {
    textError += `${message[i]} <br/>`;
  }
  errorElement.querySelector('.error__message').innerHTML = textError;
  document.querySelector('body').append(errorElement);

  errorElement.querySelector('.error__button').addEventListener('click', () => {
    errorElement.remove();
  });

  document.addEventListener('click', onClickEmptyPlaceError);
  document.addEventListener('keydown', onEscKeydown);
};

const showSuccessMessage = () => {
  document.querySelector('body').append(successElement);

  document.addEventListener('click', onClickEmptyPlaceSuccsess);
  document.addEventListener('keydown', onEscKeydown);
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
  const message = validateInputData();
  if (message.length > 0) {
    showErrorMessage(message);
  }
  else {
    blockSubmitButton();
    sendData(
      () => {
        unblockSubmitButton();
        resetForm(slider.noUiSlider);
        showSuccessMessage();
      },
      () => {
        showErrorMessage('Не удалось отправить форму');
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

resetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetForm(slider.noUiSlider);
});

export {disableForm, enableForm, enableFilter};
