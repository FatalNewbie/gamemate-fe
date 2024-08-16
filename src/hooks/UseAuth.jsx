// src/hooks/UseAuth.js
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const useAuth = () => {
    const [cookies] = useCookies(['token']); // 쿠키에서 'token' 가져오기
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 쿠키에서 토큰이 존재하는지 확인
        setIsLoggedIn(!!cookies.token); // 쿠키에 'token'이 있으면 true
        console.log('로그인 상태:', !!cookies.token); // 쿠키 상태 로그
    }, [cookies.token]);

    return { isLoggedIn };
};
