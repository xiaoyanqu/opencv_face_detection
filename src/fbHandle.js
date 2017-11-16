const utils = require('./utils.js');
const models = require('./models.js');

module.exports.handle = function(model, req, res) {
  var faceCascade;
  if (model == 'haar') {
    handleHaar(req, res);
  }
  else if (model == 'lbp') {
    handleLbp(req, res);
  }
  else if (model == 'dnn') {
    ;
  }
  else if (model == 'cool') {
    handleCool(req, res);
  }
  else {;}
}

handleHaar = function(req, res) {
  // prepare input image
  var raw_data = utils.loadImages();
  // prepare classifier
  faceCascade = models.loadClassifier('haar');
  // detect and draw box around face
  var dst = models.builtin_face_detection(faceCascade, raw_data);
  // reformat output
  var jpeg_data = utils.encode2image(dst);
  // response
  res.end(jpeg_data.data);
}

handleLbp = function(req, res) {  
  // prepare input image
  var raw_data = utils.loadImages();
  // prepare classifier
  faceCascade = models.loadClassifier('lbp');
  // detect and draw box around face
  var dst = models.builtin_face_detection(faceCascade, raw_data);
  // reformat output
  var jpeg_data = utils.encode2image(dst);
  // response
  res.end(jpeg_data.data);
}

handleDnn = function(req, res) {
  ;
}

handleCool = function(req, res) {
  var raw_data = utils.loadImages();
  var dst = models.contour(raw_data);
  var jpeg_data = utils.encode2image(dst);
  res.end(jpeg_data.data);
}
