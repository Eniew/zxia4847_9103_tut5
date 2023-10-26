var song
var fft
var particles = []
var img
var yOff = 0.7;



function preload() {
    song = loadSound("audio/sample-visualisation.mp3");
    img = loadImage("image/deepsea.jpg")
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    imageMode(CENTER)
    rectMode(CENTER)
    fft = new p5.FFT(0.5, 512)
    img.filter(BLUR, 1)
    
}

function draw() {
    if (getAudioContext().state !== 'running') {
        background(78, 114, 176);
        fill(230);
        beginShape(); 
        let xOff = 0.01;
        for(x = 0; x <= width; x += 10){  
            let y = map(noise(xOff, yOff), 2,1, 50, 400);
            vertex(x, y);
            xOff += 0.01; 
        }
        yOff += 0.006; 
        vertex(width, height);
        vertex(0, height)
        endShape(CLOSE); 
        textSize(40)
        textStyle(BOLDITALIC)
        fill(240)
        text('Click here to play the sound!', windowWidth/2, windowHeight/2 + 100, 200, 500);
        return;
        }
    

    translate(width/2, height/2)
    fft.analyze()
    amp = fft.getEnergy(30, 50)

    push()
    if(amp>230) {
        rotate(random(-0.5, 0.5))
    }
    image(img, 0, 0, width + 100, height + 100)
    pop()
    var alpha = map(amp, 0, 255, 100, 150)
    fill(20, alpha)
    noStroke()
    rect(0, 0, width, height)
    stroke(235, 235, 235) 
    strokeWeight(15)
    noFill()

    var wave = fft.waveform()

    for(var t = -1; t <= 1; t += 2) {
        beginShape()
        for(var i = 0; i <= 180; i += 0.5) {
            var index = floor(map(i,0,180,0,wave.length-1))
            var r = map(wave[index], -1, 1, 80, 250)
            var x = r * sin(i) * t
            var y = r * cos(i)
            vertex(x,y)
        }
        endShape()
    }

    var p = new Particle()
    particles.push(p)

    for(var i = particles.length - 1; i >= 0; i--) {
        if(!particles[i].edges()) {
            particles[i].update(amp > 230)
            particles[i].show()
        } else {
            particles.splice(i, 1)
        }
        
    }

}

function mouseClicked() {
    if(song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
    }
}

class Particle{
    constructor() {
        this.pos = p5.Vector.random2D().mult(10)
        this.vel = createVector(0,0)
        this.acc = this.pos.copy().mult(random(0.001, 0.00001))

        this.w = random(3, 5)
        this.color = [random(100,255), random(200,255), random(100,255)]
    }
    update(cond) {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if(cond) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }
    edges() {
        if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
            return true
        } else {
            return false
        }
    }
    show() {
        noStroke()
        fill(this.color)
        ellipse(this.pos.x, this.pos.y, this.w)
    }
}