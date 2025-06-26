# Remotion Video API Server

A Node.js server that generates YouTube Shorts videos (1080x1920) using Remotion, designed for deployment on cloud platforms like Render.

## Features

- **API Endpoint**: POST `/make` for video generation
- **YouTube Shorts Format**: 1080x1920 resolution, 30fps, H264 codec
- **Beat Synchronization**: Visual elements sync with audio beats
- **Cloud Ready**: Optimized for deployment on Render, Railway, etc.
- **No Frontend**: Pure API server for integration with make.com and other services

## API Usage

### POST /make

Generate a video with synchronized beats and audio.

**Request Body:**
```json
{
  "inputs": {
    "beats": [1.2, 2.3, 3.4, 5.1, 6.8],
    "audio_url": "https://example.com/audio.mp3",
    "audio_duration": 15
  }
}
```

**Parameters:**
- `beats`: Array of numbers representing beat timestamps in seconds
- `audio_url`: URL to audio file (MP3, WAV, etc.)
- `audio_duration`: Duration of audio in seconds

**Response:**
- Returns MP4 video file as attachment
- Content-Type: `video/mp4`

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test the API
curl -X POST http://localhost:3000/make \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "beats": [1, 2, 3, 4, 5],
      "audio_url": "https://example.com/audio.mp3",
      "audio_duration": 10
    }
  }' \
  --output video.mp4
```

## Deployment

### Render

1. Connect your GitHub repository to Render
2. Use the included `render.yaml` configuration
3. Deploy as a Web Service

### Docker

```bash
# Build image
docker build -t remotion-video-api .

# Run container
docker run -p 3000:3000 remotion-video-api
```

## Integration with Make.com

1. Create an HTTP module in Make.com
2. Set URL to your deployed server + `/make`
3. Method: POST
4. Headers: `Content-Type: application/json`
5. Body: JSON with your inputs
6. Parse response as binary data for video file

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Technical Details

- **Framework**: Express.js
- **Video Engine**: Remotion
- **Format**: MP4 (H264 codec)
- **Resolution**: 1080x1920 (YouTube Shorts)
- **Frame Rate**: 30fps
- **Audio**: Synchronized with beat timing