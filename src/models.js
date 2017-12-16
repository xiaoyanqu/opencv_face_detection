/*
  configure which opencv.js to use
*/ 
const cv = require('../opencvJs/asm/opencv.js');
// const cv = require('../opencvJs/wasm/opencv.js');

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

module.exports.evaluate_builtin_face_detection = function(clf, raw_data) {
  // unpack raw_data
  var src = cv.matFromImageData(raw_data);
  var height = raw_data.height;
  var width = raw_data.width;
  // convert to gray
  let gray = new cv.Mat(height, width, cv.CV_8UC1);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  // detect and draw box around face
  let faces = new cv.RectVector();
  let rejectVect = new cv.IntVector();
  let levelVect = new cv.DoubleVector();
  let X = [];
  let Y = [];
  let W = [];
  let H = [];
  let S = [];
  // detect with confidence score
  clf.detectMultiScale3(src, faces, rejectVect, levelVect, 1.1, 3, 0, {width:0, height:0}, {width:0, height:0}, true);
  // collect detected faces info for evaluation
  for (let i = 0; i < faces.size(); ++i) { // WHY new faces can be indexed as such?
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      X.push(faces.get(i).x);
      Y.push(faces.get(i).y);
      W.push(faces.get(i).width);
      H.push(faces.get(i).height);
      S.push(rejectVect.get(i)); // these cv dataStruct cannot be recognized when output directly
      roiGray.delete(); 
      roiSrc.delete();
  }
  console.log(faces.size() + "\tface detected");
  gray.delete(); 
  src.delete();
  return {N : faces.size(),
          X : X,
          Y : Y,
          W : W,
          H : H,
          S : S
        };
}

module.exports.show_builtin_face_detection = function(clf, raw_data) {
  // unpack raw_data
  var src = cv.matFromImageData(raw_data);
  var height = raw_data.height;
  var width = raw_data.width;
  // convert to gray
  let gray = new cv.Mat(height, width, cv.CV_8UC1);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  // detect and draw box around face
  let faces = new cv.RectVector();
  // detect
  clf.detectMultiScale(src, faces);
  // collect detected faces info for evaluation
  for (let i = 0; i < faces.size(); ++i) { // WHY new faces can be indexed as such?
      let roiGray = gray.roi(faces.get(i));
      let roiSrc = src.roi(faces.get(i));
      let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      
      let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                                faces.get(i).y + faces.get(i).height);
      // draw boxes around faces on src                          
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      roiGray.delete(); 
      roiSrc.delete();
  }
  console.log(faces.size() + "\tface detected");
  gray.delete(); 
  faces.delete();
  return src;
}