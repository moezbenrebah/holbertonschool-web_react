import React from "react";
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import artistData from "../data/artistData"; // import des données centralisées

function ArtistCard({ id }) {
  const artist = artistData[id];

  if (!artist) return null;

  return (
    <Card>
      <CardActionArea component={Link} to={`/artist/${id}`}>
        <CardMedia
          component="img"
          height="200"
          image={artist.image}
          alt={artist.name}
        />
        <CardContent>
          <Typography variant="h6" align="center">{artist.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ArtistCard;
