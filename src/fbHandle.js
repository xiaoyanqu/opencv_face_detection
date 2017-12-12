const utils = require('./utils.js');
const models = require('./models.js');
// const dnn = require('./dnn/dnn.js');

// preload the images and initialize the models before server starts
var preload = Date.now();
var data = utils.loadImages();
var raw_imgs = data['raw_data_list'];
var raw_list_size = raw_imgs.length;
var img_path_list = data['img_path_list'];
var postload = Date.now();
console.log(raw_list_size + " images loaded! Time taken: " + (postload - preload) + " ms.");

models.initModels();
console.log("Haar/Lbp classifier loaded!.");


module.exports.runPerf = function(model, req, res) {
  if (model == 'haar') {
    runHaar(req, res);
  }
  else if (model == 'lbp') {
    runLbp(req, res);
  }
  else if (model == 'dnn') {
    runDnn(req, res);
  }
  else {;}
}

runHaar = function(req, res) {
  // prepare classifier
  var faceCascade = models.loadClassifier('haar');
  // prepare response
  res.setHeader('Content-Type', 'text/event-stream');
  // prepare local evalution file 
  // TODO : use img_path_list to create directory where each source dir maps to a output report dir
  evalFilePath = utils.create_evaluationFile("../assets/evaluation/WIDER_small/eval.txt");
  // start timing it
  var now = Date.now();
  for (var i = 0; i < raw_list_size; ++i) {
    var facesMeta = models.evaluate_builtin_face_detection(faceCascade, raw_imgs[i]);
    var then = Date.now();
    // console.log(facesMeta);
    utils.append_evaluationEntry(facesMeta, img_path_list[i], evalFilePath); 
    // img_path_list[i] -> path of each image
    if ((i + 1) % 10 == 0) { // reach the 10s point
      res.write(utils.getOutput(then - now, i, raw_list_size));
      res.flushHeaders();
      now = then;
    }
  }
  // finish up
  if (then == now) {
    res.end();
  } else {
    res.end(utils.getOutput(then - now, raw_list_size - 1, raw_list_size));
  }
}

runLbp = function(req, res) {
  // prepare classifier
  var faceCascade = models.loadClassifier('lbp');
  // prepare response
  res.setHeader('Content-Type', 'text/event-stream');
  // start timing it
  var now = Date.now();
  for (var i = 0; i < raw_list_size; ++i) {
    var facesMeta = models.evaluate_builtin_face_detection(faceCascade, raw_imgs[i]);
    var then = Date.now();
    if ((i + 1) % 10 == 0) { // reach the 10s point
      res.write(utils.getOutput(then - now, i, raw_list_size));
      res.flushHeaders();
      now = then;
    }
  }
  // finish up
  if (then == now) {
    res.end();
  } else {
    res.end(utils.getOutput(then - now, raw_list_size - 1, raw_list_size));
  }
}

runDnn = function(req, res) {
  ;
}

module.exports.showExample = function(model, req, res) {
  if (model == 'haar') {
    showHaar(req, res);
  }
  else if (model == 'lbp') {
    showLbp(req, res);
  }
  else if (model == 'dnn') {
    showDnn(req, res);
  }
  else {;}
}



showHaar = function(req, res) {
  // prepare classifier
  var faceCascade = models.loadClassifier('haar');
  // detect and draw box around face
  var dst = models.show_builtin_face_detection(faceCascade, raw_imgs[0]);
  // reformat output
  var jpeg_data = utils.encode2image(dst);
  // response
  res.end(jpeg_data.data);
}

showLbp = function(req, res) {
  // prepare classifier
  var faceCascade = models.loadClassifier('lbp');
  // detect and draw box around face
  var dst = models.show_builtin_face_detection(faceCascade, raw_imgs[0]);
  // reformat output
  var jpeg_data = utils.encode2image(dst);
  // response
  res.end(jpeg_data.data);
}

showDnn = function(req, res) {
  ;
}