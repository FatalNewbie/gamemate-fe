import React, { useEffect, useState } from 'react';
import './GameMateNew.css';

const GameMateNew = () => {
    // 더미 데이터
    const [genres, setGenres] = useState(['즐겜러', '사교형', '보드게임']); // 초기 장르 데이터

    return (
        <div className="container">
            <div className="post-card">
                <h2>모임 유형을 선택해주세요</h2>
                <div className="onoff-choice">
                    <button className="online">온라인</button>
                    <button className="offline">오프라인</button>
                </div>

                <h3>함께 할 게임을 선택해주세요</h3>
                <input type="text" placeholder="찾는 게임이 없다면 직접 입력해도 좋아요!" className="search-input" />

                <h3>어떤 장르의 게임인가요?</h3>
                <select className="genre-select">
                    <option>FPS</option>
                    <option>어드벤처</option>
                    <option>액션</option>
                    <option>보드게임</option>
                    <option>방탈출</option>
                </select>

                <h3>모임 인원을 선택해주세요</h3>
                <select className="people-select">
                    <option>명</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>

                <h3>원하는 지역을 선택해주세요</h3>
                <select className="region-select">
                    <option>시</option>
                    <option>서울</option>
                    <option>부산</option>
                    <option>대구</option>
                    <option>광주</option>
                </select>
                <select className="region-select">
                    <option>구</option>
                    <option>강남구</option>
                    <option>서초구</option>
                    <option>영등포구</option>
                    <option>관악구</option>
                </select>

                <h3>자세한 설명을 작성해주세요</h3>
                <textarea
                    placeholder="게임메이트에게 설명할 내용을 자유롭게 작성해주세요! ex) 저희는 디스코드 사용이 필수입니다!"
                    className="description-textarea"
                ></textarea>

                <h3>구체적인 장소가 있다면 입력해주세요</h3>
                <input type="text" placeholder="장소 입력" className="search-input" />

                <button className="submit-button">등록</button>
            </div>
        </div>
    );
};
export default GameMateNew;
