const cv = require('../../opencvJs/asm/opencv.js');
const fs = require('fs');
const jpeg = require('jpeg-js');



// const modelTxt = '/nn4.small2.def.lua';
// const modelBin = '/nn4.small2.v1.t7';

function createFileFromUrl(path, url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(ev) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                info.innerHTML = '';
                let data = new Uint8Array(request.response);
                cv.FS_createDataFile('/', path, data, true, false, false);
                callback();
            } else {
                console.log('Failed to load ' + url + ' status: ' + request.status);
            }
        }
    };
    request.send();
};

const modelTxt = 'bvlc_googlenet.prototxt';
const modelBin = 'bvlc_googlenet.caffemodel';

let imageFile = '../../assets/data/japan-crowd.jpg';


let net;

utils.loadOpenCv(() => {
    console.log("3");
    let modelTxt = 'bvlc_googlenet.prototxt';
    createFileFromUrl(modelTxt, modelTxt, () => {
        console.log("4");
        let modelBin = 'bvlc_googlenet.caffemodel';
        createFileFromUrl(modelBin, modelBin, () => {
            console.log("5");
            let url = 'synset_words.txt';
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function(ev) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        keywords = request.response;
                        keywords = keywords.split('\n');
                        for(let i = 0; i < keywords.length; ++i) {
                            keywords[i] = keywords[i].replace(/^n[0-9]*\s/, '');
                        }
                        info.innerHTML = 'Reading net from caffe model...';
                        setTimeout(() => {
                            net = cv.readNetFromCaffe(modelTxt, modelBin);
                            if (net.empty()) {
                                self.printError('Failed to read net ' + modelTxt + ' ' + modelBin);
                                throw Error('Failed to read net');
                            }
                            info.innerHTML = '';
                            tryIt.removeAttribute('disabled');
                        }, 1);
                    } else {
                        self.printError('Failed to load ' + url + ' status: ' + request.status);
                    }
                }
            };
            request.send();
        });
    });
});

// cv.FS_createLazyFile('/',
//                      'nn4.small2.def.lua',
//                      '../../assets/nn4.small2.def.lua',
//                      true,
//                      false);
// cv.FS_createLazyFile('/',
//                      'nn4.small2.v1.t7',
//                      '../../assets/nn4.small2.v1.t7',
//                      true,
//                      false);
cv.FS_createLazyFile('/',
                     'bvlc_googlenet.caffemodel',
                     '../../assets/bvlc_googlenet.caffemodel',
                     true,
                     false);
cv.FS_createLazyFile('/',
                     'bvlc_googlenet.prototxt',
                     '../../assets/bvlc_googlenet.prototxt',
                     true,
                     false);

let jpeg_data = fs.readFileSync(imageFile);

if (jpeg_data == undefined) {
  var err = "Error: cannot find the image.";
  console.log(err);
  process.exit(err);
}

let raw_data = jpeg.decode(jpeg_data);
let raw_data_mat = cv.matFromImageData(raw_data);

var height = raw_data.height;
var width = raw_data.width;

let blob_image = cv.blobFromImage(raw_data_mat, 1.0, Size(height, width),
                                  Scalar(104, 117, 123), false, false);

// const dnn_net = cv.readNetFromCaffe(modelTxt, modelBin);
const net = cv.readNetFromCaffe(modelTxt, modelBin, false);

net.setInput(blob_image, "data");
let start = Date.now();
let prob = net.forward("prob");
let minMax = cv.minMaxLoc(prob);
let delta = Date.now() - start;
console.log('Best class: #' + minMax.maxLoc.x + ' ' + keywords[minMax.maxLoc.x] + ' Probability: ' + minMax.maxVal + ' Elapsed time: ' + delta + ' ms');
