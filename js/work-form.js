import {isEscapeKey, resetForm} from './util.js';
import {MAX_GUEST, MIN_ROOM, MAX_PRICE, LAT_TOKIO, LNG_TOKIO} from './data.js';
import {apartmentsSettings} from './limits.js';
import {sendData} from './server.js';

const form = document.querySelector('.ad-form');
const formFiledset = form.querySelectorAll('fieldset');
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
  address.value = `${LAT_TOKIO}, ${LNG_TOKIO}`;

  form.querySelector('.ad-form__slider').classList.remove('ad-form__slider--disabled');
};

const enableFilter = () => {
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
  if (address.value === '') {
    return 'Выберите на карте точку';
  }
  return false;
};


const validatePrice = () => {
  if (typePrice.value <= apartmentsSettings[selectTypeAppartment.value].minPrice) {
    return `Цена должна быть выше ${apartmentsSettings[selectTypeAppartment.value].minPrice}`;
  }
  return false;
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
  errorElement.querySelector('.error__message').textContent = message;
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
  const message = checkRoomsAndGuestsAndCoordinate();
  const messageValidatePrice = validatePrice();
  if (message) {
    showErrorMessage(message);
  }
  if (messageValidatePrice) {
    showErrorMessage(messageValidatePrice);
  }
  if (!message && !messageValidatePrice) {
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
