import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Join = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(true); // 회원가입 상태

    const handleStartRegister = () => {
        setIsRegistering(false); // 회원가입 상태를 false로 변경
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/join', {
                username,
                password,
                nickname
            });

            if (response.status === 200) {
                // 회원가입 성공 시 로그인 페이지로 이동
                navigate('/login');
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            if (error.response) {
                const errorData = error.response.data;
                if (errorData.success === false) {
                    if (errorData.username) {
                        alert(errorData.username); // 이메일 중복 에러
                    }
                    if (errorData.errors) {
                        if (errorData.errors.password) {
                            alert(errorData.errors.password);
                        }
                    }
                }
            } else {
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            {isRegistering ? (
                <Box sx={{
                    marginTop: 5,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 2,
                    paddingLeft: 2,
                    boxShadow: 3
                }}>
                    <Typography variant="h4" align="center">회원가입</Typography>
                    <Typography variant="body2" align="center">
                        이미 계정이 있으신가요? <Button onClick={() => navigate('/login')}>로그인</Button>
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        label="이메일 입력"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="비밀번호 입력"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="비밀번호 확인"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <TextField
                        label="닉네임 입력"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ marginTop: '16px' }}>
                        가입하기
                    </Button>
                </Box>
            ) : (
                <Box sx={{ paddingTop: 20 }}>
                    <Button variant="outlined" fullWidth onClick={() => handleStartRegister('Google')} style={{ marginTop: '10px' }}>
                        Google 계정으로 시작하기
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => handleStartRegister('Naver')} style={{ marginTop: '10px' }}>
                        Naver 계정으로 시작하기
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => handleStartRegister('이메일')} style={{ marginTop: '10px' }}>
                        이메일 계정으로 시작하기
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default Join;
