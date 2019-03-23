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
		getData(photo);
	}
	
	function getData(image) {
		posenet.load().then(function (net) {
			return net.estimateSinglePose(image, imageScaleFactor, flipHorizontal, outputStride)
		}).then(function (pose) {
			haveAllTwoPositions(pose);
		})
	}

	function haveAllTwoPositions(pose_user) {
		var imgDeft = document.getElementById('img1');
		posenet.load().then(function (net) {
			return net.estimateSinglePose(imgDeft, imageScaleFactor, flipHorizontal, outputStride)
		}).then(function(pose2){
			console.log(pose_user, pose2);
			compareTwoPoses(pose_user, pose2);
		})
	}

	function compareTwoPoses(pose_user, pose_default) {
		var i;
		for(i = 0; i < 17; i++) {
			comparePartOfBody(pose_user.keypoints[i],pose_default.keypoints[i])
		}
		console.log(poser_user.keypoints);
	}
	
	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
	
})();