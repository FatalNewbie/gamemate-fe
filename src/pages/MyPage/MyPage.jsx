import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
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
    const [openEditModal, setOpenEditModal] = useState(false); // 모달 열림 상태
    const [editedUser, setEditedUser] = useState({ nickname: '', userProfile: '' }); // 수정할 사용자 정보
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [posts, setPosts] = useState([]); // 내가 쓴 글 목록 상태 추가
    const [friends, setFriends] = useState([]); // 친구 목록의 일부를 저장할 상태
    const [games, setGames] = useState([]); // 선호 게임 목록을 저장할 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

    useEffect(() => {
        // 쿠키에 토큰이 없으면 로그인 페이지로 이동
        if (!cookies.token) {
            navigate('/auth');
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
                    setEditedUser({
                        nickname: response.data.nickname,
                        password: '' // 비밀번호 초기화
                    });
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

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get('/posts', {
                    headers: {
                        Authorization: cookies.token,
                    },
                    params: { status: 'active', // 또는 필요한 상태 값
                              page: 0, // 첫 페이지
                              size: 10 // 페이지 크기
                    }
                });
                if (response.status === 200) {
                    setPosts(response.data.content); // 데이터 저장 (content는 CustomPage의 데이터)
                }
            } catch (error) {
                console.error('글 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        // 선호 게임 목록 가져오기
        const fetchUserGames = async () => {
            try {
                const response = await axios.get('/games/my-games', {
                    headers: {
                        Authorization: cookies.token,
                    },
                    params: { page: 0, size: 10 } // 페이지네이션 설정
                });
                if (response.status === 200) {
                    setGames(response.data.content); // 게임 목록 저장
                }
            } catch (error) {
                console.error('선호 게임 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserData(); // 데이터 가져오기
        fetchFriendsCount(); // 친구 수 가져오기
        fetchFriendRequests(); // 친구 요청 목록 가져오기
        fetchUserInfo(); // 선호 장르, 플레이 시간대 가져오기
        fetchUserPosts(); // 내가 쓴 글 목록 가져오기
        fetchUserGames(); // 선호 게임 목록 가져오기
    }, [cookies.token, navigate]);

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        if (!editedUser.password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (editedUser.password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.put('/update', {
                ...editedUser,
                password: editedUser.password, // 비밀번호 포함
            }, {
                headers: {
                    Authorization: cookies.token,
                },
            });

            if (response.status === 200) {
                setUser(response.data); // 상태 업데이트
                alert('회원 정보가 수정되었습니다.');
                handleCloseEditModal(); // 모달 닫기
                // 페이지 새로고침을 강제로 처리
                window.location.reload(); // 새로고침 처리
            }
        } catch (error) {
            console.error('회원 정보를 수정하는 데 실패했습니다:', error);
            alert('회원 정보 수정에 실패했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const handleAvatarClick = () => {
        navigate('/edit-profile'); // 프로필 수정 페이지로 이동
    };

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
                    style={{ width: '70px', height: '70px', cursor: 'pointer' }}
                    onClick={handleAvatarClick}
                    onError={(e) => {
                        e.target.onerror = null; // prevents looping
                        e.target.src = 'path/to/default/image.png'; // 대체 이미지 경로
                    }}
                />
                <Box sx={{ marginLeft: 2, width: '140px', height: '65px' }}>
                    <Typography
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 700,
                            fontSize: '14pt',
                            letterSpacing: '-0.10px',
                        }}
                    >
                    {user.nickname}
                    </Typography>
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
                    </Box>
                </Box>
                {/* 수정 버튼 추가 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={handleOpenEditModal}
                        sx={{ backgroundColor: '#0A088A', color: 'white', '&:hover': { backgroundColor: '#5D5AE0' } }}
                    >
                        정보 수정
                    </Button>
                </Box>
            </Box>

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
                <Box sx={{ display: 'column', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                    {friends.length > 0 ? (  // 친구가 있을 경우
                        friends.map((friend, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                <Avatar src={friend.profilePicture || ''} alt={friend.nickname} sx={{ width: 50, height: 50, marginRight: 2 }} />
                                <Typography variant="body1">{friend.nickname}</Typography>
                            </Box>
                        ))
                    ) : (  // 친구가 없을 경우
                        <Typography variant="body1">친구가 없습니다.</Typography>
                    )}

                    {friends.length > 0 && (  // 친구가 있을 때만 버튼 표시
                        <Button onClick={() => navigate('/friends')} sx={{ color: 'rgba(10, 8, 138)' }}>
                            더보기
                        </Button>
                    )}
                </Box>
            </Box>

            {/* 선호 게임 목록 */}
{/*             <Box */}
{/*                 sx={{ */}
{/*                     bgcolor: '#fff', */}
{/*                     paddingTop: 2, */}
{/*                     paddingRight: 2, */}
{/*                     paddingBottom: 0, */}
{/*                     paddingLeft: 2, */}
{/*                     borderRadius: 1, */}
{/*                     minHeight: '100px', */}
{/*                     marginBottom: 2, */}
{/*                     boxShadow: 3, */}
{/*                 }} */}
{/*             > */}
{/*                 <Typography */}
{/*                     variant="h6" */}
{/*                     sx={{ */}
{/*                         fontFamily: 'Roboto, sans-serif', */}
{/*                         fontWeight: 700, */}
{/*                         fontSize: '14pt', */}
{/*                         letterSpacing: '-0.5px', */}
{/*                         marginBottom: '10px', */}
{/*                     }} */}
{/*                     gutterBottom */}
{/*                 > */}
{/*                 선호 게임 목록 */}
{/*                 </Typography> */}

{/*                  */}{/* 선호 게임 목록 공간 */}
{/*                 {games.length > 0 ? ( */}
{/*                     games.map((game, index) => ( */}
{/*                         <Box */}
{/*                             key={index} */}
{/*                             sx={{ */}
{/*                                 display: 'flex', */}
{/*                                 alignItems: 'center', */}
{/*                                 marginBottom: 2, */}
{/*                                 boxShadow: 1, */}
{/*                                 padding: 1, */}
{/*                                 borderRadius: 1, */}
{/*                             }} */}
{/*                         > */}
{/*                             <Avatar src={game.thumbnailUrl} alt={game.title} sx={{ marginRight: 2 }} /> */}
{/*                             <Typography variant="body1">{game.title}</Typography> */}
{/*                         </Box> */}
{/*                     )) */}
{/*                 ) : ( */}
{/*                     <Typography>선호 게임이 없습니다.</Typography> */}
{/*                 )} */}
{/*             </Box> */}
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
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '14pt',
                        letterSpacing: '-0.5px',
                        marginBottom: '10px',
                    }}
                    gutterBottom
                >
                내가 쓴 글 목록
                </Typography>

                {/* 내가 쓴 글 목록 공간 */}
                {posts.length > 0 ? (
                    <Box>
                        {posts.map(post => (
                            <Box key={post.id} sx={{ marginBottom: 1 }}>
                                <Typography variant="body1">{post.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{post.content}</Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography>내가 쓴 글이 없습니다.</Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button>
                        <ArrowDropDownIcon />
                    </Button>
                </Box>
            </Box>

            {/* 사용자 정보 수정 모달 */}
            <Dialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                fullWidth
                PaperProps={{ style: { maxWidth: '370px' } }}
            >
                <DialogTitle>회원정보 수정</DialogTitle>
                <DialogContent>
                    <TextField
                        label="닉네임"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="nickname"
                        value={editedUser.nickname || ''} // 기본 값 설정
                        onChange={handleInputChange} // 입력 변경 시 상태 업데이트
                    />
                    <TextField
                        label="비밀번호"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        name="password"
                        value={editedUser.password || ''} // 기본 값 설정
                        onChange={handleInputChange} // 입력 변경 시 상태 업데이트
                    />
                    <TextField
                        label="비밀번호 확인"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        name="confirmPassword"
                        value={confirmPassword} // confirmPassword 상태 값 설정
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChanges}
                        sx={{ backgroundColor: '#0A088A', color: 'white', '&:hover': { backgroundColor: '#5D5AE0' } }}
                    >
                        저장
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCloseEditModal}
                        sx={{ backgroundColor: '#5D5AE0', color: 'white', '&:hover': { backgroundColor: '#0A088A' } }}
                    >
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyPage;
