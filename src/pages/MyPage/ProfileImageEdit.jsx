import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

function ProfileImageEdit() {
    const [cookies] = useCookies(['token']);
    const [imageList, setImageList] = useState([]); // S3 이미지 리스트
    const [selectedImageUrl, setSelectedImageUrl] = useState(''); // 선택한 이미지 URL
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [open, setOpen] = useState(false); // 모달 열기 상태
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
                } else {
                    navigate('/login'); // 로그인 페이지로 리다이렉트
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
                navigate('/login'); // 로그인 페이지로 리다이렉트
            }
        };

        fetchUserData(); // 데이터 가져오기
    }, [cookies.token, navigate]);

    useEffect(() => {
        const fetchImageList = async () => {
            try {
                const response = await axios.get('/s3/images', {
                    headers: {
                        Authorization: cookies.token,
                    },
                });
                setImageList(response.data); // S3 이미지 리스트 저장
            } catch (error) {
                console.error('이미지 리스트를 가져오는 데 실패했습니다:', error);
            }
        };

        if (user) {
            fetchImageList(); // 사용자 정보가 있을 때만 S3 이미지 리스트 가져오기
        }
    }, [user, cookies.token]);

    const handleImageSelect = async (url) => {
        setSelectedImageUrl(url); // 선택한 이미지 URL 설정
        setOpen(true); // 모달 열기
    };

    const handleClose = () => {
        setOpen(false); // 모달 닫기
    };

    const handleImageUpdate = async () => {
        try {
            // 선택한 이미지 URL을 사용자 프로필에 저장
            const response = await axios.post(
                '/profile/update',
                {
                    username: user.username,
                    userProfile: selectedImageUrl,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            if (response.status === 200) {
                alert('프로필 이미지가 업데이트되었습니다.');
                navigate('/mypage'); // mypage로 이동
            }
        } catch (error) {
            console.error('프로필 이미지를 업데이트하는 데 실패했습니다:', error);
            alert('프로필 이미지 업데이트 실패');
        }
        setOpen(false); // 모달 닫기
    };

    return (
        <div>
            <h2>프로필 바꾸기</h2>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    gap: '10px',
                }}
            >
                {imageList.length > 0 ? (
                    imageList.map((imageUrl, index) => (
                        <Box
                            key={index}
                            onClick={() => handleImageSelect(imageUrl)}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                style={{
                                    width: '100px',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    border: '1px solid #D3D3D3',
                                }}
                            />
                        </Box>
                    ))
                ) : (
                    <p>이미지를 불러오는 중입니다...</p>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        paddingLeft: 2,
                        paddingBottom: 1,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '20pt',
                        textAlign: 'center',
                        letterSpacing: '-0.5px',
                    }}
                >
                    선택한 이미지
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                    }}
                >
                    <img
                        src={selectedImageUrl}
                        alt="Selected"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '50%',
                        }}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        onClick={handleImageUpdate}
                        color="primary"
                        variant="contained"
                        sx={{
                            backgroundColor: 'rgba(10, 8, 138, 0.8)',
                            color: '#fff',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'rgba(93, 90, 224, 0.8)',
                            },
                        }}
                    >
                        설정
                    </Button>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                        sx={{
                            backgroundColor: '#DB5024',
                            color: '#fff',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#FF6347',
                            },
                        }}
                    >
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProfileImageEdit;
