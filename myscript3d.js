var flock;


//SETUP_________________________________________

function setup() {
    createCanvas(windowWidth,windowHeight, WEBGL);
    // createP("look at my flock of birds")

//new instance of Flock constructor
    flock = new Flock();
//initial set of boids
    for (var i = 0; i < 20; i++) {
        var b = new Boid(0, 0, 0); //locate in canvas where they are generated
        // var b = new Boid(10, 10, -2000); //locate in canvas where they are generated
        // console.log(' windowWidth: ', windowWidth);
        // console.log('windowHeight: ', windowHeight);
        flock.addBoid(b);
    }
}






//RUN___________________________________________

function draw() {
    background(51)
    flock.run();

}






//ALL RULES_____________________________________

//to the arrayof boids, push a new boid
function mouseClicked() {
    flock.addBoid(new Boid(pmouseX - width/2, pmouseY - height/2));
    // flock.addBoid(new Boid(mouseX, mouseY, -2000));
    console.log('mouse x,y: ', pmouseX, pmouseY);
}
function mouseDragged() {
    flock.addBoid(new Boid(pmouseX - width/2, pmouseY - height/2));
}


//FLOCK_________________________________________

function Flock() {
    this.boids = [];
}

//for each boid until the last boid,
//pass to each individual boid [i], all boids (the entire array)
//(as long as the counter is smaller than the array's length (is last boid because zero-based index)
Flock.prototype.run = function() {
    // console.log('this.boids: ', this.boids);
    for (var i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids);
        // console.log('this.boids: ', this.boids);
    }
}

//adding a new boid to the flock (pushing end of array)
Flock.prototype.addBoid = function(b) {
    this.boids.push(b);
}




//BOID__________________________________________
//boid(s)

function Boid(x,y,z) {
    this.acceleration = createVector(0,0,0);
    this.velocity = createVector(random(-1,1), random(-1,1), random(-1,1));
    // console.log('this.velocity: ', this.velocity);
    this.position = createVector(x,y,z);
    // console.log('this.position: ', this.position);
    this.r = 20.0; //size
    this.maxspeed = 3;
    this.maxforce =  0.05 //max steering force
}

Boid.prototype.run = function(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
}

//adding force to acceleration
Boid.prototype.applyForce = function(force) {
//acceleration is already an empty vector
    this.acceleration.add(force);
}

//ACCELERATION accumulated on three new rules each time
Boid.prototype.flock = function(boids) {

//FORCES
    var separate = this.separate(boids);
    var align = this.align(boids);
    var cohesion = this.cohesion(boids);

//give arbitrary WEIGHT to these forces (by multply)
    separate.mult(1.7);
    align.mult(1.2);
    cohesion.mult(1.2);

//ADD the forces to acceleration
    this.applyForce(separate);
    this.applyForce(align);
    this.applyForce(cohesion);
}




//update, seek, borders, render______________________




//update location
Boid.prototype.update = function() {
//update velocity: add acceleration to velocity
    this.velocity.add(this.acceleration);
//limit velocity(speed)
    this.velocity.limit(this.maxspeed);
//update position: add velocity to position
    this.position.add(this.velocity);
//set acceleratio to 0 each cycle (on creation)
    this.acceleration.mult(0);
}

//seek other boids
Boid.prototype.seek = function(target) {
//target is passed to seek from cohesion

//DESIRED is the magnitude and direction of difference between target and boid position
    var desired = p5.Vector.sub(target,this.position); //vector pointing from location to target
//normalize (magnitude 1) because velocity is based on magnitude. If magnittude is large, speed will be larger too.
    desired.normalize();
//go max speed to target
    desired.mult(this.maxspeed);
//STEER = desired (average velocity of all other boids - boid velocity)
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce); // how quick it can move to others
    return steer;
}

Boid.prototype.render = function() {
//give boid a shape and rotate the front in direction of seek

    var theta = this.velocity.heading() //+ radians(90);
    fill('green');
    stroke(200);
    push();
    translate(this.position.x, this.position.y, this.position.z);
    console.log('this: ', this);
    // rotate(theta);
    rotateX(theta);
    rotateY(theta);
    rotateZ(theta);
    cone(10,80);
    // beginShape();
    // sphere(20);
    // vertex(0, -this.r*8, 1);
    // vertex(-this.r*4, this.r*8, 1);
    // vertex(this.r*4, this.r*8, 1);
    // endShape(CLOSE);
    pop();
}

