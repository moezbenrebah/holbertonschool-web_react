import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function HomePage() {
  return (
    <Container>
      <Box textAlign="center" py={5}>
        <Typography variant="h3" gutterBottom color="primary">
          Bienvenue sur K-POP Actu 🎤
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Retrouvez toutes les dernières vidéos et actualités sur vos groupes K-Pop préférés.
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;

