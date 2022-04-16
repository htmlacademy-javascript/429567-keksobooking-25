import {disableForm, enableForm, enableFilter} from './work-form.js';
import {LAT_TOKIO, LNG_TOKIO, MAP_SCALING, PIN_SIZE, ROUNDING_VALUE, AD_PIN_SIZE, MAX_ADS} from './data.js';
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
  address.value = `${coordinates.lat.toFixed(ROUNDING_VALUE)}, ${coordinates.lng.toFixed(ROUNDING_VALUE)}`;
});

const resetMainPinMarker = () => {
  mainPinMarker.setLatLng({
    lat: LAT_TOKIO,
    lng: LNG_TOKIO,
  });
};

const adPin = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [AD_PIN_SIZE, AD_PIN_SIZE],
  iconAnchor: [AD_PIN_SIZE/2, AD_PIN_SIZE],
});

const markerGroup = L.layerGroup().addTo(map);

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
  adPinMarker
    .addTo(markerGroup)
    .bindPopup(generateAds(ad));
};

getData((ads) => {
  ads.slice(0, MAX_ADS).forEach(
    (ad) => {
      createMarkers(ad);
    }
  );
  enableFilter();
});

export {resetMainPinMarker, markerGroup, createMarkers};
