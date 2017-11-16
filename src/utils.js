const jpeg = require('jpeg-js');
const fs = require('fs');

module.exports.loadImages = function() {
  var filepath = '../assets/data/WIDER_val/images/0--Parade/0_Parade_Parade_0_102.jpg';  
  var jpeg_data = fs.readFileSync(filepath);
  var raw_data = jpeg.decode(jpeg_data);
  return raw_data;
}

module.exports.encode2image = function(dst) {
  var raw_data = { data: dst.data, 
                   width: dst.size().width, 
                   height: dst.size().height 
                 };
  var jpeg_data = jpeg.encode(raw_data, 50);
  return jpeg_data;
}