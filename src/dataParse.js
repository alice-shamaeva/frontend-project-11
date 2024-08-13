const dataParse = (responseData) => {
  const parser = new DOMParser();
  return parser.parseFromString(responseData, 'text/xml');
};

export default dataParse;

