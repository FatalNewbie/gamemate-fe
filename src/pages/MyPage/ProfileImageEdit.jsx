import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import usePageTime from '../../hooks/usePageTime';

function ProfileImageEdit() {
    const [cookies] = useCookies(['token']);
    const [imageList, setImageList] = useState([]); // S3 이미지 리스트
    const [selectedImageUrl, setSelectedImageUrl] = useState(''); // 선택한 이미지 URL
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
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

        try {
            // 선택한 이미지 URL을 사용자 프로필에 저장
            const response = await axios.post(
                '/profile/update',
                {
                    username: user.username,
                    userProfile: url,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            if (response.status === 200) {
                alert('프로필 이미지가 업데이트되었습니다.');
            }
        } catch (error) {
            console.error('프로필 이미지를 업데이트하는 데 실패했습니다:', error);
            alert('프로필 이미지 업데이트 실패');
        }
    };

    return (
        <div>
            <h2>S3 이미지 선택 및 프로필 업데이트</h2>

            <div>
                {imageList.length > 0 ? (
                    imageList.map((imageUrl, index) => (
                        <div
                            key={index}
                            onClick={() => handleImageSelect(imageUrl)}
                            style={{ cursor: 'pointer', margin: '10px' }}
                        >
                            <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                style={{ width: 100, height: 100, borderRadius: '8px' }}
                            />
                        </div>
                    ))
                ) : (
                    <p>이미지를 불러오는 중입니다...</p>
                )}
            </div>
            {selectedImageUrl && (
                <div>
                    <h3>선택한 이미지:</h3>
                    <img
                        src={selectedImageUrl}
                        alt="Selected"
                        style={{ width: 150, height: 150, borderRadius: '50%' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ProfileImageEdit;
