import {FILE_TYPES} from './enum.js';

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


const inputFileFoto = document.querySelector('#images');
const previewFoto = document.querySelector('.ad-form__photo');

inputFileFoto.addEventListener('change', () => {
  const file = inputFileFoto.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewFoto.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
    previewFoto.style.backgroundSize = 'contain';
    previewFoto.style.backgroundRepeat = 'no-repeat';
  }
});
