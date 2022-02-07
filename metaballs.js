// ---------- Start Metaballs ---------- //
class Metaball {
    constructor() {
        var minR = 30, maxR = 100;  // min and max radius
        var maxV = 1; // vax velocity
        this.r = Math.floor(Math.random()*(maxR-minR))+minR; // radius
        var randx = Math.floor(Math.random()*(size.width-(2*this.r)))+this.r;
        var randy = Math.floor(Math.random()*(size.height-(2*this.r)))+this.r; 
        this.pos = {x:randx,y:randy};
        this.vel = {x:Math.random()*2*maxV-maxV,y:Math.random()*2*maxV-maxV};
    }

    component (x,y) {
        var r = this.r;
        var dx = (x-this.pos.x);
        var dy = (y-this.pos.y);
        return ((r*r)/((dx*dx)+(dy*dy))) || 0
    };

    collision () {
        var px = this.pos.x;
        var py = this.pos.y;
        var vx = this.vel.x;
        var vy = this.vel.y;
        var r = this.r;
        // x-axis bounce
        if (px+vx+r>=size.width || px+vx-r<=0) {
            this.vel.x = vx * (-1);
        }
        // y-axis bounce
        if (py+vy+r>=size.height || py+vy-r<=0) {
            this.vel.y = vy * (-1);
        }
    }

    update() {
        if (running) {
            this.collision();
            var vx = this.vel.x;
            var vy = this.vel.y;
            this.pos.x += vx;
            this.pos.y += vy;
        }
    }

}


class Metaball_Collection {
    constructor(n) {
        this.numBalls=n;
        this.balls=[];
        for(var i=0; i<n; i++) {
            this.balls.push(new Metaball);
        }
        this.truthy = [];
    }

    addBall() {
        this.balls.push(new Metaball);
        this.numBalls++;
    }

    removeBall() {
        this.balls.pop();
        this.numBalls--;
    }

    sumComponents (x,y) {
        var sum = 0;
        this.balls.forEach(ball=>sum+=ball.component(x,y))
        return sum;
    }

    update () {
        this.balls.forEach(ball=>ball.update());
        this.updateTruthArr();
        this.getCellTypes();
        this.drawBasicMarchingSquares();

        if (drawOrigCircles) {
            // draw actual circles
            metaballs.balls.forEach(ball=>{drawCircle(ball.pos.x,ball.pos.y,ball.r)})
        }
    }

    updateTruthArr() {
        this.truthy = [];
        var temp = [];
        for (var j=0; j<size.height; j+=res) {
            for (var i=0; i<size.width; i+=res) { 
                if (metaballs.sumComponents(i,j)>=limit) {
                    temp.push(1);
                } else {
                    temp.push(0);
                }
            }
            this.truthy.push(temp);
            temp = [];
        }
        //console.log(this.truthy);
        return this.truthy;
    }

    getCellTypes() {
        this.types = [];
        var temp = [];
        for (var j=0; j<this.truthy.length-1; j++) {
            for (var i=0; i<this.truthy[0].length-1; i++) { 
                //console.log(this.truthy[j][i]);
                temp.push(`0b${this.truthy[j][i]}${this.truthy[j][i+1]}${this.truthy[j+1][i]}${this.truthy[j+1][i+1]}`);
            }
            this.types.push(temp);
            temp = [];
        }
    }

    interpX(x1,x2,y) {
        return (x2-x1)*((limit-this.sumComponents(x1,y))/(this.sumComponents(x2,y)-this.sumComponents(x1,y)))
    }
    interpY(y1,y2,x) {
        return (y2-y1)*((limit-this.sumComponents(x,y1))/(this.sumComponents(x,y2)-this.sumComponents(x,y1)))
    }

