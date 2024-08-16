import { ConstructionOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const { kakao } = window;

Modal.setAppElement('#root');

const KakaoMapSearch = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [map, setMap] = useState(null); // 지도 상태 추가
    const [selectedPlace, setSelectedPlace] = useState(''); // 선택된 장소 상태 추가

    useEffect(() => {
        // 카카오 맵 API가 이미 로드되었다고 가정
        kakao.maps.load(() => {
            console.log('Kakao Map Loaded');
        });
    }, []);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setKeyword('');
        setPlaces([]); // 모달 닫을 때 검색 결과 초기화
        setMap(null); // 지도 초기화
    };

    const handlePlaceClick = (place) => {
        setSelectedPlace(place.place_name); // 클릭한 장소 이름을 상태에 저장
        closeModal(); // 모달 닫기
    };

    const handleInputChange = (e) => {
        setSelectedPlace(e.target.value); // 입력 필드의 값을 상태에 저장
    };

    useEffect(() => {
        if (modalIsOpen) {
            const timer = setTimeout(() => {
                loadKakaoMap(); // 모달이 열리고 나서 지도를 로드
            }, 100); // 100ms 후에 지도 로드

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [modalIsOpen]);

    const loadKakaoMap = () => {
        const container = document.getElementById('map');
        if (!container || !kakao) return; // null 체크 및 kakao 객체 존재 여부 확인

        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
        };
        const newMap = new kakao.maps.Map(container, options);
        setMap(newMap); // 지도 상태 업데이트

        console.log('newMap' + newMap);

        // Places 객체가 undefined인지 확인
        if (!kakao.maps.services.Places) {
            console.error('Places is undefined. Check if Kakao Map API is loaded properly.');
            return;
        }

        const ps = new kakao.maps.services.Places();

        console.log('검색 실행');

        // 장소 검색
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const bounds = new window.kakao.maps.LatLngBounds();
                const markers = [];

                console.log('검색된 장소 데이터:', data); // 데이터 확인

                for (let i = 0; i < data.length; i++) {
                    const place = data[i];
                    displayMarker(newMap, place, bounds, markers);
                }

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

    const displayMarker = (map, place, bounds, markers) => {
        // place 객체 확인
        console.log('place 객체:', place);

        if (!markers) {
            console.error('markers 배열이 undefined입니다.');
            return; // markers가 undefined일 경우 함수 종료
        }

        const marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x),
        });

        console.log('marker 정보 : ' + marker);

        // 마커 클릭 이벤트 등록
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        kakao.maps.event.addListener(marker, 'click', function () {
            // 이미 열려 있는 경우 닫기
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            }
        });

        console.log('markers' + markers);

        markers.push(marker);
        bounds.extend(new kakao.maps.LatLng(place.y, place.x));
    };

    return (
        <div className="App">
            <button onClick={openModal}>지도 열기</button>
            <input value={selectedPlace} onChange={handleInputChange}></input>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>장소 검색</h2>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요"
                />
                <button onClick={loadKakaoMap}>검색</button>
                <div id="map" style={{ width: '100%', height: '400px' }}></div>
                <h3>검색 결과</h3>
                <ul>
                    {places.map((place) => (
                        <li key={place.id} onClick={() => handlePlaceClick(place)}>
                            {place.place_name}
                        </li>
                    ))}
                </ul>
                <button onClick={closeModal}>닫기</button>
            </Modal>
        </div>
    );
};

export default KakaoMapSearch;
