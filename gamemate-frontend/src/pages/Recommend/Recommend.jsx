import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Paper, Chip, Grid, IconButton } from '@mui/material';
import { ChatBubbleOutline, PersonAdd } from '@mui/icons-material';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Recommend.css';

const Recommend = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.post('http://127.0.0.1:8000/recommendation', {
        preferred_genres: [1, 1, 1, 1, 1],
        play_times: [1, 0, 0, 1, 0, 1, 1]
      });
      setUsers(response.data.similar_users);
    };
    fetchUsers();
  }, []);

  return (
    <Box className="recommend-container">
      <Typography variant="h6"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '14pt',
          letterSpacing: '-0.5px',
          marginBottom: '20px',
        }}>
         🕹️ 오늘의 추천 게임메이트
      </Typography>
      {users.map((user, index) => (
        <Paper key={index} className="user-card">
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar src={profilePlaceholder} alt="Profile" className="profile-pic" />
            </Grid>
            <Grid item xs>
              <Typography variant="h6"
                sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 600,
                fontSize: '12pt',
                letterSpacing: '-0.5px',
                marginBottom: '20px',
                }} className="username">
                {user.recommend_user}
              </Typography>
              <Box className="tags">
                {user.common_genre.map((genre, index) => (
                  <Chip key={index} label={genre} className="tag" />
                ))}
              </Box>
              <Box className="tags">
                {user.common_play_time.map((time, index) => (
                  <Chip key={index} label={time} className="tag" />
                ))}
              </Box>
            </Grid>
            <Grid item>
              <Box className="icon-buttons" display={"flex"}>
                <IconButton className="icon-button">
                  <ChatBubbleOutline />
                </IconButton>
                <IconButton className="icon-button">
                  <PersonAdd />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default Recommend;
