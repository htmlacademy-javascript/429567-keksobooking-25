//Функция возвращает рандомное целое число из диапазона включительно

function getRandomInt(min, max) {
  if (min < 0 || max < 0) {
    throw new Error('negative value');
  }
  if (min > max) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция возвращает рандомное число с запятое из диапазона включительно. передается точность после запятой
function getRandomFloat (min, max, accuracy) {
  if (min < 0 || max <0) {
    throw new Error('negative float value');
  }
  if (min > max) {
    [min, max] = [max, min];
  }
  return getRandomInt (Math.floor(min * Math.pow(10,accuracy)), Math.floor(max * Math.pow(10, accuracy))) / Math.pow(10, accuracy);
}

//взята с https://learn.javascript.ru/task/shuffle
function shuffle(arrayInput) {
  const maxElementArray = getRandomInt(1, arrayInput.length - 1);
  const array = arrayInput.slice(); //копия массива
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

    // поменять элементы местами
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(maxElementArray); // обрезаю массив
}

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomInt, getRandomFloat, shuffle, isEscapeKey};
