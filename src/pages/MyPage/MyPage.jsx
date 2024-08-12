import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Chip, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080'; // 백엔드 서버 주소

const MyPage = () => {
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [friendCount, setFriendCount] = useState(0); // 친구 수를 저장할 상태
    const [friendRequests, setFriendRequests] = useState(0); // 친구 요청 수를 저장할 상태
    const [friends, setFriends] = useState([]); // 친구 목록의 일부를 저장할 상태
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
                const friendsData = response.data.data;
                setFriendCount(response.data.data.length); // 친구 수 계산
                setFriends(friendsData.slice(0, 3)); // 친구 목록 중 3명만 보여주기
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

            } catch (error) {
                console.error('친구 요청 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        const fetchUserInfo = async () => {
            try {
                const token = cookies.token;
                const genresList = ['FPS', 'RPG', '전략', '액션', '시뮬레이션'];
                const timesList = ['AM 9:00 ~ AM 11:00', 'AM 11:00 ~ PM 2:00', 'PM 2:00 ~ PM 5:00', 'PM 5:00 ~ PM 8:00',
                      'PM 8:00 ~ PM 11:00', 'PM 11:00 ~ AM 3:00', 'AM 3:00 ~ AM 9:00'];

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('/info', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                if (response.status === 200) {
                    const userFeatures = response.data.data;
                    const preferredGenres = userFeatures.preferredGenres.map(id => genresList[id - 1]);
                    const playTimes = userFeatures.playTimes.map(id => timesList[id - 1]);

                    setUser(prevUser => ({
                        ...prevUser,
                        preferredGenres,
                        playTimes,
                    }));
                }
            } catch (error) {
                console.error('선호 장르 및 플레이 시간대 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserData(); // 데이터 가져오기
        fetchFriendsCount(); // 친구 수 가져오기
        fetchFriendRequests(); // 친구 요청 목록 가져오기
        fetchUserInfo(); // 선호 장르, 플레이 시간대 가져오기
    }, [cookies.token, navigate]);

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
                    {/* 선호 장르 및 플레이 시간대 태그 표시 */}
                    <Box sx={{ marginTop: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                            {user.preferredGenres?.map((genre, index) => (
                                <Chip key={index} 
                                label={genre} 
                                size="small" 
                                sx = {{fontSize: '8px',
                                    backgroundColor: 'rgba(10, 8, 138, 0.8)',
                                    color: 'white'
                                }}/>
                            ))}
                        </Box>
                        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                            {user.playTimes?.map((time, index) => (
                                <Chip key={index} 
                                label={time} 
                                size="small" 
                                sx = {{fontSize: '8px',
                                    backgroundColor: 'rgba(93, 90, 224, 0.8)',
                                    color: 'white'
                                }}/>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* 수정 버튼 추가 */}
            <Button
                variant="contained"
                onClick={() => navigate('/edit-profile')} // 버튼 클릭 시 프로필 수정 페이지로 이동
            >
                프로필 수정
            </Button>

            <Box
                sx={{
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    minHeight: '100px',
                    marginBottom: 2,
                }}
            >
                {/* 친구 요청 목록 버튼 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
                    <IconButton onClick={() => navigate('/received-friendrequests')}>
                        <PersonAddIcon />
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>받은 친구 요청</Typography>
                    </IconButton>
                    <IconButton onClick={() => navigate('/sent-friendrequests')}>
                        <PersonAddIcon />
                        <Typography variant="body2" sx={{ marginLeft: 1 }}>보낸 친구 요청</Typography>
                    </IconButton>
                </Box>
            </Box>

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
                    marginTop: 2,
                    boxShadow: 3,
                }}
            >
                <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 700,
                            fontSize: '14pt',
                            letterSpacing: '-0.5px',
                            marginBottom: '10px',
                        }}
                    >
                    친구 목록
                </Typography>
                <Box sx={{ display: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2}}>
                    {friends.map((friend, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                            <Avatar src={friend.profilePicture || ''} alt={friend.nickname} sx={{ width: 50, height: 50, marginRight: 2 }} />
                            <Typography variant="body1">{friend.nickname}</Typography>
                        </Box>
                    ))}
                
                    <Button onClick={() => navigate('/friends')} endIcon={<ArrowForwardIosIcon />} sx = {{
                        color: 'rgba(10, 8, 138)'
                    }}>
                        더보기
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
