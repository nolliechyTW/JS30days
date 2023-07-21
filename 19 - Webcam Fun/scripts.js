const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Function to access the user's video stream from the device's camera
function getVideo() {
  // Use navigator.mediaDevices.getUserMedia to request access to the camera
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      // The camera stream is successfully accessed, and the localMediaStream object holds the stream data
      console.log(localMediaStream);
      
      // Assign the video stream to the 'video' element in the HTML
      video.srcObject = localMediaStream;
      
      // Start playing the video stream, which will display the camera feed in the 'video' element
      video.play();
    })
    .catch(err => {
      // If there's an error, this block of code will be executed
      console.error(`OH NO!!!`, err);
    });
}

// Function to paint video stream onto a canvas element and apply visual effects
function paintToCanvas() {
  // Get the width and height of the video stream
  const width = video.videoWidth;
  const height = video.videoHeight;

  // Set the canvas dimensions to match the video stream
  canvas.width = width;
  canvas.height = height;

  // Use setInterval to continuously paint the video stream onto the canvas
  return setInterval(() => {
    // Draw the video stream onto the canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Get the pixel data from the canvas (an ImageData object)
    // Starting from the top-left corner of the <canvas> element and covering the entire canvas (width and height)
    let pixels = ctx.getImageData(0, 0, width, height);

    // Apply visual effects to the pixels (uncomment one or more effect functions below to see the effect)

    // Example 1: Red Effect
    // pixels = redEffect(pixels);

    // Example 2: RGB Split Effect
    // pixels = rgbSplit(pixels);

    // Example 3: Green Screen Effect
    pixels = greenScreen(pixels);

    // Example 4: Adjust Alpha (transparency) of the pixels
    // ctx.globalAlpha = 0.8;

    // Put the modified pixel data back to the canvas, showing the visual effect
    ctx.putImageData(pixels, 0, 0);
  }, 16); // milliseconds
}


function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  // console.log(data);
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'Pretty');
  link.innerHTML = `<img src="${data}" alt="Pretty Woman" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 200] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

// Function to apply green screen effect on pixel data
function greenScreen(pixels) {
  // Create an object to store the RGB channel levels
  const levels = {};

  // Get all input elements with class 'rgb' and store their values in the 'levels' object
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // Loop through each pixel in the pixel data array
  for (i = 0; i < pixels.data.length; i = i + 4) {
    // Get the RGB and alpha values of the current pixel
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // Check if the RGB values of the pixel fall within the specified range in 'levels'
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // If the pixel's RGB values are within the range, make the pixel transparent
      pixels.data[i + 3] = 0;
    }
  }

  // Return the modified pixel data
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
