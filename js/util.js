import {ALERT_SHOW_TIME, PLACE_HOLDER, LAT_TOKIO, LNG_TOKIO} from './data.js';
import {resetMainPinMarker} from './map.js';

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
const avatarForm = document.querySelector('#avatar');
const address = document.querySelector('#address');
const typePrice = document.querySelector('#price');
const selectTypeAppartment = document.querySelector('#type');
const roomSelect = form.querySelector('#room_number');
const guestSelect = form.querySelector('#capacity');
const timeIn  = document.querySelector('#timein');
const timeOut = document.querySelector('#timeout');
const avatar = document.querySelector('.ad-form-header__preview > img');
const previewFotos = document.querySelector('.ad-form__photo');

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
  avatar.src = 'img/muffin-grey.svg';
  previewFotos.style.backgroundImage = 'none';
};

export {isEscapeKey, showAlert, resetForm};
