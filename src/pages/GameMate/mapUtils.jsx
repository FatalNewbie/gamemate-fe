const { kakao } = window;

export const loadKakaoMap = (keyword, setPlaces, setMap) => {
    const container = document.getElementById('map');
    if (!container || !kakao) return; // null 체크 및 kakao 객체 존재 여부 확인

    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
    };
    const newMap = new kakao.maps.Map(container, options);

    setMap(newMap); // 지도 상태 업데이트

    // Places 객체가 undefined인지 확인
    if (!kakao.maps.services.Places) {
        console.error('Places is undefined. Check if Kakao Map API is loaded properly.');
        return;
    }

    const ps = new kakao.maps.services.Places();

    // 장소 검색
    ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();
            const markers = [];

            for (let i = 0; i < data.length; i++) {
                const place = data[i];
                displayMarker(newMap, place, bounds, markers);
            }

            newMap.setBounds(bounds);
            // map이 null이 아닐 때만 setBounds 호출
            if (newMap) {
                newMap.setBounds(bounds);
                setPlaces(data); // 검색 결과 저장
            }
        } else {
            console.error('장소 검색 실패:', status);
        }
    });
};

export const displayMarker = (map, place, bounds, markers) => {
    if (!markers) {
        console.error('markers 배열이 undefined입니다.');
        return; // markers가 undefined일 경우 함수 종료
    }

    const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
    });

    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    kakao.maps.event.addListener(marker, 'click', function () {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
            infowindow.open(map, marker);
        }
    });

    markers.push(marker);
    bounds.extend(new kakao.maps.LatLng(place.y, place.x));
};

export const handlePlaceClick = (place, setSelectedPlace, setIsPlaceSelected, setField, closeModal) => {
    setSelectedPlace(place.place_name);
    setField('latitude', place.y);
    setField('longitude', place.x);
    setField('mateLocation', place.place_name);
    setIsPlaceSelected(true);
    closeModal();
};
