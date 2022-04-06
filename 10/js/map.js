import {disableForm, enableForm} from './work-form.js';
import {LAT_TOKIO, LNG_TOKIO, MAP_SCALING, PIN_SIZE, ROUDING_VALUE, AD_PIN_SIZE, MAX_ADS} from './data.js';
import {getData} from './server.js';
import {generateAds} from './generate-ads.js';


const address = document.querySelector('#address');
disableForm();

const map = L.map('map-canvas')
  .on('load', enableForm)
  .setView({
    lat: LAT_TOKIO,
    lng: LNG_TOKIO,
  }, MAP_SCALING);


L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [PIN_SIZE, PIN_SIZE],
  iconAnchor: [PIN_SIZE/2, PIN_SIZE],
});

const mainPinMarker = L.marker(
  {
    lat: LAT_TOKIO,
    lng: LNG_TOKIO,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);

mainPinMarker.on('moveend', (evt) => {
  const coordinates = evt.target.getLatLng();
  address.value = `${coordinates.lat.toFixed(ROUDING_VALUE)}, ${coordinates.lng.toFixed(ROUDING_VALUE)}`;
});

const adPin = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [AD_PIN_SIZE, AD_PIN_SIZE],
  iconAnchor: [AD_PIN_SIZE/2, AD_PIN_SIZE],
});

const createMarkers = (ad) => {
  const adPinMarker = L.marker(
    {
      lat: ad.location.lat,
      lng: ad.location.lng,
    },
    {
      icon: adPin,
    },
  );
  adPinMarker.addTo(map).bindPopup(generateAds(ad));
};

getData((ads) => {
  ads.slice(0, MAX_ADS).forEach(
    (ad) => {
      createMarkers(ad);
    }
  );
});

