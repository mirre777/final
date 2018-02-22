function setup() {
	createCanvas(window.innerWidth, window.innerHeight, WEBGL);
}

function draw() {
	background(100);

	fill('rgba(20, 50, 150, 0.25)');
    strokeWeight(4);
    stroke(255, 204, 0);
	push();
	translate(-275, 175, -200);
	rotateY(frameCount * 0.05);
	rotateX(frameCount * -0.01);
    rotateZ(frameCount* 0.035);
	box(100);
	pop();

	fill('white');
	stroke(255);
	push();
	translate(500, height*0.25, -400);
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
	torus(300);
	pop();
}
