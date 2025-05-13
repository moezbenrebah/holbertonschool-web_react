import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  ListItemIcon
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import CelebrationIcon from '@mui/icons-material/Celebration';
import GroupIcon from '@mui/icons-material/Group';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton menu */}
      <IconButton
        onClick={() => setOpen(!open)}
        style={{ position: 'fixed', top: 10, left: 10, zIndex: 1300 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Menu latéral */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: { paddingTop: '50px', width: 240 }
        }}
      >
        <List>

          {/* Accueil */}
          <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItem>
          <Divider />

          {/* Actualités */}
          <ListItem button component={Link} to="/news" onClick={() => setOpen(false)}>
            <ListItemIcon><ArticleIcon /></ListItemIcon>
            <ListItemText primary="Actualités" />
          </ListItem>
          <Divider />

          {/* Événements */}
          <ListItem button component={Link} to="/events" onClick={() => setOpen(false)}>
            <ListItemIcon><CelebrationIcon /></ListItemIcon>
            <ListItemText primary="Événements" />
          </ListItem>
          <Divider />

          {/* Groupes / Solistes */}
          <ListItem button component={Link} to="/artists" onClick={() => setOpen(false)}>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Groupes / Solistes" />
          </ListItem>
          <Divider />

        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
