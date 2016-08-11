const rewire   = require('rewire');
const assert   = require('assert');
const validUrl = require('valid-url');

describe('Detox Central TTS', () => {
  const tts = rewire(`${__dirname}/../../src/module/detox-central-tts.js`);

  describe('Detox Central TTS#buildURL()', () => {
    it('should not throw error param is valid', (done) => {
      const param = 'tts';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should throw error when param contains space', (done) => {
      const param = 'tts download';
      assert.throws(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      },
        /undefined == true/
      );
      done();
    });

    it('should not throw error when param contains * character', (done) => {
      const param = 'tts*download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains - character', (done) => {
      const param = 'tts-download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains _ character', (done) => {
      const param = 'tts_download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains . character', (done) => {
      const param = 'tts.download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains / character', (done) => {
      const param = 'tts/download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains ( ) character', (done) => {
      const param = 'tts(download)';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains \ character', (done) => {
      const param = 'tts\download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains @ character', (done) => {
      const param = 'tts@download';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param contains numbers', (done) => {
      const param = 'tts12345';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param is complex path', (done) => {
      const param = 'tts/audio/files';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when param is complex path', (done) => {
      const param = 'tts/test.mp3';
      assert.doesNotThrow(() => {
        assert.ok(validUrl.isUri(tts.__get__('buildURL')(param)));
      }, (error) =>
        error
      );
      done();
    });
  });
});
