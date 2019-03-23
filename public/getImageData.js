var imageScaleFactor = 0.5;
var outputStride = 16;
var flipHorizontal = false;

var imageElement = document.getElementById('img1');


posenet.load().then(function (net) {
	return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
}).then(function (pose) {
	console.log(pose);
});