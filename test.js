//https://www.npmjs.com/package/tesseract.js
const TesseractJS = require('tesseract.js');
const cv = require('opencv4nodejs');
const fs = require('fs');
const xml2json = require('xml2json');
const _ = require('lodash');

const options = {
  lang: 'vie',
  psm: 6,
  tessedit_char_blacklist: '_-~<>=`!@#$%^&*()+;\'[]{}',
  //tessedit_char_whitelist: '0123456789'
};


let mat = cv.imread('./IMG_20170515_140001.jpg');
//mat = mat.bilateralFilter(10, 40, 40, cv.BORDER_DEFAULT);
//mat = mat.bgrToGray();
//mat = mat.equalizeHist();


//mat = mat.threshold(80, 255, cv.THRESH_BINARY);

//mat = mat.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 7, 0);


//

const low = new cv.Vec3(0, 0, 87);
const high = new cv.Vec3(179, 255, 255);

let hsv = mat.cvtColor(cv.COLOR_BGR2HSV_FULL);

let rs = hsv.inRange(low, high);
//hsv.bitwiseAnd(mat);


let size = new cv.Size(871, 569);
cv.imwrite('./newimage.jpg', rs);

// TesseractJS.recognize('./thecancuoc5.jpg', options).then((result) => {
//   console.error(result.text.trim());
//   process.exit(0);
// }).catch((err) => {
//   console.log(err);
//   process.exit(0);
// });
