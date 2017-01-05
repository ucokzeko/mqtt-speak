const assert     = require('assert');
const isMuteTime = require('../../src/module/mute-check.js').isMuteTime;
const moment     = require('moment-timezone');

describe('isMuteTime', () => {
  describe('with bounds lying on the same day', () => {
    it('should return true when "now" parameter\'s time element lies between the two given timestamps, with one at midnight', () => {
      const now       = moment('01:30', 'HH:mm'); // 1:30am
      const startMute = '00:00'; // Midnight
      const endMute   = '02:00'; // 2am
      assert(isMuteTime(now, startMute, endMute));
    });

    it('should return true when "now" parameter\'s time element lies between the two given timestamps', () => {
      const now       = moment('12:30', 'HH:mm'); // 12:30pm
      const startMute = '10:00'; // 10am
      const endMute   = '14:00'; // 2pm
      assert(isMuteTime(now, startMute, endMute));
    });

    it('should return false when "now" parameter\'s time element lies outside the two given timestamps', () => {
      const now       = moment('16:30', 'HH:mm'); // 4:30pm
      const startMute = '10:00'; // 10am
      const endMute   = '14:00'; // 2pm
      assert(!isMuteTime(now, startMute, endMute));
    });
  });

  describe('with bounds crossing the border of midnight', () => {
    it('should return true when "now" parameter\'s time element lies between the two given timestamps', () => {
      const now       = moment('23:30', 'HH:mm'); // 11:30pm
      const startMute = '22:00'; // 10pm
      const endMute   = '02:00'; // 2am
      assert(isMuteTime(now, startMute, endMute));
    });

    it('should return false when "now" parameter\'s time element lies before the two given timestamps', () => {
      const now       = moment('20:30', 'HH:mm'); // 8:30pm
      const startMute = '22:00'; // 10pm
      const endMute   = '02:00'; // 2am
      assert(!isMuteTime(now, startMute, endMute));
    });

    it('should return false when "now" parameter\'s time element lies after the two given timestamps', () => {
      const now       = moment('02:30', 'HH:mm'); // 2:30am
      const startMute = '22:00'; // 10pm
      const endMute   = '02:00'; // 2am
      assert(!isMuteTime(now, startMute, endMute));
    });
  });
});
