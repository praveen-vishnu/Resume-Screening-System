import { useState, useEffect } from 'react';
import { getResumes } from '../services/apiService';

const useResumes = () => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    getResumes().then((data) => setResumes(data));
  }, []);

  return resumes;
};

export default useResumes;
