let num = 200; // Number of circles
let vecLocation = []; // Vector for circle centers
let vecVelocity = []; // Vector for circle velocities
let R = []; 
let G = []; 
let B = []; 
let t; // Time variable
let mountainHeights = []; 
let c1, c2; // Color variables
var x, y, n, step = 3; // Animation variables
var mic; // Microphone input
var fft; // FFT analysis object
var isPlaying = false; // Music playback status

function preload() {
  song = loadSound("Assets/night.mp3"); 
}

function setup() {
  createCanvas(900, 630); 
  background(23, 108, 177); 
  fft = new p5.FFT(0.5, 512); 
  mic = new p5.AudioIn(); // Initialize audio input from the microphone
  mic.start(); // Start audio input

  frameRate(60); 
  for (let i = 0; i < num; i++) {
    vecLocation[i] = createVector(random(0, width), random(height/2, height)); // Create random circle positions
    vecVelocity[i] = createVector(20, 1); // Initialize circle velocities
    R[i] = 255; 
    G[i] = 165; 
    B[i] = 0; 
  }
  init(); // Initialize the scene
  noStroke();
  song.play(); 
}

function toggleMusic() {
  if (isPlaying) {
    song.pause(); 
  } else {
    song.play(); // 
  }
  isPlaying = !isPlaying; 
}

function draw() {
  textSize(20); 
  textStyle(BOLDITALIC); 
  fill(240); 
  text('Click anywhere to play the sound!', 400, 150, 200, 500); 
  text('Try to clap, talk, laugh!', 400, 250, 300, 500); 
  river(); 
  shade(); 
  mountain(); 
  deepMountain(); 
  castle(); 
  cloud(); 
}

// Sky gradient with evolving clouds
function cloud() {
  for (y = 0; y < height / 2; y += step) {
    let interpColor = getColorForHeight(y); // Get color based on height
    for (x = 0; x < width; x += step) {
      n = noise(x / 100, y / 25, t); // Perlin noise for cloud pattern
      if (n > 0.99) {
        fill('#c96902'); // Dark orange for clouds
      } else {
        fill(interpColor.levels[0], interpColor.levels[1], interpColor.levels[2], n * map(y, 0, height / 2, 255, 50)); // Varying transparency
      }
      rect(x, y, step, step); // Draw clouds
    }
  }
}
 
