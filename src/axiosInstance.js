// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`, // 백엔드 서버 주소
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
