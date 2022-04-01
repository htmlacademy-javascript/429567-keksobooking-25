const getRoomsDeclension = (count) => {
  if (count === 1) {
    return 'комната';
  }
  if (count === 2 || count === 3 || count === 4) {
    return 'комнаты';
  }
  return 'комнат';
};

const getGuestsDeclension = (count) => {
  if (count === 1) {
    return 'гостя';
  }
  return 'гостей';
};

export {getRoomsDeclension};
export {getGuestsDeclension};