Boid.prototype.borders = function() {
// console.log('in borders');
//radius has a width and height
    // if (this.position.x < 0) {
    //     this.velocity.x = this.velocity.x * -1;
    //     this.velocity.y = this.velocity.y * -1;
    //     // this.velocity.z = this.velocity.z * -1;
    // }
    // if (this.position.y < 0) {
    //     this.velocity.x = this.velocity.x * -1;
    //     this.velocity.y = this.velocity.y * -1;
    //     // this.velocity.z = this.velocity.z * -1;
    // }
    // if (this.position.x > width) {
    //     this.velocity.x = this.velocity.x * -1;
    //     this.velocity.y = this.velocity.y * -1;
    //     // this.velocity.z = this.velocity.z * -1;
    // }
    // if (this.position.y > height) {
    //     this.velocity.x = this.velocity.x * -1;
    //     this.velocity.y = this.velocity.y * -1;
    //     // this.velocity.z = this.velocity.z * -1;
    // }
    //
    // if (this.position.z > -1) {
    //     this.velocity.z = this.velocity.z *-1;
    //     // this.velocity.x = this.velocity.x * -1;
    //     // this.velocity.y = this.velocity.y * -1;
    // }
    // if (this.position.z < -1000) {
    //     this.velocity.z = this.velocity.z *-1;
    // }
}




//3 RULES: cohesion, alignment, separation_______




//SEPARATION: avoidance (of other boids)
Boid.prototype.separate = function(boids) {
    var desiredseparation = 50.0;
    var steer = createVector(0,0,0);
    var count = 0;
//for every boidin the arraym check if it's TOO CLOSE (closer than 25.0)
    for (var i = 0; i < boids.length; i++) {
//dist(x1,x2,y1,y2)
        var distance = p5.Vector.dist(this.position, boids[i].position);
//distance should be in between 0 (boid's own position) and the desiredseparation value
        if((distance > 0) && distance < desiredseparation) {
            var diff = p5.Vector.sub(this.position, boids[i].position);
            diff.normalize();
//diff = displacement. to get direction, displacement / magnitude(distance in this case)
            diff.div(distance);
//this is steer now
            steer.add(diff);
//track of how many boids are in the array to be bale to get the average later
            count++;
        }
    }
//if there is at least one boid, divide steer (that was passed diff, is direction) by number of boids
//to get average direction
    if (count > 0) {
        steer.div(count);
    }
//steer is a vector with mag and heading
    if (steer.mag() > 0) {
        steer.normalize();
        steer.mult(this.maxspeed);
//subtract own velocity
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
    }
    return steer;
}


//ALIGNMENT: copy steer (magnitude, direction)


Boid.prototype.align = function(boids) {
    var neighbordist = 70;
    var sum = createVector(0,0,0);
    var count = 0;
//for each boid in the system, calculate the distance between this boid and every boid in the array
    for (var i = 0; i < boids.length; i++) {
//1 calculate distance between this boid and each boid in the array
        var distance = p5.Vector.dist(this.position, boids[i].position);
//if the distance between 2 boids i 0 - 50
        if ((distance > 0) && (distance < neighbordist)) {
//add the velocity of each of those boids (in range) to sum
//and count how many were added
            sum.add(boids[i].velocity);
            count++;
        }
    }
//if there is at least one boids
//divide the sum of velocity by number of boids in range
    if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
//sum of velocity of each other boid in range MINUS this boid's velocity
        var steer = p5.Vector.sub(sum, this.veloctiy);
        steer.limit(this.maxforce);
        return steer;
    }
//count 0: no boids, then no steer(ing) towards anything
    else {
        return createVector(0,0,0);
    }
}


//COHESION: copy steer (magnitude, direction)


//calculate steer to go towards average location of group (center)
Boid.prototype.cohesion = function(boids) {
    var neighbordist = 80;
    var sum = createVector(0,0,0);
    var count = 0;
//for each boid in the array check the difference in position between this boid and all other boids in the array
    for (var i = 0; i < boids.length; i++) {
        var distance = p5.Vector.dist(this.position, boids[i].position);
//if the distance between 2 boids i 0 - 50
        if ((distance > 0) && (distance < neighbordist)) {
//add position of each of those boids in range
            sum.add(boids[i].position);
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        return this.seek(sum); //pass average location to seek (steer)
        //seek expects a target parameter (sum: average location of all boids)
    }
    else {
//count 0: no boids, then no steer(ing) towards anything
        return createVector(0,0,0);
    }
}
