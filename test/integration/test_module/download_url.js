const rewire  = require('rewire');
const assert  = require('assert');
const request = require('request');

describe('mqtt-speak', () => {
  const tts  = rewire('../../../src/module/detox-central-tts.js');

  describe('URL builder#url request', () => {
    it('should not throw error when url is reachable', (done) => {
      const url = tts.__get__('buildURL')('test');
      isUrlValid(url).then(() => {
        done();
      }, (error) => {
        assert.throws(() => {
          throw error;
        },
          /Url is unreachable/
        );
        done();
      });
    });


    it('should throw error when url is unreachable', (done) => {
      const url = tts.__get__('buildURL')('download');
      isUrlValid(url).then(() => {
        done();
      }, (error) => {
        assert.throws(() => {
          throw error;
        },
          /Url is unreachable/
        );
        done();
      });
    });


    it('should not throw error after requesting unreachable address', (done) => {
      const url = tts.__get__('buildURL')('test');
      isUrlValid(url).then(() => {
        done();
      }, (error) => {
        assert.throws(() => {
          throw error;
        },
          /Url is unreachable/
        );
        done();
      });
    });
  });
});

function isUrlValid(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, res) => {
      if (error) {
        reject(error);
      } else {
        if (res.statusCode !== 200) {
          reject(new Error(`Url is unreachable: ${url}`));
        } else {
          resolve();
        }
      }
    });
  });
}
