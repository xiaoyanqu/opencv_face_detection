const cv = require('../opencvJs/asm/opencv.js');

module.exports.initModels = function() {
  cv.FS_createLazyFile('/', 
                       'haarcascade_frontalface_default.xml', 
                       '../assets/haarcascade_frontalface_default.xml', 
                       true, 
                       false);
  cv.FS_createLazyFile('/', 
                      'lbpcascade_frontalface.xml', 
                      '../assets/lbpcascade_frontalface.xml', 
                      true, 
                      false);
}

module.exports.loadClassifier = function(which) {
  let clf = new cv.CascadeClassifier();
  
  if (which == 'haar') {
    clf.load('haarcascade_frontalface_default.xml');
  }
  else if (which == 'lbp') {
    clf.load('lbpcascade_frontalface.xml');
  }
  else {;}
  
  return clf;
}

module.exports.builtin_face_detection = function(clf, raw_data) {
  // unpack raw_data
  var src = cv.matFromImageData(raw_data);
  var height = raw_data.height;
  var width = raw_data.width;
  // convert to gray
  let gray = new cv.Mat(height, width, cv.CV_8UC1);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  // detect and draw box around face
  let faces = new cv.RectVector();
  let X = [];
  let Y = [];
  let W = [];
  let H = [];
  // detect
  clf.detectMultiScale(src, faces);
  // collect detected faces info for evaluation
  for (let i = 0; i < faces.size(); ++i) { // WHY new faces can be indexed as such?
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      X.push(faces.get(i).x);
      Y.push(faces.get(i).y);
      W.push(faces.get(i).width);
      H.push(faces.get(i).height);
      
      // draw boxes around faces on src
      // let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      // 
      // let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
      //                           faces.get(i).y + faces.get(i).height);
      // cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      
      roiGray.delete(); 
      roiSrc.delete();
  }
  console.log(faces.size() + "\tface detected");
  gray.delete(); 
  src.delete();
  return {num : faces.size(),
          X : X,
          Y : Y,
          W : W,
          H : H,
          score : 1.000
        };
  // return src;
}

// cool contour sample 
module.exports.contour = function(raw_data) {
  var src = cv.matFromImageData(raw_data);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY); // Convert to grayscale
  dst = new cv.Mat();
  cv.Canny(src, dst, 50, 150);
  cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA); // Convert back to RGBA to display
  return dst;
}