    drawBasicMarchingSquares() {
        if (drawMarchingSquares) {
            //strokeWeight(1.5);
            //stroke(255,255,255);
            var mx = 0.5;
            var my = 0.5;
            var mx1=0.5;
            var mx2=0.5;
            var my1=0.5;
            var my2=0.5;
            var r = 50;
            var g = 50;
            var b = 50;
            var color, dist, maxdist, cmap;
            for (var j=0; j<this.types.length; j++) {
                for (var i=0; i<=this.types[0].length; i++) {
                    if (this.types[j][i] != '0b0000' && this.types[j][i] != '0b1111') {  //0:NW, 1:NE, 2:SW, 3:SE)
                        maxdist = Math.sqrt((size.width/2)**2 + (size.height/2)**2);
                        dist =  Math.sqrt(((res*i)-size.width/2)**2 + ((res*j)-size.height/2)**2);
                        cmap = dist/(maxdist);
                        g = Math.floor((cmap)*255)
                        b = Math.floor((1-cmap)*255)
                        // g = Math.floor((1-(res*i)/size.width)*255)
                        // b = Math.floor((res*i)/size.width*255)
                        color = rgbToHex(r,g,b);

                        if (this.types[j][i] === '0b1000' || 
                            this.types[j][i] === '0b0111' || 
                            this.types[j][i] === '0b0110') {
                            if (drawInterp) {
                                mx = this.interpX(res*i,res*(i+1),res*j)/res;
                                my = this.interpY(res*j,res*(j+1),res*i)/res;
                            }
                            drawLine(res*i,res*(j+my),res*(i+mx),res*j,color); 
                        }
                        if (this.types[j][i] === '0b0100' ||
                            this.types[j][i] === '0b1011' ||
                            this.types[j][i] === '0b1001') {
                            if (drawInterp) {
                                mx = this.interpX(res*i,res*(i+1),res*j)/res;
                                my = this.interpY(res*j,res*(j+1),res*(i+1))/res;
                            }
                            drawLine(res*(i+mx),res*j,res*(i+1),res*(j+my),color); 
                        }
                        if (this.types[j][i] === '0b0010' ||
                            this.types[j][i] === '0b1101' ||
                            this.types[j][i] === '0b1001') {
                            if (drawInterp) {
                                mx = this.interpX(res*i,res*(i+1),res*(j+1))/res;
                                my = this.interpY(res*j,res*(j+1),res*(i))/res;    
                            }
                            drawLine(res*i,res*(j+my),res*(i+mx),res*(j+1),color); 
                        }
                        if (this.types[j][i] === '0b0001' ||
                            this.types[j][i] === '0b1110' ||
                            this.types[j][i] === '0b0110') {
                            if (drawInterp) {
                                mx = this.interpX(res*i,res*(i+1),res*(j+1))/res;
                                my = this.interpY(res*j,res*(j+1),res*(i+1))/res; 
                            }
                            drawLine(res*(i+mx),res*(j+1),res*(i+1),res*(j+my),color); 
                        }
                        if (this.types[j][i] === '0b0011' || 
                            this.types[j][i] === '0b1100') {
                            if (drawInterp) {
                                my1 = this.interpY(res*j,res*(j+1),res*i)/res;
                                my2 = this.interpY(res*j,res*(j+1),res*(i+1))/res;
                            }
                            drawLine(res*i,res*(j+my1),res*(i+1),res*(j+my2),color); 
                        }
                        if (this.types[j][i] === '0b0101' ||
                            this.types[j][i] === '0b1010') {
                            if (drawInterp) {
                                mx1 = this.interpX(res*i,res*(i+1),res*j)/res;
                                mx2 = this.interpX(res*i,res*(i+1),res*(j+1))/res;        
                            }
                            drawLine(res*(i+mx1),res*j,res*(i+mx2),res*(j+1),color);
                        }
                    }
                    if (drawGrid && res>=4) { // grid vertical
                        drawVLine(i*res);
                    }
                }
                if (drawGrid && res>=4) { // grid vertical
                    drawHLine(j*res);
                }
            }
        }
    }
}
// ---------- End Metaballs ----------//