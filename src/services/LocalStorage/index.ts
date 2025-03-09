const setItem = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(e);
    }
};

const getItem = <T>(key: string): T | null => {
    try {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};

const removeItem = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(e);
    }
}

const LocalStorage = {
    setItem,
    getItem,
    removeItem,
};

export default LocalStorage;