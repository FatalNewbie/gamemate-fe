import React, { useEffect, useState } from 'react';
import './GameMateNew.css';

const GameMateNew = () => {
    const [status, setStatus] = useState('on'); // 기본 상태를 'on'으로 설정

    const [step, setStep] = useState(0); // 현재 단계 상태
    const [game, setGame] = useState('');
    const [genre, setGenre] = useState('');
    const [mateCount, setMateCount] = useState(2);
    const [regionSi, setRegionSi] = useState('');
    const [regionGu, setRegionGu] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrev = () => {
        setStep((prevStep) => prevStep - 1);
    };

    // 더미 데이터
    const [genres, setGenres] = useState(['즐겜러', '사교형', '보드게임']); // 초기 장르 데이터

    return (
        <div className="container">
            <div className="post-new-card">
                {step === 0 && (
                    <div>
                        <h2>모임 유형을 선택해주세요</h2>
                        <div className="onoff-choice">
                            <button
                                onClick={() => setStatus('on')}
                                className={`online-new ${status === 'on' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                            >
                                온라인
                            </button>
                            <button
                                onClick={() => setStatus('off')}
                                className={`offline-new ${status === 'off' ? 'active' : ''}`} // 활성화된 상태에 따라 클래스 추가
                            >
                                오프라인
                            </button>
                        </div>
                        <button onClick={handleNext}>다음</button>
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <h3>함께 할 게임을 선택해주세요</h3>
                        <input
                            type="text"
                            placeholder="찾는 게임이 없다면 직접 입력해도 좋아요!"
                            className="game-input"
                        />
                        <button onClick={handleNext}>다음</button>
                        <button onClick={handlePrev}>이전</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h3>어떤 장르의 게임인가요?</h3>
                        <input
                            type="text"
                            placeholder="ex) FPS, 어드벤쳐, 액션, 보드게임, 방탈출"
                            className="genre-input"
                        />
                        <button onClick={handleNext}>다음</button>
                        <button onClick={handlePrev}>이전</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3>모임 인원을 선택해주세요</h3>
                        <select className="mate-cnt-select">
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                        <button onClick={handleNext}>다음</button>
                        <button onClick={handlePrev}>이전</button>
                    </div>
                )}

                {step === 4 && status === 'off' && (
                    <div>
                        <h3>원하는 지역을 선택해주세요</h3>
                        <select className="region-si-select">
                            <option>시</option>
                            <option>서울</option>
                            <option>부산</option>
                            <option>대구</option>
                            <option>광주</option>
                        </select>
                        <select className="region-gu-select">
                            <option>구</option>
                            <option>강남구</option>
                            <option>서초구</option>
                            <option>영등포구</option>
                            <option>관악구</option>
                        </select>
                        <button onClick={handleNext}>다음</button>
                        <button onClick={handlePrev}>이전</button>
                    </div>
                )}

                {step === 5 && status === 'off' && (
                    <div>
                        <h3>자세한 설명을 작성해주세요</h3>
                        <textarea
                            placeholder="게임메이트에게 설명할 내용을 자유롭게 작성해주세요! ex) 방탈출만 끝나고 바로 헤어지실 분들로 구해요"
                            className="description-area"
                        ></textarea>
                        <button onClick={handleNext}>다음</button>
                        <button onClick={handlePrev}>이전</button>
                    </div>
                )}

                {step === 4 && status === 'on' && (
                    <div>
                        <h3>자세한 설명을 작성해주세요</h3>
                        <textarea
                            placeholder="게임메이트에게 설명할 내용을 자유롭게 작성해주세요! ex) 저희는 디스코드 사용이 필수입니다!"
                            className="description-area"
                        ></textarea>
                        <button className="submit-button">등록</button>
                    </div>
                )}

                {step === 6 && status === 'off' && (
                    <div>
                        <h3>구체적인 장소가 있다면 입력해주세요!</h3>
                        <input type="text" placeholder="장소 입력" className="search-input" />
                        <button className="submit-button">등록</button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default GameMateNew;
