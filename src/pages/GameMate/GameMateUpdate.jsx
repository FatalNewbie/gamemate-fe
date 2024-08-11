import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // useNavigate 추가
import '../GameMate/GameMatePost.css';
import KakaoMap from './KakaoMap';
import { api } from '../../apis/customAxios';
import { regions } from './regions';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import DateDisplay from '../../components/DateDisplay';

const { kakao } = window;

const GameMatePost = () => {
    const [cookies] = useCookies(['token']);

    const { username } = jwtDecode(cookies.token);

    const { id } = useParams();

    const location = useLocation();
    const { post } = location.state;

    const [updatedPostData, setUpdatedPostDate] = useState({
        status: post.status, // 기본 상태
        mateCnt: post.mateCnt,
        mateContent: post.mateContent,
        mateLocation: post.mateLocation,
        latitude: post.latitude,
        longitude: post.longitude,
        mateRegionSi: post.mateRegionSi,
        mateRegionGu: post.mateRegionGu,
    });

    // 상태 업데이트 함수
    const setField = (field, value) => {
        setUpdatedPostDate((prevData) => ({
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

    if (!post) {
        return <div>로딩 중...</div>; // post가 없을 때 로딩 메시지 출력
    }

    return (
        <div className="gamemate-post-container">
            <div className="post-card">
                <h2 className="game-title">{post.gameTitle}</h2>
                <div className="profile-box">
                    <div className="user-profile">
                        <div className="left-section">
                            <img src="" alt="글쓰기" className="write-icon" />
                            <span className="writer-nickname">{post.nickname}</span>
                        </div>
                        <DateDisplay dateString={post.createdDate} />
                    </div>
                </div>
                {/* 2행 2열로 배치할 부분 */}
                <div className="status-grid">
                    <div className="status-item">
                        <span className="status-label">온/오프</span>
                        <span className="status-icon">{post.status}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">모집 인원</span>
                        <span className="status-icon">{post.mateCnt}명</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">장르</span>
                        <span className="status-icon">{post.gameGenre}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">지역</span>
                        {post.status === 'ON' && <span className="status-icon">온라인</span>}
                        {/* 조건부 렌더링으로 지역 선택 UI 추가 */}
                        {post.status === 'OFF' && (
                            <div>
                                <select value={updatedPostData.mateRegionSi} onChange={handleRegionChange}>
                                    <option value="">시를 선택하세요</option>
                                    {regions.map((region) => (
                                        <option key={region.name} value={region.name}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={updatedPostData.mateRegionGu}
                                    onChange={handleSubAreaChange}
                                    disabled={!post.mateRegionSi}
                                >
                                    <option value="">구를 선택하세요</option>
                                    {updatedPostData.mateRegionSi &&
                                        regions
                                            .find((r) => r.name === updatedPostData.mateRegionSi)
                                            ?.subArea.map((subArea) => (
                                                <option key={subArea} value={subArea}>
                                                    {subArea}
                                                </option>
                                            ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <p className="post-content">
                    <textarea value={post.mateContent} onChange={(e) => setField('mateContent', e.target.value)} />
                </p>
                <div>
                    {post.mateLocation && (
                        <>
                            <h3>위치</h3>
                            <div>{post.mateLocation}</div>
                            <div className="map-placeholder">
                                <KakaoMap post={post} /> {/* KakaoMap 컴포넌트 사용 */}
                            </div>
                        </>
                    )}
                </div>
                <>
                    {username === post.username && (
                        <div className="post-edit-box">
                            <button className="post-edit-button">등록</button>
                        </div>
                    )}
                </>
            </div>
        </div>
    );
};

export default GameMatePost;
