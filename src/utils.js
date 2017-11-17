const jpeg = require('jpeg-js');
const fs = require('fs');
const glob = require('glob');

module.exports.loadImages = function() {
  var images = getImagesFiles();
  var raw_list = [];
  for(i=0; i < images.length; i++) {
    raw_list.push(load(images[i]));
  }
  console.log(raw_list);
  return raw_list[0];
}

load = function(imageFile) {
  var jpeg_data = fs.readFileSync(imageFile);
  var raw_data = jpeg.decode(jpeg_data);
  return raw_data;
}

getImagesFiles = function() {
  return glob.sync('../assets/data/small' + '/**/*.jpg');
}

module.exports.encode2image = function(dst) {
  var raw_data = { data: dst.data,
                   width: dst.size().width,
                   height: dst.size().height
                 };
  var jpeg_data = jpeg.encode(raw_data, 50);
  return jpeg_data;
}

getOutout = function(elapse, cur, size) {
  return "It took " + elapse + " ms to process " + (cur + 1) + " out of " + size + " images.";;
}
