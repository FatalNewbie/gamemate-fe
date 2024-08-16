import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // jwt-decode 라이브러리 임포트
import { api } from '../apis/customAxios';

//cleanupfuction...

const usePageTime = () => {
    const [userName, setUserName] = useState('');
    const accessTime = new Date();
    const location = useLocation();

    useEffect(() => {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // JWT 디코딩
                setUserName(decodedToken.username); // username을 상태에 저장
            } catch (error) {
                console.error('JWT 디코딩 실패:', error);
            }
        }
    }, []); // 처음 한 번만 실행

    useEffect(() => {
        if (userName) {
            const leaveTime = new Date();
            const accessLog = {
                userName,
                endpoint: location.pathname,
                accessTime: accessTime.toISOString(),
                leaveTime: leaveTime.toISOString(),
            };

            console.log('Leave Log:', accessLog);

            // 로그 기록 API 호출
            api.post('/access', accessLog)
                .then((response) => console.log('POST 성공:', response.data))
                .catch((error) =>
                    console.error('로그 기록 실패:', error.response ? error.response.data : error.message)
                );
        }
    }, [location.pathname, userName]); // 경로가 변경되거나 userName이 변경될 때 로그 기록

    return userName; // userName을 반환
};

export default usePageTime;
