let video;
let poseNet;
let poses = [];
let skeletons = [];
var NodeWebcam = require( "node-webcam" );

var FSWebcam = NodeWebcam.FSWebcam; //require( "node-webcam/webcams/FSWebcam" );

var opts = {};

var cam = new FSWebcam( opts );
function setup() {
	createCanvas(640, 480);

	
	poseNet = ml5.poseNet(video, modelReady);
	poseNet.on('pose', function (results) {
		poses = results;
	});
}

function modelReady() {
	select('#status').html('Model Loaded');
}

function draw() {
	image(video, 0, 0, width, height);
	
	// We can call both functions to draw all keypoints and the skeletons
	drawKeypoints();
	drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
	// Loop through all the poses detected
	for (let i = 0; i < poses.length; i++) {
		// For each pose detected, loop through all the keypoints
		for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
			// A keypoint is an object describing a body part (like rightArm or leftShoulder)
			let keypoint = poses[i].pose.keypoints[j];
			// Only draw an ellipse is the pose probability is bigger than 0.2
			if (keypoint.score > 0.2) {
				fill(255, 0, 0);
				noStroke();
				ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
			}
		}
	}
}

// A function to draw the skeletons
function drawSkeleton() {
	// Loop through all the skeletons detected
	for (let i = 0; i < poses.length; i++) {
		// For every skeleton, loop through all body connections
		for (let j = 0; j < poses[i].skeleton.length; j++) {
			let partA = poses[i].skeleton[j][0];
			let partB = poses[i].skeleton[j][1];
			stroke(255, 0, 0);
			line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
		}
	}
}