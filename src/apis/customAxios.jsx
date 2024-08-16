import axios, { HttpStatusCode, isAxiosError } from 'axios';

// 1) axios default 설정
axios.defaults.baseURL = 'http://ec2-3-82-142-19.compute-1.amazonaws.com/api';

//데이터의 형식 지정
axios.defaults.headers.common['Content-Type'] = 'application/json';

// multipart/form-data
axios.defaults.timeout = 5000; //백엔트 서버에 요청하고 응답을 기다리는 시간 5초

// 2) axios instance
export const api = axios.create();
export const api2 = axios.create({ baseURL: 'http://localhost:8000' });

// 3) interceptor
// Client ------[Interceptor]------> Server
api.interceptors.request.use(
    (req) => {
        if (req.data instanceof FormData) {
            req.headers['Content-Type'] = 'multipart/form-data';
        }
        return req;
    },
    (err) => {
        // Network Error | Unknown Error
        if (isAxiosError(err)) {
            //수정, 추가해서 구현

            if (err.status === HttpStatusCode.NotFound) {
                throw new Error('존재하지 않는 API 경로');
            }
            if (err.status === HttpStatusCode.BadGateway) {
            }
        }
    }
);
// Client <------[Interceptor]------ Server
api.interceptors.response.use(
    (res) => {
        // 응답 값을 가공
        return res.data;
    },
    (err) => {
        if (isAxiosError(err)) {
            if (err.status === HttpStatusCode.Unauthorized) {
                throw new Error('인증 오류');
            }
            if (err.status === HttpStatusCode.BadRequest) {
                //
                throw new Error('데이터 형식 오류');
            }
        }
    }
);
