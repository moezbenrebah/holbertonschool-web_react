import React from "react";
import Slider from "react-slick";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function VideoFeed({ videos }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {videos.map((video, index) => (
        <Card key={index} style={{ margin: "0 10px" }}>
          <CardActionArea
            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardMedia
              component="img"
              height="180"
              image={video.snippet.thumbnails.high.url}
              alt={video.snippet.title}
            />
            <CardContent>
              <Typography variant="h6">{video.snippet.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {video.snippet.channelTitle}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Slider>
  );
}

export default VideoFeed;
