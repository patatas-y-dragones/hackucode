async function takepicture() {
	canvas.width = width;
	canvas.height = height;
	canvas.getContext('2d').drawImage(video, 0, 0, width, height);
	var data = canvas.toDataURL('image/png');
	photo = document.getElementById('photo');
	photo.setAttribute('src', data);
	haveAllTwoPositions(photo);
}

function getData(image, pose_default) {
	var imageScaleFactor = 0.5;
	var outputStride = 8;
	var flipHorizontal = false;
	posenet.load().then(async function (net) {
		return await net.estimateSinglePose(image, imageScaleFactor, flipHorizontal, outputStride)
	}).then(function (pose_user) {
		console.log(pose_user, pose_default);
		compareTwoPoses(pose_user, pose_default);
	})
}

async function haveAllTwoPositions(pose_user) {
	var imgDeft = document.getElementById('img1');
	posenet.load().then(async function (net) {
		return await net.estimateSinglePose(imgDeft, imageScaleFactor, flipHorizontal, outputStride)
	}).then(function(pose2){
		getData(pose_user, pose2);
	})
}

function compareTwoPoses(pose_user, pose_default) {
	arms(pose_user, pose_default);
}

function arms(pose_user, pose_default) {
	var left_default_angle = getAngle(
		getDistance(pose_default.keypoints[6].position,pose_default.keypoints[10].position),
		getDistance(pose_default.keypoints[6].position,pose_default.keypoints[8].position),
		getDistance(pose_default.keypoints[8].position,pose_default.keypoints[10].position)
	);
	var left_user_angle = getAngle(
		getDistance(pose_user.keypoints[6].position,pose_user.keypoints[10].position),
		getDistance(pose_user.keypoints[6].position,pose_user.keypoints[8].position),
		getDistance(pose_user.keypoints[8].position,pose_user.keypoints[10].position)
	);
	var right_default_angle = getAngle(
		getDistance(pose_default.keypoints[5].position,pose_default.keypoints[9].position),
		getDistance(pose_default.keypoints[5].position,pose_default.keypoints[7].position),
		getDistance(pose_default.keypoints[7].position,pose_default.keypoints[9].position)
	);
	var right_user_angle = getAngle(
		getDistance(pose_user.keypoints[5].position,pose_user.keypoints[9].position),
		getDistance(pose_user.keypoints[5].position,pose_user.keypoints[7].position),
		getDistance(pose_user.keypoints[7].position,pose_user.keypoints[9].position)
	);
	console.log("left def angle: " + left_default_angle);
	console.log("left user angle: " + left_user_angle);
	var left_correctnes = Math.abs(left_default_angle - left_user_angle);
	var right_correctnes = Math.abs(right_default_angle - right_user_angle);
	var correctnes = ((left_correctnes + right_correctnes)/2) > 10 ? 0 : 10 -((left_correctnes + right_correctnes)/2);
	console.log("correctnes: " + correctnes);
	console.log("right def angle: " + right_default_angle);
	console.log("right user angle: " + right_user_angle);
	M.toast({html: 'I am a toast!'})
	
}

function getAngle(distance_opuesta, distance_B, distance_C) {
	var x = Math.pow(distance_B, 2) + Math.pow(distance_C, 2) - Math.pow(distance_opuesta, 2);
	var z = 2 * distance_B * distance_C;
	return Math.acos(x/z) * 180 / Math.PI;
	/* A = arccos ((b^2 + c^2 - a^2)/2bc)*/
}

function getDistance(a, b) {
	return Math.sqrt(Math.abs(a.x - b.x)*Math.abs(a.x - b.x) + Math.abs(a.y - b.y)*Math.abs(a.y - b.y))
}

function comparePartOfBody(pose_user, pose_default){
	if (pose_default.score > 0.75 && pose_user.score > 0.75){
		console.log("Part: " + pose_user.part);
		console.log("User x: " + pose_user.position.x);
		console.log("User y: " + pose_user.position.y);
		console.log("Default x: " + pose_default.position.x);
		console.log("Default y: " + pose_default.position.y);
	}
}