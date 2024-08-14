import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserPosts = ({ userId, cookies }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState(3); // 처음에는 3개의 게시물만 표시

    const handlePostClick = (postId) => {
        navigate(`/gamemate/posts/${postId}`);
    };

    const handleShowMore = () => {
        navigate('/userpostlist');
    };

    if (posts.length === 0) {
        return (
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    게시물 목록
                </Typography>
                <Typography>게시물이 없습니다.</Typography>
            </Box>
        );
    }

    return (
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                게시물 목록
            </Typography>
            <List>
                {posts.slice(0, visiblePosts).map((post, index) => (
                    <ListItem
                        key={`post-item-${index}`}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // 중앙 정렬
                            padding: 2,
                            marginBottom: 4,
                            borderBottom: '1px solid #e0e0e0',
                            wordWrap: 'break-word',
                            width: '100%',
                            cursor: 'pointer',
                        }}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center', // 텍스트 중앙 정렬
                                fontSize: '0.8rem',
                            }}
                        >
                            {post.title}
                        </Typography>
                        <Typography
                            sx={{
                                marginTop: 1,
                                textAlign: 'center',
                                fontSize: '0.7rem',
                                color: '#757575',
                            }}
                        >
                            {post.content.slice(0, 50)}...  {/* 게시물 내용의 앞부분만 표시 */}
                        </Typography>
                    </ListItem>
                ))}
            </List>
            {posts.length > 3 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={handleShowMore} sx={{ color: 'rgba(10, 8, 138)' }}>
                        더보기
                    </Button>
                </div>
            )}
        </Box>
    );
};

export default UserPosts;
