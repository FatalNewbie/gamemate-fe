import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameMateNew.css';
import { api } from '../../apis/customAxios';
import { useCookies } from 'react-cookie';
import { regions } from './regions';
import { loadKakaoMap, displayMarker, handlePlaceClick } from './mapUtils'; // 유틸리티 함수 가져오기
import Modal from 'react-modal';

const { kakao } = window;

Modal.setAppElement('#root');

const GameMateNew = () => {
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();

    const [step, setStep] = useState(0); // 현재 단계 상태

    const [postData, setPostData] = useState({
        status: 'ON', // 기본 상태
        gameTitle: null,
        gameGenre: null,
        mateCnt: 2,
        mateContent: null,
        mateLocation: null,
        latitude: null,
        longitude: null,
        mateRegionSi: null,
        mateRegionGu: null,
    });

    // 상태 업데이트 함수
    const setField = (field, value) => {
        setPostData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleRegionChange = (e) => {
        setField('mateRegionSi', e.target.value);
        setField('mateRegionGu', ''); // 지역 변경 시 이전 구 선택 초기화
    };

    const handleSubAreaChange = (e) => {
        setField('mateRegionGu', e.target.value);
    };

    //카카오 api 사용
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [places, setPlaces] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [isSearchTriggered, setIsSearchTriggered] = useState(false); // 새로운 상태 추가
    const [isPlaceSelected, setIsPlaceSelected] = useState(false); // 새로운 상태 추가
    const [selectedPlaceData, setSelectedPlaceData] = useState(null); // 선택된 장소 데이터 저장

    useEffect(() => {
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
        setPlaces([]);
        setMap(null);
        setIsSearchTriggered(false); // 모달 닫을 때 상태 초기화
        setIsPlaceSelected(false); // 모달 닫을 때 상태 초기화
    };

    const handleInputChange = (e) => {
        setSelectedPlace(e.target.value); // 입력 필드의 값을 상태에 저장
    };

    const handleSearch = () => {
        setIsSearchTriggered(true); // 검색 버튼 클릭 시 상태 업데이트
    };

    useEffect(() => {
        if (modalIsOpen) {
            const timer = setTimeout(() => {
                if (setMap) {
                    // setMap이 정의되어 있는지 확인
                    setIsSearchTriggered(false); // 검색 후 상태 초기화
                    loadKakaoMap(keyword, setPlaces, setMap);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [modalIsOpen, isSearchTriggered]);

    useEffect(() => {
        if (isPlaceSelected && selectedPlaceData) {
            const timer = setTimeout(() => {
                setSelectedPlace(selectedPlaceData.place_name); // 상태 업데이트
                closeModal(); // 모달 닫기
            }, 800); // 시간 텀을 두고 실행

            return () => clearTimeout(timer);
        }
    }, [isPlaceSelected, selectedPlaceData]);

    //데이터를 postData에 담아 전송
    const handleSubmit = async () => {
        const response = await api.post(`/posts`, postData, {
            headers: {
                Authorization: cookies.token,
            },
        });

        // 게시글 ID를 사용하여 상세 페이지로 이동
        navigate(`/gamemate/posts/${response.data.id}`);
    };

    const handleNext = () => {
        // // 각 단계별로 입력값 검사
        // // 각 단계별로 입력값 검사
        // if (step === 1 && !gameTitle.trim()) {
        //     alert('함께할 게임을 입력해주세요.');
        //     return;
        // }
        // if (step === 2 && !gameGenre.trim()) {
        //     alert('게임 유형을 선택해주세요.');
        //     return;
        // }
        // if (step === 3 && !mateCnt) {
        //     alert('모임 인원을 선택해주세요.');
        //     return;
        // }
        // if (
        //     (step === 4 && status === 'ON' && !mateContent.trim()) ||
        //     (step === 5 && status === 'OFF' && !mateContent.trim())
        // ) {
        //     alert('자세한 설명을 작성해주세요.');
        //     return;
        // }

        // 모든 검사를 통과한 경우 다음 단계로 이동
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep((prevStep) => prevStep - 1);
    };

    return (
        <div className="container">
            <div className="post-new-card">
                {step === 0 && (
                    <div className="slide-in">
                        <h2>모임 유형을 선택해주세요</h2>
                        <div className="onoff-choice">
                            <button
                                onClick={() => setField('status', 'ON')}
                                className={`online-new ${postData.status === 'ON' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                            >
                                온라인
                            </button>
                            <button
                                onClick={() => setField('status', 'OFF')}
                                className={`offline-new ${postData.status === 'OFF' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                            >
                                오프라인
                            </button>
                        </div>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}
                {step === 1 && (
                    <div className="slide-in">
                        <h2>함께 할 게임을 알려주세요</h2>
                        <input
                            type="text"
                            placeholder="게임 제목을 입력해주세요."
                            className="game-input"
                            value={postData.gameTitle || ''} // null일 경우 빈 문자열로 처리
                            onChange={(e) => setField('gameTitle', e.target.value)} // 필드 이름을 문자열로 전달
                        />
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}
                {step === 2 && (
                    <div className="slide-in">
                        <h2>어떤 장르의 게임인가요?</h2>
                        <input
                            type="text"
                            placeholder="ex) FPS, 어드벤쳐, 액션, 보드게임, 방탈출"
                            className="genre-input"
                            value={postData.gameGenre || ''}
                            onChange={(e) => setField('gameGenre', e.target.value)}
                        />
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}
                {step === 3 && (
                    <div className="slide-in">
                        <h2>모임 인원을 선택해주세요</h2>
                        <select
                            className="mate-cnt-select"
                            value={postData.mateCnt}
                            onChange={(e) => setField('mateCnt', Number(e.target.value))}
                        >
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}

                {step === 4 && postData.status === 'OFF' && (
                    <div className="slide-in">
                        <h2>원하는 지역을 선택해주세요</h2>

                        <select value={postData.mateRegionSi} onChange={handleRegionChange}>
                            <option value="">시를 선택하세요</option>
                            {regions.map((region) => (
                                <option key={region.name} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={postData.mateRegionGu}
                            onChange={handleSubAreaChange}
                            disabled={!postData.mateRegionSi}
                        >
                            <option value="">구를 선택하세요</option>
                            {postData.mateRegionSi &&
                                regions
                                    .find((r) => r.name === postData.mateRegionSi)
                                    ?.subArea.map((subArea) => (
                                        <option key={subArea} value={subArea}>
                                            {subArea}
                                        </option>
                                    ))}
                        </select>
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}

                {step === 5 && postData.status === 'OFF' && (
                    <div className="slide-in">
                        <h2>자세한 설명을 작성해주세요</h2>
                        <textarea
                            placeholder="게임메이트에게 설명할 내용을 자유롭게 작성해주세요! ex) 방탈출만 끝나고 바로 헤어지실 분들로 구해요"
                            className="description-area"
                            value={postData.mateContent || ''}
                            onChange={(e) => setField('mateContent', e.target.value)}
                        ></textarea>
                        <button onClick={handlePrev}>이전</button>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}

                {step === 4 && postData.status === 'ON' && (
                    <div className="slide-in">
                        <h2>자세한 설명을 작성해주세요</h2>
                        <textarea
                            placeholder="게임메이트에게 설명할 내용을 자유롭게 작성해주세요! ex) 저희는 디스코드 사용이 필수입니다!"
                            className="description-area"
                            value={postData.mateContent || ''}
                            onChange={(e) => setField('mateContent', e.target.value)}
                        ></textarea>
                        <button onClick={handlePrev}>이전</button>
                        <button className="submit-button" onClick={handleSubmit}>
                            등록
                        </button>
                    </div>
                )}

                {step === 6 && postData.status === 'OFF' && (
                    <div className="slide-in">
                        <h2>구체적인 장소가 있다면 알려주세요!</h2>
                        <button onClick={openModal}>지도 열기</button>
                        <input
                            type="text"
                            placeholder="장소 입력"
                            className="search-input"
                            value={selectedPlace}
                            onChange={handleInputChange}
                        ></input>
                        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                            <h2>장소 검색</h2>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                            <button onClick={handleSearch}>검색</button>
                            <div id="map" style={{ width: '100%', height: '400px' }}></div>
                            <h3>검색 결과</h3>
                            <ul>
                                {places.map((place) => (
                                    <li
                                        key={place.id}
                                        onClick={() =>
                                            handlePlaceClick(
                                                place,
                                                setSelectedPlace,
                                                setIsPlaceSelected,
                                                setField,
                                                closeModal
                                            )
                                        }
                                    >
                                        {place.place_name}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={closeModal}>닫기</button>
                        </Modal>

                        <button onClick={handlePrev}>이전</button>
                        <button className="submit-button" onClick={handleSubmit}>
                            등록
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default GameMateNew;
