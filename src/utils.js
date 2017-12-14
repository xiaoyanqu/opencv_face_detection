const jpeg = require('jpeg-js');
const fs = require('fs');
const glob = require('glob');
const ps = require('path');

module.exports.loadImages = function(which) {
  var img_filepaths = getImagesFiles(which);
  var raw_list = [];
  for(i=0; i < img_filepaths.length; i++) {
    raw_list.push(load(img_filepaths[i]));
  }
  return {raw_data_list : raw_list,
          img_path_list : img_filepaths
        };
}

load = function(imageFile) {
  var jpeg_data = fs.readFileSync(imageFile);
  var raw_data = jpeg.decode(jpeg_data);
  return raw_data;
}

getImagesFiles = function(which) {
  if (which == 'test') {
    return glob.sync('../assets/data/WIDER_test/*.jpg');
  }
  else if (which == 'small') {
    return glob.sync('../assets/data/WIDER_small' + '/**/*.jpg');
  }
  else {
    console.log("No corresponding images found.");
  }
}

module.exports.encode2image = function(dst) {
  var raw_data = { data: dst.data,
                   width: dst.size().width,
                   height: dst.size().height
                 };
  var jpeg_data = jpeg.encode(raw_data, 50);
  return jpeg_data;
}

module.exports.getOutput = function(elapse, cur, size) {
  return "It took " + (elapse / (cur + 1)) + " ms to process each image. Progress: " + (cur + 1) + "/" + size + " done.\n";
}

module.exports.create_evaluationFile = function(filepath)
{
  var header = "";
  fs.writeFileSync(filepath, header);
  return filepath;
}
stringifyEvaluationEntry = function(imgName, facesMeta) 
{
  var rst = imgName + '\n';
  
  var N = facesMeta['N'];
  rst += N.toString() + '\n';
  
  var X = facesMeta['X'];
  var Y = facesMeta['Y'];
  var W = facesMeta['W'];
  var H = facesMeta['H'];
  var S = facesMeta['S'];
  for(var i = 0; i < N; i++) {
    rst += X[i].toString() + '\t'
         + Y[i].toString() + '\t'
         + W[i].toString() + '\t'
         + H[i].toString() + '\t'
         + S[i].toString() + '\n';
  }
  return rst;
}
module.exports.append_evaluationEntry = function(facesMeta, imgFilepath, evalFilePath) 
{
  var entry = stringifyEvaluationEntry(ps.basename(imgFilepath), facesMeta);
  console.log(entry);
  fs.appendFileSync(evalFilePath, entry);
  console.log("Evaluated.");
}