const moment = require('moment-timezone');

// Returns whether speaking should be supressed based on time
function isMuteTime(now, muteAt, unmuteAt) {
  // if they're the same, never mute.
  if (muteAt === unmuteAt) {
    return false;
  }

  const start = moment(now);
  start.set('hours',   Number.parseInt(muteAt.split(':')[0], 10));
  start.set('minutes', Number.parseInt(muteAt.split(':')[1], 10));
  start.set('seconds', 0);

  const end = moment(now);
  end.set('hours',   Number.parseInt(unmuteAt.split(':')[0], 10));
  end.set('minutes', Number.parseInt(unmuteAt.split(':')[1], 10));
  end.set('seconds', 0);

  // if end is before start, push end to the next day.
  if (end.isBefore(start)) {
    if (now.isBefore(end)) {
      start.subtract(1, 'day');
    } else {
      end.add(1, 'day');
    }
  }

  return (now.isAfter(start) && now.isBefore(end));
}

module.exports = { isMuteTime };
