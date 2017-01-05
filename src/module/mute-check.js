const moment = require('moment-timezone');

// Returns whether speaking should be supressed based on time
function isMuteTime(now, muteAt, unmuteAt) {
  // if they're the same, never mute.
  if (muteAt === unmuteAt) {
    return false;
  }

  const start = moment(muteAt,   'HH:mm');
  const end   = moment(unmuteAt, 'HH:mm');

  // if end is before start, push end to the next day.
  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

  return (now.isAfter(start) && now.isBefore(end));
}

module.exports = { isMuteTime };
