let t;
let mountainHeights = [];
let c1, c2;

function setup() {
    createCanvas(windowWidth,windowHeight);
    background(0);
    init();
}

function draw() {
    background(0);
    gradationBackground(0, 0, width, height, c1, c2);
    moon();
    mountain();
    deppMountain();
    noLoop();
}

function init() {
    t = 0;
    noiseSeed(int(random(5)));
    for (let x = 0; x < width; x++) {
        let n = noise(t);
        t += 0.01;
        mountainHeights[x] = n * 100;
    }
    c1 = color(0);
    c2 = color(0, 102, int(random(100, 255)));
}

function gradationBackground(x, y, w, h, _c1, _c2) {
    for (let i = y; i <= y + h; i += 1) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(_c1, _c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}

function mountain() {
  push();
  stroke(105,105,105,random(0, 50)/3);
  strokeWeight(10);
  let rand = random(0.2, 0.4);
  for (let i = width ; i > 0; i--) {
    line(width/3 +i  , height / 2 + 10, width /2 +i, height / 2 - (mountainHeights[i] * rand));
  }
  pop();
}

function deppMountain() {
    push();
    stroke(92,61,43,random(100, 150)/3);
    strokeWeight(10);
    let rand = random(2.5, 3);
    for (let x = width; x > 0; x--) {
        line(width/ 2 - x, height / 2 +10, width/3 - x, height / 2 - (mountainHeights[x] * rand)); //width/2 can change the sharp angle
    }
    pop();
}


function moon() {
   
    let diamater = random(20, 80);
	  push();
	  for (t = 0; t<400; t+=2){
			let wl = t/12 + diamater / 3 + random(t/10, t/5);
			stroke(255,127,41, t/40 + random(150, 200)/3);
			strokeWeight(1 + t/60);
      line(120 - wl, t+height/2, 120 + wl, t+height/2);
	  }
	  pop() 
}