// Draw the castle
function castle() {
    // Castle bottom
    fill(92, 61, 43);
    triangle(40, 320, 80, 320, 80, 260); 
    triangle(180, 300, 180, 320, 200, 320);
    triangle(350, 320, 200, 220, 220, 320);
  
    // Castle middle
    rect(100, 200, 140, 100); 
    rect(80, 220, 160, 100);
    triangle(80, 220, 100, 220, 100, 200);
    triangle(160, 200, 240, 200, 200, 140);
    rect(100, 160, 60, 40); 
    quad(110, 130, 120, 140, 120, 160, 110, 160); 
    rect(120, 80, 40, 80); 
    triangle(140, 20, 160, 80, 120, 80); 
  }

  // Draw the river
  function river() {
    for (let i = 0; i < num; i++) {
      fill(R[i], G[i], B[i]); 
      vecLocation[i].add(vecVelocity[i]); // Update circle positions
      ellipse(vecLocation[i].x, vecLocation[i].y, 30, 2); // Draw circles
  
      if (vecLocation[i].x < 0 || vecLocation[i].x > width) {
        vecVelocity[i].x *= -1; // Reverse X-direction velocity
        if (vecLocation[i].x < 0) {
          if (abs(vecLocation[i].y) < height/2 + height/2 / 4) {
            // Change color to light yellow
            R[i] = 224;
            G[i] = 210;
            B[i] = 201;
          } else if (abs(vecLocation[i].y) < height/2 + height/2 * 2 / 4) {
            // Change color to fuel yellow
            R[i] = 234;
            G[i] = 170;
            B[i] = 48;
          } else if (abs(vecLocation[i].y) < height/2 + height/2 * 3 / 4) {
            R[i] = 173;
            G[i] = 99;
            B[i] = 17;
          } else {
            // Change color to deep blue
            R[i] = 86;
            G[i] = 107;
            B[i] = 155;
          }
        } else {
          if (abs(vecLocation[i].y) < height/2 + height/2 / 4) {
            // Change color to brownish
            R[i] = 177;
            G[i] = 121;
            B[i] = 64;
          } else if (abs(vecLocation[i].y) < height/2 + height/2 * 2 / 4) {
            // Change color to cardizak
            R[i] = 83;
            G[i] = 106;
            B[i] = 155;
          } else if (abs(vecLocation[i].y) < height/2 + height/2 * 3 / 4) {
            // Change color to lower reddish-orange
            R[i] = 225;
            G[i] = 82;
            B[i] = 47;
          } else {
            // Change color to brighter lower purple
            R[i] = 99;
            G[i] = 44;
            B[i] = 159;
          }
        }
      }
  
      // Check for collision with upper or lower bounds
      if (vecLocation[i].y < 0 || vecLocation[i].y > height) {
        vecVelocity[i].y *= -1; // Reverse Y-direction velocity
        if (vecLocation[i].y < 0) {
          // Change color to top brownish
          R[i] = 182;
          G[i] = 75;
          B[i] = 26;
        } else {
          // Change color to bottom hazy blue
          R[i] = 130;
          G[i] = 159;
          B[i] = 196;
        }
      }
    }
  }

  // Draw the color gradient of the sky
  function getColorForHeight(y) {
    let h = height / 2;
    if (y < h * (1/8)) {
      return lerpColor(color('#0a21f0'), color('#0a66f0'), y / (h * (1/8)));
    } else if (y < h * (2/8)) {
      return lerpColor(color('#0a66f0'), color('#0aaff0'), (y - h * (1/8)) / (h * (1/8)));
    } else if (y < h * (3/8)) {
      return lerpColor(color('#0aaff0'), color('#f0cd0a'), (y - h * (2/8)) / (h * (1/8)));
    } else if (y < h * (4/8)) {
      return lerpColor(color('#f0cd0a'), color('#f0970a'), (y - h * (3/8)) / (h * (1/8)));
    } else if (y < h * (5/8)) {
      return lerpColor(color('#f0970a'), color('#f0660a'), (y - h * (4/8)) / (h * (1/8)));
    } else if (y < h * (6/8)) {
      return lerpColor(color('#f0660a'), color('#d44b02'), (y - h * (5/8)) / (h * (1/8)));
    } else if (y < h * (7/8)) {
      return lerpColor(color('#d44b02'), color('#d43602'), (y - h * (6/8)) / (h * (1/8)));
    } else {
      return lerpColor(color('#d43602'), color('#d41e02'), (y - h * (7/8)) / (h * (1/8)));
    }
  }
  
  function init() {
    t = 0; // Initialize time variable
    noiseSeed(int(random(5))); // Seed for Perlin noise
    for (let x = 0; x < width; x++) {
      let n = noise(t); // Calculate Perlin noise value
      t += 0.01; 
      mountainHeights[x] = n * 100; // Store mountain heights
    }
    c1 = color(0); // Set color variables
    c2 = color(0, 102, int(random(100, 255)));
  }
  
  //Draw the right mountain
  function mountain() {
    push(); 
    stroke(105, 105, 105, random(0, 50) / 3); // Set stroke color and opacity
    strokeWeight(10); 
    let rand = (0.1, 0.3); // Assign random value
    for (let i = width; i > 0; i--) {
      line(width/3 + i, height/2, width/2 + i, height/2 - (mountainHeights[i] * rand)); 
    }
    pop(); 
  }

  //Draw the left mountain
  function deepMountain() {
    push();
    var vol = mic.getLevel(); // Get audio input level from microphone
    let rand = vol * 40; // Calculate a random value based on audio input
    stroke(92, 61, 43, random(100, 150) / 3); 
    strokeWeight(10); 
    for (let x = width; x > 0; x--) {
      line(width/2 - x, height/2, width/3 - x, height/2 - (mountainHeights[x] * rand));
    }
    pop(); 
  }
  
  //Draw the shade of the castle in the river
  function shade() {
    let lenth = random(20, 80); 
    push(); 
    for (t = 0; t < 400; t += 2) {
      let s = t / 12 + lenth / 3 + random(t / 10, t / 5); 
      stroke(97, 66, 54, t/40 + random(150, 200) / 3); 
      strokeWeight(1 + t/60); 
      line(180 - s, t + height/2, 100 + s, t + height/2); 
    }
    pop(); 
  }
  
  // Toggle music playback state when clicking anywhere on the canvas
  function mousePressed() {
      if (!isPlaying) {
          song.play(); 
      } else {
          song.pause(); 
      }
      isPlaying = !isPlaying; 
  }