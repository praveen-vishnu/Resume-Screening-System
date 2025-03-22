import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

export const createJob = async (jobData: any) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

export const getResumes = async () => {
  const response = await axios.get(`${API_URL}/resumes`);
  return response.data;
};

export const uploadResume = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/resumes/upload`, formData);
  return response.data;
};
