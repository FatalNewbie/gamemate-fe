// KakaoMap.js
import React, { useEffect } from 'react';

const { kakao } = window;

const KakaoMap = ({ post }) => {
    useEffect(() => {
        if (post) {
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(post.latitude, post.longitude),
                level: 3,
            };
            const map = new kakao.maps.Map(container, options);

            const setCenter = () => {
                const moveLatLon = new kakao.maps.LatLng(post.latitude, post.longitude);
                map.setCenter(moveLatLon);
            };

            const panTo = () => {
                const moveLatLon = new kakao.maps.LatLng(post.latitude, post.longitude);
                map.panTo(moveLatLon);
            };

            // 마커가 표시될 위치입니다
            var markerPosition = new kakao.maps.LatLng(post.latitude, post.longitude);

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: markerPosition,
            });

            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);

            setCenter(); // 초기 위치 설정
        }
    }, [post]); // post가 업데이트 될 때마다 실행

    return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default KakaoMap;
