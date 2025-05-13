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

function ArticleFeed({ articles }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {articles.map((article, index) => (
        <div key={index} style={{ padding: "0 8px" }}>
          <Card style={{ height: 370, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardActionArea
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="180"
                image={article.image}
                alt={article.title}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
                >
                  {article.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      ))}
    </Slider>
  );
}

export default ArticleFeed;
