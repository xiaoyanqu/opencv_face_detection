const cv = require('../opencvJs/asm/opencv.js');
const fs = require('fs');
const jpeg = require('jpeg-js');

module.exports.haarHandle = function(req, res) {
  // prepare classifier
  cv.FS_createLazyFile('/', 
                       'haarcascade_frontalface_default.xml', 
                       '../assets/haarcascade_frontalface_default.xml', 
                       true, 
                       false);
  let faceCascade = new cv.CascadeClassifier();
  faceCascade.load('haarcascade_frontalface_default.xml');
  // prepare input image
  var filepath = '../assets/data/WIDER_val/images/0--Parade/0_Parade_Parade_0_102.jpg';  
  var jpeg_data = fs.readFileSync(filepath);
  var raw_data = jpeg.decode(jpeg_data);
  var src = cv.matFromImageData(raw_data);
  console.log(src) // WHY this is cv.Mat[]
  var dst;
  haarCore(faceCascade, src, raw_data.height, raw_data.width, function(data) {
    dst = data
  })
  faceCascade.delete();
  // reformat output
  raw_data = { data: dst.data, width: dst.size().width, height: dst.size().height };
  jpeg_data = jpeg.encode(raw_data, 50);
  res.end(jpeg_data.data);
}

haarCore = function(clf, src, height, width, callback) {
  let gray = new cv.Mat(height, width, cv.CV_8UC1);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  let faces = new cv.RectVector();
  
  clf.detectMultiScale(src, faces);
  for (let i = 0; i < faces.size(); ++i) { // WHY new faces can be indexed as such?
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      
      console.log("face detected");
      roiGray.delete(); 
      roiSrc.delete();
  }
  gray.delete(); 
  faces.delete(); 
  return callback(src);
}

// cool contour sample 
contour = function(src, callback) {
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY); // Convert to grayscale
  dst = new cv.Mat();
  cv.Canny(src, dst, 50, 150);
  cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA); // Convert back to RGBA to display
  return callback(dst);
}
