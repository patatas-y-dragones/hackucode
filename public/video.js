var posep;
(function() {
	
	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		photo        = document.querySelector('#photo'),
		startbutton  = document.querySelector('#startbutton'),
		width = 320,
		height = 0;
	
	navigator.getMedia = ( navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);
	
	navigator.getMedia(
		{
			video: true,
			audio: false
		},
		function(stream) {
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.srcObject = stream;
			}
			video.play();
		},
		function(err) {
			console.log("An error occured! " + err);
		}
	);
	
	video.addEventListener('canplay', function(ev){
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);
	
	async function takepicture() {
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = canvas.toDataURL('image/png');
		var photo = document.getElementById('photo');
		photo.setAttribute('src', data);
		haveAllTwoPositions(photo);
	}
	
	function getData(image, pose_default) {
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
		var i;
		arms(pose_user, pose_default);
		console.log(pose_user.keypoints);
	}
	function arms(pose_user, pose_default) {

	}
	function getAngle(distance_opuesta, distance_B, distance_C) {
		return Math.acos((distance_B * distance_B + distance_C*distance_C - 2*distance_B*distance_C)/distance_opuesta);		
	}
	function getDistance(a, b) {
		return sqrt(Math.abs(a.x - b.x)*Math.abs(a.x - b.x) + Math.abs(a.y - b.y)*Math.abs(a.y - b.y))
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
	
	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
	
})();