const artistData = {
  blackpink: {
    id: "blackpink",
    name: "BLACKPINK",
    image: "https://media.gq-magazine.co.uk/photos/5d13ab78c26553619da379be/master/pass/blackpink-gq-10apr18_shutterstock_b.jpg",
    agency: "YG Entertainment",
    status: "En activité",
    debut: "2016",
    members: [
      { name: "Jisoo", role: "Chanteuse", age: 29 },
      { name: "Jennie", role: "Rappeuse", age: 28 },
      { name: "Rosé", role: "Chanteuse", age: 27 },
      { name: "Lisa", role: "Rappeuse", age: 27 }
    ],
    albums: ["Square Up", "Kill This Love", "The Album", "Born Pink"],
    youtube: "https://www.youtube.com/@BLACKPINKOFFICIAL",
    spotify: "https://open.spotify.com/artist/41MozSoPIsD1dJM0CLPjZF"
  },

  bts: {
    id: "bts",
    name: "BTS",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/BTS_for_Love_Myself_campaign.png/400px-BTS_for_Love_Myself_campaign.png",
    agency: "BigHit Music",
    status: "En pause (service militaire)",
    debut: "2013",
    members: [
      { name: "RM", role: "Leader, Rappeur", age: 29 },
      { name: "Jin", role: "Vocal", age: 31 },
      { name: "Suga", role: "Rappeur", age: 30 },
      { name: "J-Hope", role: "Rappeur", age: 30 },
      { name: "Jimin", role: "Chanteur", age: 28 },
      { name: "V", role: "Chanteur", age: 28 },
      { name: "Jungkook", role: "Chanteur principal", age: 26 }
    ],
    albums: ["Wings", "Love Yourself", "Map of the Soul", "BE"],
    youtube: "https://www.youtube.com/@BANGTANTV",
    spotify: "https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX"
  },

  newjeans: {
    id: "newjeans",
    name: "NewJeans",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/NewJeans_KCON_2022.jpg/400px-NewJeans_KCON_2022.jpg",
    agency: "ADOR / HYBE",
    status: "En activité",
    debut: "2022",
    members: [
      { name: "Minji", role: "Leader", age: 19 },
      { name: "Hanni", role: "Chanteuse", age: 19 },
      { name: "Danielle", role: "Chanteuse", age: 18 },
      { name: "Haerin", role: "Chanteuse", age: 18 },
      { name: "Hyein", role: "Maknae", age: 16 }
    ],
    albums: ["New Jeans", "Get Up"],
    youtube: "https://www.youtube.com/@NewJeans_official",
    spotify: "https://open.spotify.com/artist/6HvZYsbFfjnjFrWF950C9d"
  },

  straykids: {
    id: "straykids",
    name: "Stray Kids",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Stray_Kids_in_2021.png/400px-Stray_Kids_in_2021.png",
    agency: "JYP Entertainment",
    status: "En activité",
    debut: "2018",
    members: [
      { name: "Bang Chan", role: "Leader", age: 26 },
      { name: "Lee Know", role: "Danseur", age: 25 },
      { name: "Changbin", role: "Rappeur", age: 24 },
      { name: "Hyunjin", role: "Danseur principal", age: 24 },
      { name: "Han", role: "Rappeur", age: 23 },
      { name: "Felix", role: "Rappeur", age: 23 },
      { name: "Seungmin", role: "Chanteur", age: 23 },
      { name: "I.N", role: "Maknae", age: 22 }
    ],
    albums: ["NOEASY", "ODDINARY", "5-STAR"],
    youtube: "https://www.youtube.com/@StrayKids",
    spotify: "https://open.spotify.com/artist/2dIgFjalVxs4ThymZ67YCE"
  },

  twice: {
    id: "twice",
    name: "TWICE",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Twice_KCON_2018.jpg/400px-Twice_KCON_2018.jpg",
    agency: "JYP Entertainment",
    status: "En activité",
    debut: "2015",
    members: [
      { name: "Nayeon", role: "Chanteuse", age: 29 },
      { name: "Jeongyeon", role: "Chanteuse", age: 27 },
      { name: "Momo", role: "Danseuse", age: 27 },
      { name: "Sana", role: "Chanteuse", age: 27 },
      { name: "Jihyo", role: "Leader", age: 27 },
      { name: "Mina", role: "Chanteuse", age: 27 },
      { name: "Dahyun", role: "Rappeuse", age: 26 },
      { name: "Chaeyoung", role: "Rappeuse", age: 25 },
      { name: "Tzuyu", role: "Maknae", age: 24 }
    ],
    albums: ["Feel Special", "Eyes Wide Open", "Formula of Love"],
    youtube: "https://www.youtube.com/@TWICE",
    spotify: "https://open.spotify.com/artist/7n2Ycct7Beij7Dj7meI4X0"
  },

  ateez: {
    id: "ateez",
    name: "ATEEZ",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/ATEEZ_2022_KCON.png/400px-ATEEZ_2022_KCON.png",
    agency: "KQ Entertainment",
    status: "En activité",
    debut: "2018",
    members: [
      { name: "Hongjoong", role: "Leader", age: 25 },
      { name: "Seonghwa", role: "Chanteur", age: 26 },
      { name: "Yunho", role: "Danseur", age: 25 },
      { name: "Yeosang", role: "Danseur", age: 25 },
      { name: "San", role: "Chanteur", age: 25 },
      { name: "Mingi", role: "Rappeur", age: 24 },
      { name: "Wooyoung", role: "Danseur", age: 24 },
      { name: "Jongho", role: "Maknae", age: 23 }
    ],
    albums: ["Treasure EP.FIN", "ZERO : FEVER", "THE WORLD EP.FIN"],
    youtube: "https://www.youtube.com/@ATEEZofficial",
    spotify: "https://open.spotify.com/artist/68KmkJeZGfwe1OUaivBa2L"
  },

  everglow: {
  id: "everglow",
  name: "EVERGLOW",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Everglow_at_KCON_2019.jpg/400px-Everglow_at_KCON_2019.jpg",
  agency: "Yuehua Entertainment",
  status: "En activité",
  debut: "2019",
  members: [
    { name: "E:U", role: "Leader", age: 26 },
    { name: "Sihyeon", role: "Chanteuse", age: 24 },
    { name: "Mia", role: "Rappeuse", age: 24 },
    { name: "Onda", role: "Chanteuse", age: 24 },
    { name: "Aisha", role: "Rappeuse", age: 23 },
    { name: "Yiren", role: "Maknae", age: 23 }
  ],
  albums: ["Reminiscence", "Last Melody"],
  youtube: "https://www.youtube.com/@EVERGLOW",
  spotify: "https://open.spotify.com/artist/5t5FqBwTcgKTaWmfEbwQY9"
},

le_sserafim: {
  id: "le_sserafim",
  name: "LE SSERAFIM",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/LE_SSERAFIM_220505.jpg/400px-LE_SSERAFIM_220505.jpg",
  agency: "Source Music / HYBE",
  status: "En activité",
  debut: "2022",
  members: [
    { name: "Sakura", role: "Chanteuse", age: 26 },
    { name: "Kim Chaewon", role: "Leader", age: 23 },
    { name: "Huh Yunjin", role: "Rappeuse", age: 22 },
    { name: "Kazuha", role: "Danseuse", age: 21 },
    { name: "Hong Eunchae", role: "Maknae", age: 18 }
  ],
  albums: ["Fearless", "Antifragile", "Unforgiven"],
  youtube: "https://www.youtube.com/@LESSERAFIM_official",
  spotify: "https://open.spotify.com/artist/6XGqR9hTrXy3r1vI1vlFzY"
},

exo: {
  id: "exo",
  name: "EXO",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/EXO_Love_Shot.jpg/400px-EXO_Love_Shot.jpg",
  agency: "SM Entertainment",
  status: "En activité",
  debut: "2012",
  members: [
    { name: "Suho", role: "Leader", age: 33 },
    { name: "Baekhyun", role: "Chanteur", age: 32 },
    { name: "Chanyeol", role: "Rappeur", age: 32 },
    { name: "D.O.", role: "Chanteur", age: 31 },
    { name: "Kai", role: "Danseur", age: 30 },
    { name: "Sehun", role: "Maknae", age: 30 }
  ],
  albums: ["XOXO", "EXODUS", "The War", "Obsession"],
  youtube: "https://www.youtube.com/@weareoneEXO",
  spotify: "https://open.spotify.com/artist/3cjEqqelV9wLSw1Zcl2ZhU"
}

};

export default artistData;
