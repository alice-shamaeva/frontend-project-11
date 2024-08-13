const validate = (url, state) => {
  try {
    state.validateSync(url, { abortEarly: false }); // если использовать validate, то это асинхронный метод, поэтому возвращает промис
    return '';
  } catch (e) {
    return e.message; // если форма не валидна, то выводится ошибка, которую можно сохранить в state; например, 'name is a required field at createError'
  }
};

export default validate;
