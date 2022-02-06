// ---------- START GLOBAL SETUP ---------- //
// let maxWidth = 800;
// let maxHeight = 500;
// SETUP CANVAS
const canvas = document.getElementById("metaballs");
const c = canvas.getContext("2d");
// GET FIREFOX
var browser = navigator.userAgent.toLowerCase();
if(browser.indexOf("firefox")>-1){
    var firefox = true;
}
// DETECT MOBILE
var mobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
// SET SIZE
var size = {
    width: window.innerWidth || document.body.clientWidth,
    height: window.innerHeight || document.body.clientHeight
}
canvas.width = size.width;
canvas.height = size.height;
var center = {x:size.width/2,y:size.height/2}
console.log(size);
// ---------- END GLOBAL SETUP ---------- //

var coll;
var res = 10;
var limit = 1;

var bruteFill = false;
var drawMarchingSquares = true;
var drawText = false;
var drawGrid = false;
var drawOrigCircles = false;
var drawInterp = true;
var running = true;
//var backgroundColor = rgba(10,50,70);

function animate() {
    requestAnimationFrame(animate);

    // Calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // FPS report
    fpsReport++;
    if (fpsReport > 60) {
        fpsNum.innerHTML = Math.floor(1000/elapsed);
        fpsReport = 0;
    }
    // If enough time has passed, draw next frame
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        c.clearRect(0,0,canvas.width,canvas.height);
        c.fillStyle = "green";
        c.fillRect(0,0,canvas.width,canvas.height);
        metaballs.update();
    }
}

var frameCount = 0;
var fps,fpsInterval, startTime, noe, then, elapsed;
var fpsNum = document.getElementById("fps-number");
var fpsReport = 58;

// START ANIMATION
function startAnimating() {
    if(fps==null) {var fps = 60;}
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

metaballs = new Metaball_Collection(10);
startAnimating();

// function setup() {
//     var can = createCanvas(size.width, size.height);
//     can.parent("metaballs");
//     
//     draw();
// }

// function draw() {
//         clear();
//         fill(10,50,70);
//         rect(0,0,maxWidth,maxHeight);
//         for (var j=0; j<coll.truthy.length; j++) {
//             for (var i=0; i<coll.truthy[0].length; i++) { 
//                 if (coll.truthy[j][i]) {
//                     if (bruteFill) { // fill pixel
//                         fillRect(i*res,j*res,res,res);
//                     }
//                     if (drawText && res>=4) { // draw '1'
//                         drawText(`1`,(i+0)*res,(j+0)*res);
//                     }
//                 } else {
//                     if (drawText && res>=4) { // draw '0'
//                         drawText(`0`,(i+0)*res,(j+0)*res);
//                     }
//                 }
//                 if (drawGrid && res>=4) { // grid vertical
//                     drawVLine(i*res);
//                 }
//             }
//             if (drawGrid && res>=4) { // grid horizontal
//                 drawHLine(j*res);
//             }
//         }

//         if (drawOrigCircles) {
//             // draw actual circles
//             coll.balls.forEach(ball=>{drawCircle(ball.pos.x,ball.pos.y,ball.r)})
//         }

//         // update physics
//         coll.update();
// }

// ---------- Start Draw Helpers ---------- //
function fillRect(x,y,w,h){
    fill(0,170,255);
    stroke(0,a=0);
    rect(x,y,w,h);
}

function drawText(s,x,y){
    fill(0,180,220);
    strokeWeight(0);
    textSize(8);
    textAlign(CENTER,CENTER);
    text(s,x,y);
}

function drawLine(x1,y1,x2,y2){
    c.beginPath(); 
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.lineWidth = 1;
    c.strokeStyle = "#ffffff"
    c.stroke();
    c.closePath();
}

function drawVLine(x){
    c.beginPath(); 
    c.moveTo(x,0);
    c.lineTo(x,size.height);
    c.lineWidth = 1;
    c.strokeStyle = "#b3b3b3"
    c.stroke();
    c.closePath();
}

function drawHLine(y){
    c.beginPath(); 
    c.moveTo(0,y);
    c.lineTo(size.width,y);
    c.lineWidth = 1;
    c.strokeStyle = "#b3b3b3"
    c.stroke();
    c.closePath();
}

function drawCircle(x,y,r){
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2)
    c.lineWidth=0.5;
    c.strokeStyle = "#ffffff"
    c.stroke();
    c.closePath();    
}
// ---------- End Draw Helpers ----------//

// ---------- Start Input Handling ---------- //

// Update boundary on resize
addEventListener('resize', function(){
    size.width = innerWidth;
    size.height = innerHeight;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    center.x = size.width/ 2;
    center.y = size.height / 2;
    if ( innerWidth >= 1000 && ! mobile ) {
      document.getElementById('mobile-metaballs-controls').style.display = 'none';
    } else {
      document.getElementById('mobile-metaballs-controls').style.display = 'block';
    }
    metaballs.update();
  });
// Mobile Closers
var mobileClosers = document.getElementsByClassName("metaballs-control-close");
for (var i=0; i<mobileClosers.length; i++) {
    mobileClosers[i].onclick = function() {
        this.parentNode.classList.toggle('show')
        document.getElementById('mobile-metaballs-controls').style.display = 'block';
    }
}

// Resolution Slider
var resolutionControlContainer = document.getElementById("resolution-control-container");
var resolutionInput = document.getElementById("resolution");
var resolutionMobile = document.getElementById('resolution-mobile');
resolutionInput.oninput = function() {
    res = parseInt(this.value);
    metaballs.update();
}
resolutionMobile.onclick = function() {
    document.getElementById('mobile-metaballs-controls').style.display = 'none';
    resolutionControlContainer.classList.toggle('show');
}

