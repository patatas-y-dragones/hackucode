var score = 0;
	
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
	
	async function loadVideo() {
		const video = await setupCamera();
		video.play();
		
		return video;
	}
	
	async function setupCamera() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw new Error(
				'Browser API navigator.mediaDevices.getUserMedia not available');
		}
		
		const video = document.getElementById('video');
		
		const stream = await navigator.mediaDevices.getUserMedia({
			'audio': false,
			'video': {
				facingMode: 'user',
			},
		});
		video.srcObject = stream;
		
		return new Promise((resolve) => {
			video.onloadedmetadata = () => {
				resolve(video);
			};
		});
	}
	
	video.addEventListener('canplay', function(ev){
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);
	
	async function bindPage() {
		// Load the PoseNet model weights with architecture 0.75
		const net = await posenet.load(0.75);
		
		let video;
		
		try {
			video = await loadVideo();
		} catch (e) {
			/*let info = document.getElementById('info');
			info.textContent = 'this browser does not support video capture,' +
				'or this device does not have a camera';
			info.style.display = 'block';*/
			throw e;
		}
		
		//detectPoseInRealTime(video, net);
	}
	
	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);
	bindPage();
