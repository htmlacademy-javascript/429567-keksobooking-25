import {createAd} from './create-ad.js';
import {MAX_ADS} from './data.js';
import {apartmentsSettings} from './enum.js';
import {getRoomsDeclension, getGuestsDeclension} from './get-declension.js';

createAd(MAX_ADS);

const adsTemplate = document.querySelector('#card').content.querySelector('.popup');

const generateAds = (ad) => {
  const adsElement = adsTemplate.cloneNode(true);
  adsElement.querySelector('.popup__title').textContent = ad.offer.title;
  adsElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adsElement.querySelector('.popup__text--price').textContent = `${ad.offer.price} ₽/ночь`;

  const popupFeaturesList = adsElement.querySelectorAll('.popup__feature');
  if (ad.offer.features.length > 0) {
    popupFeaturesList.forEach(
      (popupFeaturesItem) => {
        const isNecessary = ad.offer.features.some(
          (userFeature) => popupFeaturesItem.classList.contains(`popup__feature--${userFeature}`),
        );

        if (!isNecessary) {
          popupFeaturesItem.remove();
        }
      }
    );
  }
  else { // Не стал добавлять для родителя, малоли поедет верстка
    popupFeaturesList.forEach(
      (popupFeaturesItem) => {
        popupFeaturesItem.classList.add('hide');
      }
    );
  }
  if (ad.offer.type.length > 0) {
    adsElement.querySelector('.popup__type').textContent = apartmentsSettings[ad.offer.type.toLowerCase()].name;
  }
  else {
    adsElement.querySelector('.popup__type').classList.add('hide');
  }
  if (ad.offer.rooms === 0 || ad.offer.rooms === '' || ad.offer.guests === 0 || ad.offer.guests === '') {
    adsElement.querySelector('.popup__text--capacity').classList.add('hide');
  }
  else {
    adsElement.querySelector('.popup__text--capacity').textContent = `${ad.offer.rooms} ${getRoomsDeclension(ad.offer.rooms)} для ${ad.offer.rooms} ${getGuestsDeclension(ad.offer.rooms)}`;
  }

  if (ad.offer.checkin === '' || ad.offer.checkout === '') {
    adsElement.querySelector('.popup__text--time').classList.add('hide');
  }
  else {
    adsElement.querySelector('.popup__text--time').textContent = `Заезд после ${ad.offer.checkin} , выезд до ${ad.offer.checkout}`;
  }
  if (ad.offer.description === '') {
    adsElement.querySelector('.popup__description').classList.add('hide');
  }
  else {
    adsElement.querySelector('.popup__description').textContent = ad.offer.description;
  }

  const imgListElement = adsElement.querySelector('.popup__photos');
  if (ad.offer.type.length > 0) {
    const imgItemFragmet = document.createDocumentFragment();
    ad.offer.photos.forEach((imgElementSrc) => {
      const imgListItem = document.createElement('img');
      imgListItem.classList.add('popup__photo');
      imgListItem.width = 45;
      imgListItem.height = 40;
      imgListItem.alt = 'Фотография жилья';
      imgListItem.src = imgElementSrc;
      imgItemFragmet.append(imgListItem);
    });
    imgListElement.innerHTML = '';
    imgListElement.append(imgItemFragmet);
  }
  else {
    imgListElement.classList.add('hide');
  }
  return adsElement;
};

export {generateAds};
