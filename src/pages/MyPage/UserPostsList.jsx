import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const UserPostsList = () => {
    const [posts, setPosts] = useState([]);
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [editedUser, setEditedUser] = useState({ nickname: '', userProfile: '' }); // 수정할 사용자 정보
    const navigate = useNavigate();

    useEffect(() => {

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

                    fetchUserPosts(response.data.id); // 사용자 ID를 인자로 전달하여 사용자가 작성한 글 목록을 가져옴
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        const fetchUserPosts = async (userId) => {
            try {
                const response = await axios.get(`/posts/user`, {
                    headers: {
                        Authorization: cookies.token,
                    },
                    params: {
                        userId,
                        page: 0,
                        size: 10,
                    },
                });
                console.log("fetchUserPosts : " + response.data); // 응답 데이터 구조 확인
                if (response.status === 200 && response.data.data.content) {
                    setPosts(response.data.data.content);
                    console.log("PostsDataContent : " + response.data.data.content);
                }
            } catch (error) {
                console.error('글 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserData(); // 데이터 가져오기
    }, [cookies.token, navigate]);

    const handlePostClick = (id) => {
        navigate(`/gamemate/posts/${id}`);
    };

    return (
        <Box>
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                    marginBottom: 2,
                    backgroundColor: 'rgba(10, 8, 138, 0.8)',
                    '&:hover': {
                        backgroundColor: 'rgba(93, 90, 224, 0.8)',
                    },
                    color: '#fff',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
            >
                뒤로 가기
            </Button>
            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingBottom: 0,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingLeft: 2,
                        paddingBottom: 1,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '14pt',
                        letterSpacing: '-0.5px',
                        borderBottom: '1px solid #e0e0e0'
                    }}
                >
                내가 쓴 글 목록
                </Typography>
                {posts.length > 0 ? (
                    <List>
                            {posts.map((post, index) => (
                                <ListItem key={index} sx={{ padding: 1 }}>
                                    <Box
                                        sx={{
                                                display: 'flex',
                                                bgcolor: '#fff',
                                                paddingTop: 1,
                                                paddingRight: 2,
                                                paddingLeft: 2,
                                                borderRadius: 1,
                                                minHeight: 50,
                                                width: "100%",
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #e0e0e0',
                                                justifyContent: 'space-between', // 제목과 날짜 사이에 공간을 벌림
                                            }}
                                        onClick={() => handlePostClick(post.id)}
                                    >
                                        <Typography variant="h6">{post.gameTitle}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(post.createdDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}

                    </List>
                ) : (
                    <Typography>게시글이 없습니다.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default UserPostsList;
