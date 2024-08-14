import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileImageEdit() {
    const [cookies] = useCookies(['token']);
    const [imageList, setImageList] = useState([]); // S3 이미지 리스트
    const [selectedImageUrl, setSelectedImageUrl] = useState(''); // 선택한 이미지 URL
    const navigate = useNavigate();

    // S3 이미지 리스트 가져오기
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

    // 이미지 선택 및 프로필 업데이트
    const handleImageSelect = async (url) => {
        setSelectedImageUrl(url); // 선택한 이미지 URL 설정

        try {
            // 선택한 이미지 URL을 사용자 프로필에 저장
            const response = await axios.post(
                '/profile/update',
                {
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
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 이미지를 업데이트하는 데 실패했습니다:', error);
            alert('프로필 이미지 업데이트 실패');
        }
    };

    useEffect(() => {
        fetchImageList(); // 컴포넌트가 마운트될 때 이미지 리스트 가져오기
    }, [cookies.token]);

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
