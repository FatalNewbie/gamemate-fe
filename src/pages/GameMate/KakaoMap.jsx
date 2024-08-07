// KakaoMap.js
import React, { useEffect } from 'react';

const { kakao } = window;

const KakaoMap = ({ post }) => {
    useEffect(() => {
        if (post) {
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(37.546825642558176, 127.06631194553104),
                level: 3,
            };
            const map = new kakao.maps.Map(container, options);

            const setCenter = () => {
                const moveLatLon = new kakao.maps.LatLng(37.546825642558176, 127.06631194553104);
                map.setCenter(moveLatLon);
            };

            const panTo = () => {
                const moveLatLon = new kakao.maps.LatLng(37.546825642558176, 126.858264696762);
                map.panTo(moveLatLon);
            };

            setCenter(); // 초기 위치 설정
        }
    }, [post]); // post가 업데이트 될 때마다 실행

    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default KakaoMap;
