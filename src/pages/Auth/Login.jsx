import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // 쿠키 훅 추가

const Login = ({ login }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token']); // 쿠키 훅 추가

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8080/login',
                {
                    username,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(`${response.data.errorCode}: ${response.data.errorMessage}`);
            }

            // 토큰을 응답 헤더에서 가져오기
            const token = response.headers['authorization'];

            // 쿠키에 토큰 저장
            setCookie('token', token);

            // 사용자 역할에 따라 페이지 이동
            if (localStorage.getItem('role') === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    return (
        <Container
            maxWidth="xs"
            style={{
                marginTop: '50px',
                padding: '20px',
                boxShadow: '3px 3px 15px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                로그인
            </Typography>
            <Typography variant="body2" align="center">
                아직 계정이 없으신가요? <Button onClick={() => navigate('/join')}>회원가입</Button>
            </Typography>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<img src="path-to-google-icon.png" alt="Google Icon" />}
                style={{ marginTop: '10px' }}
            >
                Google 계정으로 로그인
            </Button>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<img src="path-to-naver-icon.png" alt="Naver Icon" />}
                style={{ marginTop: '10px' }}
            >
                Naver 계정으로 로그인
            </Button>
            <Divider style={{ margin: '20px 0' }}>또는</Divider>
            <form onSubmit={handleLogin}>
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
                <Button fullWidth variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                    이메일 계정으로 로그인
                </Button>
            </form>
            <Button
                onClick={() => alert('비밀번호 찾기')}
                style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            >
                비밀번호 찾기
            </Button>
        </Container>
    );
};

export default Login;
