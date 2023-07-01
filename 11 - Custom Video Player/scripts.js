/* Get Our Elements */
// Select the player container div
const player = document.querySelector(".player");
// Select the video element within the player container
const video = player.querySelector(".player__video.viewer");
// Select the progress container div
const progress = player.querySelector(".progress");
// Select the progress bar within the progress container
const progressBar = player.querySelector(".progress__filled");
// Select the play button
const toggle = player.querySelector(".toggle");
// Select all skip buttons (go back 25s or turn back 10s)
const skipButtons = player.querySelectorAll("button[data-skip]");
// Select all range sliders (change volume or play rate)
const ranges = player.querySelectorAll(".player__slider");

/* Build out functions */
// Function to toggle between play and pause
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  // equal video.method()
  video[method]();
}

// Function to update the play/pause button based on the video's paused state
function updateButton() {
  toggle.textContent = this.paused ? "►" : "❚❚";
}

// Function to handle the progress bar update based on the video's current time
function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// Function to skip forward or backward in the video based on the button's data-skip value
function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// Function to handle the update of video properties (volume, play rate) based on the range slider's value
function handleRangeUpdate() {
  //console.log(this);
  video[this.name] = this.value;
}

// Function to scrub (jump to a specific time) in the video when the progress bar is clicked or dragged
function scrub(e) {
  const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
}

/* Hook up the event listners */
toggle.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

video.addEventListener("timeupdate", handleProgress);

skipButtons.forEach(button => button.addEventListener("click", skip));

// Event listeners for range sliders (volume and play rate)
ranges.forEach(range => {
  range.addEventListener("change", handleRangeUpdate);
  range.addEventListener("mousemove", handleRangeUpdate);
  range.addEventListener("click", handleRangeUpdate);
});

// Event listeners for scrubbing in the progress bar
let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", e => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));