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
	
	function takepicture() {
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = canvas.toDataURL('image/png');
		var photo = document.getElementById('photo');
		photo.setAttribute('src', data);
		var pose_user = getData(photo);
		haveAllTwoPositions(pose_user);
	}
	
	function getData(image) {
		posenet.load().then(async function (net) {
			return await net.estimateSinglePose(image, imageScaleFactor, flipHorizontal, outputStride)
		}).then(function (pose) {
			console.log("GETDATA: " + pose);
		})
	}

	function haveAllTwoPositions(pose_user) {
		var imgDeft = document.getElementById('img1');
		console.log("HERE: " + pose_user);
		posenet.load().then(function (net) {
			net.estimateSinglePose(imgDeft, imageScaleFactor, flipHorizontal, outputStride)
		}).then(function(pose2){
			console.log(getData(pose_user), pose2);
			compareTwoPoses(getData(pose_user), pose2);
		})
	}

	function compareTwoPoses(pose_user, pose_default) {
		var i;
		for(i = 0; i < 17; i++) {
			comparePartOfBody(pose_user.keypoints[i],pose_default.keypoints[i])
		}
		console.log(poser_user.keypoints);
	}
	
	function comparePartOfBody(pose_user, pose_default){
		if (pose_default > 0.75){
			if (pose_default - pose_user < 0.05){
				console.log("Correcte");
			}
		} 
	}
	
	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
	
})();