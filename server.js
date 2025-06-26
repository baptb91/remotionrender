const express = require('express');
const cors = require('cors');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure output directory exists
const outputDir = path.join(__dirname, 'output');
fs.ensureDirSync(outputDir);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'active',
    message: 'Remotion Video API Server',
    endpoints: {
      'POST /make': 'Generate video with beats, audio_url, and audio_duration'
    }
  });
});

// Main video generation endpoint
app.post('/make', async (req, res) => {
  console.log('Received request:', req.body);
  
  try {
    const { inputs } = req.body;
    
    if (!inputs || !inputs.beats || !inputs.audio_url || !inputs.audio_duration) {
      return res.status(400).json({
        error: 'Missing required inputs: beats, audio_url, audio_duration'
      });
    }

    const { beats, audio_url, audio_duration } = inputs;
    
    // Validate inputs
    if (!Array.isArray(beats) || beats.length === 0) {
      return res.status(400).json({
        error: 'beats must be a non-empty array of numbers'
      });
    }
    
    if (typeof audio_duration !== 'number' || audio_duration <= 0) {
      return res.status(400).json({
        error: 'audio_duration must be a positive number'
      });
    }

    console.log('Starting video generation...');
    console.log('Beats:', beats);
    console.log('Audio URL:', audio_url);
    console.log('Audio Duration:', audio_duration);

    // Generate unique filename
    const videoId = uuidv4();
    const outputPath = path.join(outputDir, `video_${videoId}.mp4`);

    // Bundle the Remotion project
    console.log('Bundling Remotion project...');
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'remotion', 'index.js'),
      webpackOverride: (config) => config,
    });

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'ShortsVideo',
      inputProps: {
        beats,
        audioUrl: audio_url,
        audioDuration: audio_duration
      }
    });

    console.log('Rendering video...');
    
    // Render the video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        beats,
        audioUrl: audio_url,
        audioDuration: audio_duration
      },
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      }
    });

    console.log('Video generated successfully:', outputPath);

    // Send the video file
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="shorts_video_${videoId}.mp4"`);
    
    const videoStream = fs.createReadStream(outputPath);
    videoStream.pipe(res);

    // Clean up file after sending
    videoStream.on('end', () => {
      setTimeout(() => {
        fs.remove(outputPath).catch(err => {
          console.error('Error cleaning up file:', err);
        });
      }, 5000);
    });

  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({
      error: 'Failed to generate video',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Remotion Video API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Video generation: POST http://localhost:${PORT}/make`);
});