var fs     = require('fs');
var crypto = require('crypto');

describe('Audio processing', () => {
  var path = './audio/';
  
  before(done => {
    try {
      fs.lstatSync(path);
    } catch (e) {
      fs.mkdirSync(path);
    }
    done();
  });

  after(done => {
    try {
      deleteDir(path);
    } catch (e) {
      throw e;
    }
    done();
  });

  describe('Requesting audio file', () => {
    var Processor = require('../../src/module/audio-processor.js');
    var message = 'This is a unit test audio';
    var expectedFilename = `${crypto.createHash('md5').update(message).digest('hex')}.mp3`;

    it('Processing text to speech', () => {
      return new Processor(message, path)
      .then((audioPath) => {
        try {
          fs.lstatSync(`${path}${expectedFilename}`);
        } catch (e) {
          throw e;
        }
      });
    });
  });

  function deleteDir(dirPath) {
    fs.readdirSync(dirPath).forEach((file) => {
      var curPath = `${dirPath}${file}`;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteDir(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
});
