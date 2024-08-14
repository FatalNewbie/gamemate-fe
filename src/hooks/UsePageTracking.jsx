import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const usePageTracking = () => {
    const location = useLocation();

    //페이지 이동 시 마다 페이지 뷰 이벤트 전송
    useEffect(() => {
        ReactGA.send({ hitType: 'pageview', page: location.pathname, title: document.title });
    }, [location]);
};

export default usePageTracking;
