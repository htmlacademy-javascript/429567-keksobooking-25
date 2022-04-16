import {FILE_TYPES} from './limits.js';

const inputFileAvatar = document.querySelector('#avatar');
const previewAvatar = document.querySelector('.ad-form-header__preview > img');

inputFileAvatar.addEventListener('change', () => {
  const file = inputFileAvatar.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewAvatar.src = URL.createObjectURL(file);
  }
});


const inputFilePhoto = document.querySelector('#images');
const previewPhoto = document.querySelector('.ad-form__photo');

inputFilePhoto.addEventListener('change', () => {
  const file = inputFilePhoto.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewPhoto.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    previewPhoto.style.backgroundSize = 'contain';
    previewPhoto.style.backgroundRepeat = 'no-repeat';
  }
});
