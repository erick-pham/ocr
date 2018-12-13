var express = require('express');
var formidable = require('formidable');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var ocrService = require('./services/ocrService');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(router);

router.get('/', function (req, res) {
  // res.writeHead(200);
  // res.end('Welcome you to OCR');
  res.render('index');
});


router.post('/upload', async function (req, res) {
  let data = {
    error: false,
    message: null,
    text: null
  };
  res.writeHead(200);

  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = false;
  form.maxFileSize = 10 * 1024 * 1024;
  form.uploadDir = "pictures/";

  form.parse(req, async function (err, fields, file) {
    const imgPath = file.file.path;

    data.message = imgPath;
    if (fields.type === 'CMND') {
      await ocrService.identityCardHandler.getData(imgPath).then((rs) => {
        data.text = rs
      }).catch((err) => {
        data.error = true
        data.message = err;
      });
    } else if (fields.type === 'GPLX') {
      await ocrService.driverLicenceHandler.getData(imgPath).then((rs) => {
        data.text = rs
      }).catch((err) => {
        data.error = true
        data.message = err;
      });
    } else if (fields.type === 'CAN_CUOC'){
      await ocrService.canCuocHandler.getData(imgPath).then((rs) => {
        data.text = rs
      }).catch((err) => {
        data.error = true
        data.message = err;
      });
    }

    res.end(JSON.stringify(data));
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});
