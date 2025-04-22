const _guardServerSide = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('This function should not be called on the server side');
  }
};

const setItem = <T>(key: string, value: T) => {
  try {
    _guardServerSide();
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

const getItem = <T>(key: string): T | null => {
  try {
    _guardServerSide();
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const removeItem = (key: string) => {
  try {
    _guardServerSide();
    localStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

const LocalStorage = {
  setItem,
  getItem,
  removeItem
};

export default LocalStorage;
