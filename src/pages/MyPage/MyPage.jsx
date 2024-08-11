import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
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
    const [openEditModal, setOpenEditModal] = useState(false); // 모달 열림 상태
    const [editedUser, setEditedUser] = useState({ nickname: '', userProfile: '' }); // 수정할 사용자 정보
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [posts, setPosts] = useState([]); // 내가 쓴 글 목록 상태 추가
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

        fetchUserPosts(); // 데이터 가져오기
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
                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h5">{user.nickname}</Typography>
                    <Typography variant="body2">@type</Typography>
                </Box>
                {/* 수정 버튼 추가 */}
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={handleOpenEditModal}
                        sx={{ backgroundColor: '#0A088A', color: 'white', '&:hover': { backgroundColor: '#120EE8' } }}
//                         onClick={() => navigate('/edit-profile')} // 버튼 클릭 시 프로필 수정 페이지로 이동
                    >
                        정보 수정
                    </Button>
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
{/*                 내가 쓴 글 목록이 여기에 표시됩니다. */}
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
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        저장
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseEditModal}>
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyPage;
