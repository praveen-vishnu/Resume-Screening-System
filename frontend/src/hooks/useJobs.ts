import { useState, useEffect } from 'react';
import { getJobs } from '../services/apiService';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then((data) => setJobs(data));
  }, []);

  return jobs;
};

export default useJobs;
