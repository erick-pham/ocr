//https://www.npmjs.com/package/tesseract.js

const TesseractJS = require('tesseract.js');
const cv = require('opencv4nodejs');
const fs = require('fs');
const xml2json = require('xml2json');
const _ = require('lodash');



//cv.imreadAsync('./IMG_20181204_085035.jpg', async = (err, mat) => {
//let mat = cv.imread('./IMG_1222.jpg');
//let mat = cv.imread('./1.png');

let mat = cv.imread('./square.jpg');
// drop form point (50,50) => width and height (100,100)
//return mat.getRegion(new cv.Rect(1669, 2345, 2473 - 1669, 2705 - 2345));

// const low = new cv.Vec3(0, 0, 0);
// const high = new cv.Vec3(23, 16, 10);
// const matHSV = mat.inRange(low, high);
//mat = mat.bilateralFilter(15, 70, 80, cv.BORDER_DEFAULT);
// convert to gray space
//mat = mat.resize(mat.rows * 2, mat.cols * 2, 0, 0, cv.INTER_AREA);

// convert to gray image
mat = mat.bgrToGray();

// balance histogram
//mat = mat.equalizeHist();


//mat = mat.medianBlur(3);
//mat = mat.cvtColor(cv.COLOR_BGR2GRAY)

//mat = mat.threshold(70, 255, cv.THRESH_BINARY);

//mat = mat.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 37, 0);

let contours = mat.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

const contoursColor = new cv.Vec3(0, 255, 0);
let rs = mat.drawContours(contours, contoursColor, 0, 0, 0, cv.LINE_4, 1, 0);
cv.imwrite('./out2.jpg', rs);

// TesseractJS.recognize('./newImage3.jpg', options).then((result) => {
//   console.error(result.text.trim());
//   process.exit(0);
// }).catch((err) => {
//   console.log(err);
//   process.exit(0);
// });
