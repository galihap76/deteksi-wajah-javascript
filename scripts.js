let video = document.getElementById('video');

url = 'https://galihap76.github.io/deteksi-wajah-javascript.github.io/';

fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    }
  })
  .then(function() {
    Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/deteksi-wajah-javascript.github.io'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/deteksi-wajah-javascript.github.io'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/deteksi-wajah-javascript.github.io'),
  faceapi.nets.faceExpressionNet.loadFromUri('/deteksi-wajah-javascript.github.io')
]).then(startVideo)
  }).catch(function() {
    console.log('Mengalami kegagalan!');
  });


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