// Num Balls Slider
var numBallsControlContainer = document.getElementById("numBalls-control-container");
var numBallsInput = document.getElementById("numBalls");
var numBallsMobile = document.getElementById('numBalls-mobile');
numBallsInput.oninput = function() {
    adjustCount(this.value);
    metaballs.update();
}
numBallsMobile.onclick = function() {
    document.getElementById('mobile-metaballs-controls').style.display = 'none';
    numBallsControlContainer.classList.toggle('show');
}
function adjustCount(val) {
    //limit = val;
    while (metaballs.numBalls>val) {
        metaballs.removeBall();
    }
    while (metaballs.numBalls<val) {
        metaballs.addBall();
    }

}

// Limit Slider
var limitControlContainer = document.getElementById("limit-control-container");
var limitInput = document.getElementById("limit");
var limitMobile = document.getElementById('limit-mobile');
limitInput.oninput = function() {
    limit = this.value;
    metaballs.update();
}
limitMobile.onclick = function() {
    document.getElementById('mobile-metaballs-controls').style.display = 'none';
    limitControlContainer.classList.toggle('show');
}

// Run Simulation Checkbox
var runSimInput = document.getElementById("toRun");
var runSimMobile = document.getElementById("toRun-mobile");
runSimInput.checked = running;
runSimMobile.dataset.checked = running;
runSimInput.onclick = function() {
    if (!this.checked) {
        this.checked = false;
        runSimMobile.dataset.checked = false;
        runSimMobile.classList.toggle("metaballs-checkbox-on");
        running = false;
    } else {
        this.checked = true;
        runSimMobile.dataset.checked = true;
        runSimMobile.classList.toggle("metaballs-checkbox-on");
        running = true;
    }
}
runSimMobile.onclick = function() {
    if (this.dataset.checked == "false") {
        this.dataset.checked = true;
        runSimInput.checked = true;
        this.classList.toggle("metaballs-checkbox-on");
        running = true;
    } else {
        this.dataset.checked = false;
        runSimInput.checked = false;
        this.classList.toggle("metaballs-checkbox-on");
        running = false;
    }
}

// Use Interpolation Checkbox
var toInterpInput = document.getElementById("toInterp");
var toInterpMobile = document.getElementById("toInterp-mobile");
toInterpInput.checked = drawInterp;
toInterpMobile.dataset.checked = drawInterp;
toInterpMobile.classList.toggle("metaballs-checkbox-on");
toInterpInput.onclick = function() {
    if (!this.checked) {
        this.checked = false;
        toInterpMobile.dataset.checked = false;
        toInterpMobile.classList.toggle("metaballs-checkbox-on");
        drawInterp = false;
    } else {
        this.checked = true;
        toInterpMobile.dataset.checked = true;
        toInterpMobile.classList.toggle("metaballs-checkbox-on");
        drawInterp = true;
    }
}
toInterpMobile.onclick = function() {
    if (this.dataset.checked == "false") {
        this.dataset.checked = true;
        toInterpInput.checked = true;
        this.classList.toggle("metaballs-checkbox-on");
        drawInterp = true;
    } else {
        this.dataset.checked = false;
        toInterpInput.checked = false;
        this.classList.toggle("metaballs-checkbox-on");
        drawInterp = false;
    }
}

// Draw Circles Checkbox
var drawCircsInput = document.getElementById("toShowCircs");
var drawCircsMobile = document.getElementById("toShowCircs-mobile");
drawCircsInput.checked = drawOrigCircles;
drawCircsMobile.dataset.checked = drawOrigCircles;
drawCircsInput.onclick = function() {
    if (!this.checked) {
        this.checked = false;
        drawCircsMobile.dataset.checked = false;
        drawCircsMobile.classList.toggle("metaballs-checkbox-on");
        drawOrigCircles = false;
    } else {
        this.checked = true;
        drawCircsMobile.dataset.checked = true;
        drawCircsMobile.classList.toggle("metaballs-checkbox-on");
        drawOrigCircles = true;
    }
}
drawCircsMobile.onclick = function() {
    if (this.dataset.checked == "false") {
        this.dataset.checked = true;
        drawCircsInput.checked = true;
        this.classList.toggle("metaballs-checkbox-on");
        drawOrigCircles= true;
        
    } else {
        this.dataset.checked = false;
        drawCircsInput.checked = false;
        this.classList.toggle("metaballs-checkbox-on");
        drawOrigCircles = false;
    }
    console.log(this.classList);
}

// Draw Grid Checkbox
var drawGridInput = document.getElementById("toShowGrid");
var drawGridMobile = document.getElementById("toShowGrid-mobile");
drawGridInput.checked = drawGrid;
drawGridMobile.dataset.checked = drawGrid;
drawGridInput.onclick = function() {
    if (!this.checked) {
        this.checked = false;
        drawGridMobile.dataset.checked = false;
        drawGridMobile.classList.toggle("metaballs-checkbox-on");
        drawGrid = false;
    } else {
        this.checked = true;
        drawGridMobile.dataset.checked = true;
        drawGridMobile.classList.toggle("metaballs-checkbox-on");
        drawGrid = true;
    }
}
drawGridMobile.onclick = function() {
    if (this.dataset.checked == "false") {
        this.dataset.checked = true;
        drawGridInput.checked = true;
        this.classList.toggle("metaballs-checkbox-on");
        drawGrid = true;
    } else {
        this.dataset.checked = false;
        drawGridInput.checked = false;
        this.classList.toggle("metaballs-checkbox-on");
        drawGrid = false;
    }
}

// ---------- End Input Handling ---------- //


