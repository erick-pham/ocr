//https://www.npmjs.com/package/tesseract.js

const TesseractJS = require('tesseract.js');
const cv = require('opencv4nodejs');
const fs = require('fs');
const xml2json = require('xml2json');
const _ = require('lodash');

var xml = fs.readFileSync('cmnd.xml', 'utf8');

const jsonLabelImg = JSON.parse(xml2json.toJson(xml));

const options = {
  lang: 'vie',
  psm: 6,
  tessedit_char_blacklist: '_-~<>=`!@#$%^&*()+;\'[]{}',
  //tessedit_char_whitelist: 'ạ'
};

//cv.imreadAsync('./IMG_20181204_085035.jpg', async = (err, mat) => {
//let mat = cv.imread('./IMG_1222.jpg');
//let mat = cv.imread('./1.png');

let mat = cv.imread('./cmnd.jpg');
// drop form point (50,50) => width and height (100,100)
//return mat.getRegion(new cv.Rect(1669, 2345, 2473 - 1669, 2705 - 2345));

// const low = new cv.Vec3(0, 0, 0);
// const high = new cv.Vec3(23, 16, 10);
// const matHSV = mat.inRange(low, high);
//mat = mat.bilateralFilter(15, 70, 80, cv.BORDER_DEFAULT);
// convert to gray space
//mat = mat.resize(mat.rows * 2, mat.cols * 2, 0, 0, cv.INTER_AREA);


//mat = mat.bgrToGray();
//mat = mat.threshold(56, 255, cv.THRESH_BINARY);

const fields = jsonLabelImg.annotation.object;
let promises = [];
let raw = {};

fields.forEach((field, i) => {
  let roiMatrix = mat.getRegion(new cv.Rect(field.bndbox.xmin, field.bndbox.ymin, field.bndbox.xmax - field.bndbox.xmin, field.bndbox.ymax - field.bndbox.ymin));

  roiMatrix = roiMatrix.bilateralFilter(15, 70, 70, cv.BORDER_DEFAULT);

  roiMatrix = roiMatrix.bgrToGray();
  // for (var x = 0; x < roiMatrix.rows; x++) {
  //   for (var y = 0; y < roiMatrix.cols; y++) {
  //     var intensity = roiMatrix.at(x, y);
  //     var blue = intensity.x;
  //     var green = intensity.y;
  //     var red = intensity.z;
  //     var vec3;
  //     if (blue < 127 && green < 127 && red < 100) {
  //       vec3 = new cv.Vec3(0, 0, 0);
  //     } else {
  //       vec3 = new cv.Vec3(255, 255, 255);
  //     }
  //     roiMatrix.set(x, y, vec3);
  //   }
  // }


  //roiMatrix = roiMatrix.threshold(90, 255, cv.THRESH_BINARY);
  //roiMatrix = roiMatrix.threshold(60, 255, cv.THRESH_BINARY);
  //roiMatrix = roiMatrix.resize(roiMatrix.rows * 2, roiMatrix.cols * 2, 0, 0, cv.INTER_AREA);
  cv.imwrite(`./newImage${i}.jpg`, roiMatrix);

  //const promise = TesseractJS.recognize(roiMatrix.getData(), options).then((result) => {
  const promise = TesseractJS.recognize(`./newImage${i}.jpg`, options).then((result) => {
    _.set(raw, field.name, result.text.trim());
  }).catch((err) => {
    console.log(err);
  });
  promises.push(promise);
});

Promise.all(promises).then(() => {
  console.log(raw);
  process.exit(0);
});

//cv.imwrite('./myNewImage.jpg', mat);

// TesseractJS.recognize('./newImage3.jpg', options).then((result) => {
//   console.error(result.text.trim());
//   process.exit(0);
// }).catch((err) => {
//   console.log(err);
//   process.exit(0);
// });
