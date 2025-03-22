const LOCAL_STORAGE_KEY = 'ai_resume_screening';

const localStorageService = {
  setItem: (key: string, value: any) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${key}`, serializedValue);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  },

  getItem: (key: string) => {
    try {
      const serializedValue = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${key}`);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error('Error reading data from localStorage:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_${key}`);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  },
};

export default localStorageService;
