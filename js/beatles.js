
var height = 500, width = 500, frameRate = 50, i,
    canvas, ctx, cleanInterval, spawnInterval,
    beatles = [], 
    body = document.createElement('img'),
    legs1 = document.createElement('img'),
    legs2 = document.createElement('img'),
    feeler = document.createElement('img');

body.src = 'img/beatle-body.png';
legs1.src = 'img/beatle-legs1.png';
legs2.src = 'img/beatle-legs2.png';
feeler.src = 'img/beatle-feeler.png';

var Beatle = function(options) {
    this.depth = options.depth;
    this.y = height - 400 + 20 * options.depth;
    this.x = width / 2 - 45 * options.depth;
    this.v = 0.1 * options.depth;
    this.height =  10 * options.depth;
    this.width = 10 * options.depth;
    this.feelerAngle = 0;
    this.legs1Angle = 0;
    this.legs2Angle = Math.PI/12;
    this.feelerVelocity = 0.02;
    this.legs1Velocity = 0.02;
    this.legs2Velocity = 0.02;
};

Beatle.prototype.move = function() {
    this.x += this.v;
};

Beatle.prototype.draw = function() {
    this.feelerAngle += this.feelerVelocity;
    this.legs1Angle += this.legs1Velocity;
    this.legs2Angle += this.legs2Velocity;

    if(this.feelerAngle < -Math.PI/6 || this.feelerAngle > Math.PI/6) {
        this.feelerVelocity = -this.feelerVelocity;
    }
    if(this.legs1Angle < -Math.PI/8 || this.legs1Angle > Math.PI/8) {
        this.legs1Velocity = -this.legs1Velocity;
    }
    if(this.legs2Angle < -Math.PI/8 || this.legs2Angle > Math.PI/8) {
        this.legs2Velocity = -this.legs2Velocity;
    }
    
    ctx.save();
    ctx.translate(this.x - this.width/2, this.y - this.height/2);
    ctx.rotate(this.legs1Angle);
    ctx.drawImage(legs1, -this.width/2, -this.height/2, this.width, this.height);
    ctx.rotate(-this.legs1Angle - this.legs2Angle);
    ctx.drawImage(legs2, -this.width/2, -this.height/2, this.width, this.height);
    ctx.rotate(this.legs2Angle);

    ctx.translate(this.width/4, 0);
    ctx.rotate(this.feelerAngle);
    ctx.drawImage(feeler, -3*this.width/4, -this.height/2, this.width, this.height);
    ctx.rotate(-this.feelerAngle);
    ctx.translate(-this.width/4, 0);
    ctx.drawImage(body, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
};

var frame = function () {
    ctx.clearRect(0, 0, height, width);
    for (i in beatles) {
        beatles[i].draw();
    }
    requestAnimationFrame(frame);
};

var move = function () {
    for (i in beatles) {
        beatles[i].move();
    }
};

var spawn = function () {
    depth = (Math.random() * 15) + 5;
    
    var beatle = new Beatle({
        depth: depth
    });
    beatles.push(beatle);
    return beatle;
}

var clean = function () {
    var tmpArray = beatles;
    for (var i = tmpArray.length - 1; i >= 0; i--) {
        if(tmpArray[i].x > 700) {
            tmpArray.splice(i, 1);
        }
    }
    beatles = tmpArray;
};

var stop = function () {
    clearInterval(spawnInterval);
    clearInterval(cleanInterval);
};

window.onload = function () {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.height = height;
    canvas.width = width;
    ctx = canvas.getContext("2d");
    //ctx.fillRect(200, 300, 500, 500, 'yellow');
    //ctx.save();

    spawn();
    frame();
    spawnInterval = setInterval(spawn, 1000);
    cleanInterval = setInterval(clean, 10000);
    moveInterval = setInterval(move, 50);
};
window.requestAnimationFrame = 
    window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

Function.prototype.bind = 
    Function.prototype.bind || 
    function (scope) {
        this.call(scope, Array.prototype.slice.call(arguments,1));
    };
