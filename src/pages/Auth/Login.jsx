import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import logo from '../../assets/logo.png';

const Login = ({ login }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token']);
    const [open, setOpen] = useState(false); // 다이얼로그 열기 상태

    useEffect(() => {
        // 컴포넌트가 마운트될 때 다이얼로그를 자동으로 열기
        setOpen(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        // 이메일 형식 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(username)) {
            alert('유효한 이메일 주소를 입력해 주세요.');
            return;
        }

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

            const token = response.headers['authorization'];
            setCookie('token', token);

//             if (localStorage.getItem('role') === 'ROLE_ADMIN') {
//                 navigate('/admin');
//             } else {
//                 navigate('/');
//             }
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    const handleClose = () => {
        setOpen(false); // 모달 닫기
        navigate('/join'); // /join으로 이동
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box display="flex" alignItems="center" mt={15} mb={15}>
                <img src={logo} alt="Logo" style={{ width: 70, height: 70 }} />
                <Typography variant="h3">게임메이트</Typography>
            </Box>
            <Dialog open={open}
                    onClose={handleClose}
                    fullWidth
                    PaperProps={{ style: { maxWidth: '370px' } }}>
                <DialogTitle>
                    <Typography variant="h4" align="center" gutterBottom>
                        로그인
                    </Typography>
                </DialogTitle>
                <Typography variant="body2" align="center">
                    아직 계정이 없으신가요? <Button onClick={() => navigate('/join')}>회원가입</Button>
                </Typography>
                <DialogContent>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<img src={process.env.PUBLIC_URL + '/googleLogo.png'} alt="Google Icon" style={{ width: 20, height: 20, marginRight: 10 }} />}
                        style={{ marginTop: '10px' }}
                    >
                        Google 계정으로 로그인
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<img src={process.env.PUBLIC_URL + '/naverLogo.png'} alt="Naver Icon" style={{ width: 23, height: 23, marginRight: 10 }} />}
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
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{ marginTop: '16px' }}
                        >
                            이메일 계정으로 로그인
                        </Button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => alert('비밀번호 찾기')} color="secondary">
                        비밀번호 찾기
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
