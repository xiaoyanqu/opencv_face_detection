# opencv_face_detection

Dataset: [WIDER FACE](http://mmlab.ie.cuhk.edu.hk/projects/WIDERFace/index.html)
  
### How to use:

prerequisit: npm, node v8 or above  

```
> cd opencv_face_detection
> npm install 
> cd src
> node server.js
```

Wait a few seconds till the testing dataset is loaded to node virtual ENV.  

Now you can go to:  
1. localhost:8888/show/haar (see an example of haar classifier)
2. localhost:8888/show/lbp (see an example of blp classifier)
3. localhost:8888/perf/haar (see performance testing for haar classifier)
4. localhost:8888/perf/lbp (see performance testing for blp classifier)

__Note:__
1. the above 3, 4 are going to take a while as the web browser will not render any result before the testing is done.  
2. the program is designed to send testing result for every 10 images in a batch but it doesn't work in node v8/9.
3. if you switch to node v6, you will see testing results streaming in.
4. the program outputs evaluation results to local disk in the required format of WIDER project.

### Switch between openCV ASM and openCV WASM

It can be configured in src/models.js - 1st line

### Directory structure

1. Assets stores datasets (Please follow the above link at the beginning for the whole WIDER dataset, this repo only contains test/small dataset, which is a subset of the WIDER dataset)
2. opencvJs stores two different version of compile opencv.js for performance testing.
3. src includes backend code, including: a server (server.js), a request handler (fbHandle.js), a model module (models.js), a utility module (utils.js) and two helper files (opencv_js.js, opencv_js.wasm required for running wasm/opencv.js). It also includes dnn folder, where there is a successful use case of opencv dnn module in chrome. This was what we plan to follw up if more time is allowed.

├── opencvJs  
│   ├── asm  
│   │   └── opencv.js  
│   └── wasm  
│       ├── opencv.js  
│       ├── opencv_js.js  
│       └── opencv_js.wasm  
└── src  
    ├── dnn   
    │  
    ├── fbHandle.js  
    ├── models.js  
    ├── opencv_js.js  
    ├── opencv_js.wasm  
    ├── server.js  
    └── utils.js  
  
Good place for example: https://www.npmjs.com/package/opencv.js
  
Good place for javascript: https://learnxinyminutes.com/docs/javascript/
