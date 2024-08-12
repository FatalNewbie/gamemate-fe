import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfileImageEdit() {
    const [cookies] = useCookies(['token']);
    const [imageList, setImageList] = useState([]); // S3 이미지 리스트
    const [selectedImageUrl, setSelectedImageUrl] = useState(''); // 선택한 이미지 URL
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태
    const [file, setFile] = useState(null); // PC에서 선택한 파일
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // 파일 상태에 저장
    };

    const handleUploadAndSetProfile = async () => {
        if (!file) {
            alert('이미지를 선택하세요.');
            return;
        }

        try {
            // Step 1: Spring 서버에서 Presigned URL 요청
            const response = await axios.get('/presigned-url', {
                headers: {
                    Authorization: cookies.token,
                },
            });

            const presignedUrl = response.data;

            // Step 2: Presigned URL을 사용하여 이미지 업로드
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            // Step 3: S3에 업로드된 이미지의 URL을 사용자 프로필에 저장
            const uploadedImageUrl = presignedUrl.split('?')[0]; // Presigned URL에서 실제 이미지 URL 추출
            await handleImageSelect(uploadedImageUrl);
        } catch (error) {
            console.error('이미지를 업로드하고 프로필을 설정하는 데 실패했습니다:', error);
            alert('이미지 업로드 실패');
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

            <div>
                <h3>새로운 이미지 업로드</h3>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUploadAndSetProfile}>업로드 및 프로필 설정</button>
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
