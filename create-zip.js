const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a zip file with all project files
try {
  console.log('Creating ZIP archive...');
  
  // List of files to include
  const filesToZip = [
    'package.json',
    'server.js',
    'remotion.config.js',
    'Dockerfile',
    '.dockerignore',
    'render.yaml',
    'README.md',
    'remotion/index.js',
    'remotion/Root.jsx',
    'remotion/ShortsVideo.jsx'
  ];
  
  // Create zip using tar (available in most systems)
  const zipCommand = `tar -czf remotion-video-api.tar.gz ${filesToZip.join(' ')}`;
  execSync(zipCommand);
  
  console.log('✅ Archive created: remotion-video-api.tar.gz');
  console.log('You can download this file from the file explorer');
  
} catch (error) {
  console.error('Error creating archive:', error.message);
}