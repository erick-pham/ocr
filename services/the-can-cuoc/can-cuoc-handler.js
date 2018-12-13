const TesseractJS = require('tesseract.js');
const cv = require('opencv4nodejs');
const fs = require('fs');
const xml2json = require('xml2json');
const _ = require('lodash');

const getData = (pathImage) => {
  return new Promise((resolve, reject) => {
    const options = {
      lang: 'vie',
      psm: 6,
      tessedit_char_blacklist: '_-~<>=`!@#$%^&*()+;\'[]{}?'
    };

    const dobOptions = {
      lang: 'vie',
      psm: 6,
      tessedit_char_whitelist: '/0123456789'
    };

    let mat = cv.imread(`./${pathImage}`);
    var xml = fs.readFileSync('./services/the-can-cuoc/training.xml', 'utf8');

    const jsonLabelImg = JSON.parse(xml2json.toJson(xml));
    mat = mat.bilateralFilter(15, 70, 70, cv.BORDER_DEFAULT);

    mat = mat.resize(parseInt(jsonLabelImg.annotation.size.height), parseInt(jsonLabelImg.annotation.size.width), 0, 0, cv.INTER_AREA);
    cv.imwrite(`./tmp/thecancuoc.jpg`, mat);
    const fields = jsonLabelImg.annotation.object;
    let promises = [];
    let textOutput = {};

    fields.forEach((field, i) => {
      let roiMatrix = mat.getRegion(new cv.Rect(field.bndbox.xmin, field.bndbox.ymin, field.bndbox.xmax - field.bndbox.xmin, field.bndbox.ymax - field.bndbox.ymin));
      roiMatrix = roiMatrix.bgrToGray();
      //roiMatrix = roiMatrix.equalizeHist();
      roiMatrix = roiMatrix.threshold(100, 255, cv.THRESH_BINARY);
      cv.imwrite(`./tmp/thecancuoc${i}.jpg`, roiMatrix);
      const promise = TesseractJS.recognize(`./tmp/thecancuoc${i}.jpg`, field.name === 'dateOfBirth' ? dobOptions : options)
        .then(function (result) {
          _.set(textOutput, field.name, result.text.trim());
          console.log(`test ${i}: ${result.text.trim()}`);
        });
      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      resolve(textOutput);
    }).catch((err) => {
      reject(new Error(err));
    });
  });
};

module.exports = {
  getData: getData
};
