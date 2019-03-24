var streaming = false,
    video = document.querySelector('#video'),
    canvas = document.querySelector('#canvas'),
    photo = document.querySelector('#photo'),
    startbutton = document.querySelector('#startbutton'),
    mainImage = document.querySelector('#img1'),
    width = 512,
    height = 0;

var patata = 0;


var images = ['images/man31.jpg', '/images/man.jpg', '/images/images.jpg', '/images/images.jpg'];

var point = 0;

setInterval(function () {
    takepicture();

}, 1000);

async function takepicture() {
    patata = 0;
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
        //console.log(pose_user, pose_default);
        compareTwoPoses(pose_user, pose_default);
    })
}

async function haveAllTwoPositions(pose_user) {
    var imgDeft = document.getElementById('img1');
    posenet.load().then(async function (net) {
        return await net.estimateSinglePose(imgDeft, imageScaleFactor, flipHorizontal, outputStride)
    }).then(function (pose2) {
        getData(pose_user, pose2);
    })
}

function compareTwoPoses(pose_user, pose_default) {
    if (pose_default.keypoints[9].score && pose_default.keypoints[10].score > 0.7) {
        console.log("Arms");
        arms(pose_user, pose_default);

        if (pose_default.keypoints[15].score && pose_default.keypoints[16].score > 0.7) {
            console.log("Legs");
            legs(pose_user, pose_default);
        }
    }
}

function arms(pose_user, pose_default) {
    var left_default_angle = getAngle(
        getDistance(pose_default.keypoints[6].position, pose_default.keypoints[10].position),
        getDistance(pose_default.keypoints[6].position, pose_default.keypoints[8].position),
        getDistance(pose_default.keypoints[8].position, pose_default.keypoints[10].position)
    );
    var left_user_angle = getAngle(
        getDistance(pose_user.keypoints[6].position, pose_user.keypoints[10].position),
        getDistance(pose_user.keypoints[6].position, pose_user.keypoints[8].position),
        getDistance(pose_user.keypoints[8].position, pose_user.keypoints[10].position)
    );
    var right_default_angle = getAngle(
        getDistance(pose_default.keypoints[5].position, pose_default.keypoints[9].position),
        getDistance(pose_default.keypoints[5].position, pose_default.keypoints[7].position),
        getDistance(pose_default.keypoints[7].position, pose_default.keypoints[9].position)
    );
    var right_user_angle = getAngle(
        getDistance(pose_user.keypoints[5].position, pose_user.keypoints[9].position),
        getDistance(pose_user.keypoints[5].position, pose_user.keypoints[7].position),
        getDistance(pose_user.keypoints[7].position, pose_user.keypoints[9].position)
    );
    var left_correctnes = Math.abs(left_default_angle - left_user_angle);
    var right_correctnes = Math.abs(right_default_angle - right_user_angle);
    console.log(pose_default);
    console.log(pose_user);
    var correctnes = ((left_correctnes + right_correctnes));
    console.log('Diferencia' + correctnes);
    if (correctnes < 20) {
        patata += 1;
        nextImage();
    }

}

function legs(pose_user, pose_default) {
    var left_default_angle = getAngle(
        getDistance(pose_default.keypoints[12].position, pose_default.keypoints[16].position),
        getDistance(pose_default.keypoints[12].position, pose_default.keypoints[14].position),
        getDistance(pose_default.keypoints[14].position, pose_default.keypoints[16].position)
    );
    var left_user_angle = getAngle(
        getDistance(pose_user.keypoints[12].position, pose_user.keypoints[16].position),
        getDistance(pose_user.keypoints[12].position, pose_user.keypoints[14].position),
        getDistance(pose_user.keypoints[14].position, pose_user.keypoints[16].position)
    );
    var right_default_angle = getAngle(
        getDistance(pose_default.keypoints[11].position, pose_default.keypoints[15].position),
        getDistance(pose_default.keypoints[11].position, pose_default.keypoints[13].position),
        getDistance(pose_default.keypoints[13].position, pose_default.keypoints[15].position)
    );
    var right_user_angle = getAngle(
        getDistance(pose_user.keypoints[11].position, pose_user.keypoints[15].position),
        getDistance(pose_user.keypoints[11].position, pose_user.keypoints[13].position),
        getDistance(pose_user.keypoints[13].position, pose_user.keypoints[15].position)
    );
    var left_correctnes = Math.abs(left_default_angle - left_user_angle);
    var right_correctnes = Math.abs(right_default_angle - right_user_angle);
    var correctnes = ((left_correctnes + right_correctnes) / 2);
    console.log('Diferencia piernas' + correctnes);

    if (correctnes < 10) {
        if (patata !== 1) {
            nextImage();
        }
    }

}

function nextImage() {
    point += 1;
    if (point === images.length) {
        window.location.href = "/final";
    }
    var bar = document.querySelector('#progress-bar');
    bar.setAttribute('value', bar.value + 20);
    mainImage.setAttribute('src', images[point]);
}

function getAngle(distance_opuesta, distance_B, distance_C) {
    var x = Math.pow(distance_B, 2) + Math.pow(distance_C, 2) - Math.pow(distance_opuesta, 2);
    var z = 2 * distance_B * distance_C;
    return Math.acos(x / z) * 180 / Math.PI;
    /* A = arccos ((b^2 + c^2 - a^2)/2bc)*/
}

function getDistance(a, b) {
    return Math.sqrt(Math.abs(a.x - b.x) * Math.abs(a.x - b.x) + Math.abs(a.y - b.y) * Math.abs(a.y - b.y))
}

navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.getMedia(
    {
        video: true,
        audio: false
    },
    function (stream) {
        if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
        } else {
            var vendorURL = window.URL || window.webkitURL;
            video.srcObject = stream;
        }
        video.play();
    },
    function (err) {
        console.log("An error occured! " + err);
    }
);

video.addEventListener('canplay', function (ev) {
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
    }
}, false);

startbutton.addEventListener('click', function (ev) {
    takepicture();
    ev.preventDefault();
}, false);