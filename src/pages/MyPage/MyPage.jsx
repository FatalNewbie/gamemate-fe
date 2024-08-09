import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소

const MyPage = () => {
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [friendCount, setFriendCount] = useState(0); // 친구 수를 저장할 상태
    const [friendRequests, setFriendRequests] = useState(0); // 친구 요청 수를 저장할 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

    useEffect(() => {
        // 쿠키에 토큰이 없으면 로그인 페이지로 이동
        if (!cookies.token) {
            navigate('/login');
        }
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/mypage', {
                    headers: {
                        Authorization: cookies.token,
                    },
                });

                if (response.status === 200) {
                    setUser(response.data); // 사용자 정보를 상태에 저장
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        const fetchFriendsCount = async () => {
            try {
                const response = await axios.get('/friend/', {
                    headers: {
                        Authorization: cookies.token,
                    },
                });
                setFriendCount(response.data.data.length); // 친구 수 계산
            } catch (error) {
                console.error('친구 수를 가져오는 데 실패했습니다:', error);
            }
        };

        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get('/friend/requests', {
                    // 친구 요청 API 호출
                    headers: {
                        Authorization: cookies.token,
                    },
                });

                if (response.status === 200) {
                    setFriendRequests(response.data.data.length); // 친구 요청 수를 상태에 저장
                }
            } catch (error) {
                console.error('친구 요청 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserData(); // 데이터 가져오기
        fetchFriendsCount(); // 친구 수 가져오기
        fetchFriendRequests(); // 친구 요청 목록 가져오기
    }, [cookies.token]);

    // user 데이터가 로드된 후에만 usePageTime 훅을 호출

    if (!user) {
        return <Typography>로딩 중...</Typography>; // 데이터가 로드되기 전 표시할 내용
    }

    return (
        <Box sx={{ padding: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                {/* 프로필 이미지 공간 */}
                <Avatar
                    src={user.userProfile} // S3 URL
                    alt="User Profile"
                    style={{ width: '70px', height: '70px' }}
                    onError={(e) => {
                        e.target.onerror = null; // prevents looping
                        e.target.src = 'path/to/default/image.png'; // 대체 이미지 경로
                    }}
                />
                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h5">{user.nickname}</Typography>
                    <Typography variant="body2">@type</Typography>
                </Box>
            </Box>

            {/* 수정 버튼 추가 */}
            <Button
                variant="contained"
                onClick={() => navigate('/edit-profile')} // 버튼 클릭 시 프로필 수정 페이지로 이동
            >
                프로필 수정
            </Button>

            {/* 친구 목록 */}
            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 0,
                    paddingLeft: 2,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    친구 목록
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">친구가 {friendCount}명 있습니다.</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button onClick={() => navigate('/friends')}>친구 목록 보기</Button>
                </Box>
            </Box>

            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 0,
                    paddingLeft: 2,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    친구 요청 목록 ({friendRequests}개)
                </Typography>
                {/* 친구 요청 목록 버튼 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button onClick={() => navigate('/friendrequests')}>친구 요청 보기</Button>
                </Box>
            </Box>

            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 0,
                    paddingLeft: 2,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    선호 게임 목록
                </Typography>
                {/* 선호 게임 목록 공간 */}
                선호 게임 목록이 여기에 표시됩니다.
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>

            {/* 내가 쓴 글 목록 */}
            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingRight: 2,
                    paddingBottom: 0,
                    paddingLeft: 2,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    내가 쓴 글 목록
                </Typography>
                {/* 내가 쓴 글 목록 공간 */}
                내가 쓴 글 목록이 여기에 표시됩니다.
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default MyPage;
