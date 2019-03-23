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
			getData(pose_user, pose2)
		})
	}

	function compareTwoPoses(pose_user, pose_default) {
		var i;
		for(i = 0; i < 17; i++) {
			comparePartOfBody(pose_user.keypoints[i],pose_default.keypoints[i])
		}
		console.log(pose_user.keypoints);
	}
	
	function comparePartOfBody(pose_user, pose_default){
		if (pose_default.score > 0.75 && pose_user.score > 0.75){
			if (pose_default.score - pose_user.score < 0.05){
				console.log(pose_user);
			}
		} 
	}
	
	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
	
})();