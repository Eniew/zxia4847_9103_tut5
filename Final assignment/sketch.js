let num = 200; // 圆的数量
let vecLocation = []; // 圆的中心的位置向量
let vecVelocity = []; // 圆的速度向量
let R = [];
let G = [];
let B = [];
let t;
let mountainHeights = [];
let c1, c2;
var a = 0.0, x, y, n, step = 3;
var mic;
var fft; // FFT分析对象
var isPlaying = false;// 音乐播放状态

function preload() {
  song = loadSound("Assets/night.mp3");
}

function setup() {
createCanvas(900, 630);
background(23, 108, 177);
fft = new p5.FFT(0.5, 512);

mic = new p5.AudioIn();
mic.start();

frameRate(60);
for (let i = 0; i < num; i++) {
vecLocation[i] = createVector(random(0, width), random(height/2, height));
vecVelocity[i] = createVector(20, 1);
R[i] = 255; 
G[i] = 165;
B[i] = 0;
}
init();
noStroke();
song.play();

}

function toggleMusic() {
    if (isPlaying) {
        song.pause(); // 暂停音乐
    } else {
        song.play(); // 播放音乐
    }
    isPlaying = !isPlaying; // 切换音乐播放状态
}


function draw() {

river();
shade();
mountain();
deepMountain();
castle();
cloud();
}




function cloud(){

    // Sky gradient with evolving clouds
    for (y = 0; y < height / 2; y += step) {
        let interpColor = getColorForHeight(y);
        for (x = 0; x < width; x += step) {
        n = noise(x / 100, y / 25, t);
        if (n > 0.99) {
        fill('#c96902');
        } else {
        fill(interpColor.levels[0], interpColor.levels[1], interpColor.levels[2], n * map(y, 0, height / 2, 255, 50)); // 调整了透明度范围
        }
        rect(x, y, step, step);
        }
    }
    a += 0.1;

}
function castle(){
//castle bottom
fill(92,61,43); //if change or delete this line, the color will change with the refresh.
triangle(40,320,80,320,80,260);
triangle(180,300,180,320,200,320);
triangle(350,320,200,220,220,320);
//castle middle
rect(100,200,140,100);
rect(80,220,160,100);
triangle(80,220,100,220,100,200);
triangle(160,200,240,200,200,140);
rect(100,160,60,40);
quad(110,130,120,140,120,160,110,160);
rect(120,80,40,80);
triangle(140,20,160,80,120,80);
}



function river(){
  
    for (let i = 0; i < num; i++) {
        fill(R[i], G[i], B[i]); 
        vecLocation[i].add(vecVelocity[i]); // 更新圆的坐标
        ellipse(vecLocation[i].x, vecLocation[i].y, 30, 2); // 在指定位置画圆
        
        if (vecLocation[i].x < 0 || vecLocation[i].x > width) {
        vecVelocity[i].x *= -1; // X方向的速度反转 // 在这里添加新的颜色变换逻辑
        if (vecLocation[i].x < 0) {
        if (
        abs(vecLocation[i].y) < height/2+height/2 / 4
        ) {
        // 新颜色，例如浅黄
        R[i] = 224;
        G[i] = 210;
        B[i] = 201;
        } else if (
        abs(vecLocation[i].y) < height/2+height/2*2 / 4
        ){
        //fuel yellow
        R[i] = 234;
        G[i] = 170;
        B[i] = 48;
        } else if (
        abs(vecLocation[i].y) < height/2+height/2*3 / 4
        ){
        R[i] = 173;
        G[i] = 99;
        B[i] = 17;
        }else{
        //深蓝
        R[i] = 86;
        G[i] = 107;
        B[i] = 155;
        }
        } else {
        if (
        abs(vecLocation[i].y) < height/2+height/2 / 4
        ) {
        // 新颜色，例如棕秀色
        R[i] = 177;
        G[i] = 121;
        B[i] = 64;
        } else if (
        abs(vecLocation[i].y) < height/2+height/2*2 / 4
        ){
        //卡蒂萨克
        R[i] = 83;
        G[i] = 106;
        B[i] = 155;
        } else if (
        abs(vecLocation[i].y) < height/2+height/2*3 / 4
        ){
        //下方量橘红
        R[i] = 225;
        G[i] = 82;
        B[i] = 47;
        }else{
        //下方紫色较亮
        R[i] = 99;
        G[i] = 44;
        B[i] = 159;
        }
        }
        } // 检测上边界或下边界的碰撞
        if (vecLocation[i].y < 0 || vecLocation[i].y > height) {
        vecVelocity[i].y *= -1; // Y方向的速度反转 // 根据条件选择颜色
        if (vecLocation[i].y < 0) {
        // 某种颜色，例如顶部棕红
        R[i] = 182;
        G[i] = 75;
        B[i] = 26;
        } else {
        // 另一种颜色，底部 雾霾蓝
        R[i] = 130;
        G[i] = 159;
        B[i] = 196;
        }
        }
        }
        
}

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


function mountain() {
push();
stroke(105,105,105,random(0, 50)/3);
strokeWeight(10);
let rand = (0.1, 0.3)
for (let i = width ; i > 0; i--) {
line(width/3 +i , height / 2 , width /2 +i, height / 2 - (mountainHeights[i] * rand));
}
pop();
}


function deepMountain() {
push();
var vol = mic.getLevel();
let rand = vol *40
stroke(92,61,43,random(100, 150)/3);
strokeWeight(10);
for (let x = width; x > 0; x--) {
line(width/ 2 - x, height / 2 , width/3 - x, height / 2 - (mountainHeights[x] * rand));
}
pop();
}




function shade() {
let lenth = random(20, 80);
push();
for (t = 0; t<400; t+=2){
let s = t/12 + lenth / 3 + random(t/10, t/5);
stroke(97,66,54, t/40 + random(150, 200)/3);
strokeWeight(1 + t/60);
line(180 - s, t+height/2, 100 + s, t+height/2);
}
pop();
}

function mousePressed() {
    // 当点击画面任意区域时，切换音乐播放状态
    if (!isPlaying) {
        song.play();
    } else {
        song.pause();
    }
    isPlaying = !isPlaying;
}
