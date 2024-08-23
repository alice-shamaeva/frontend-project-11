const getPath = (url) => {
  const path = new URL('/get', 'https://allorigins.hexlet.app');
  path.searchParams.set('url', url);
  path.searchParams.set('disableCache', 'true');
  return path.toString();
};

export default getPath;
