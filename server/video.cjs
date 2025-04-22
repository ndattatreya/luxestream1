const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // install this: npm install node-fetch@2

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Route to stream video
app.get('/stream/:movieId', (req, res) => {
  const { movieId } = req.params;

  // Check if the user has paid for the movie (mock logic)
  const userHasPaid = true; // Replace with actual payment verification logic
  if (!userHasPaid) {
    return res.status(403).json({ error: 'Access denied. Please rent or buy the movie.' });
  }

  // Path to the video file
  const videoPath = path.join(__dirname, 'movies', `${movieId}.mp4`);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Movie not found.' });
  }

  // Stream the video
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// New route to play trailer for a movie using its IMDb ID
app.get('/trailer/:movieId', async (req, res) => {
  const { movieId } = req.params;
   
  try {
    // Replace with the actual IMDb Trailer API endpoint and key
    const trailerResponse = await fetch(`https://imdb-api.com/en/API/Trailer/951519c3/${movieId}`);
    const trailerData = await trailerResponse.json();
    console.log("Trailer API response:", trailerData);
    
    if (trailerData && trailerData.link) {
      // Redirect the client to the trailer URL for playback, or proxy it if needed
      res.redirect(trailerData.link);
    } else {
      res.status(404).json({ error: 'Trailer not found.' });
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    res.status(500).json({ error: 'Error fetching trailer.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});