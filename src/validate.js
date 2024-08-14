const validate = (url, state) => {
  try {
    state.validateSync(url, { abortEarly: false });
    return '';
  } catch (e) {
    return e.message;
  }
};

export default validate;
