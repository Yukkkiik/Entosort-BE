const SHIFTS = {
  PAGI: "pagi",
  SIANG: "siang",
  MALAM: "malam", 
};

const SHIFT_LIST = Object.values(SHIFTS);

const getShiftDateRange = (shift) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ranges = {
    [SHIFTS.PAGI]: {
      start: new Date(today.setHours(6, 0, 0, 0)),
      end: new Date(today.setHours(14, 0, 0, 0)),
    },
    [SHIFTS.SIANG]: {
      start: new Date(today.setHours(14, 0, 0, 0)),
      end: new Date(today.setHours(22, 0, 0, 0)),
    },
    [SHIFTS.MALAM]: {
      start: new Date(today.setHours(22, 0, 0, 0)),
      end: new Date(today.getTime() + 86400000),
    },
  };

  return ranges[shift] || null;
};

module.exports = { SHIFTS, SHIFT_LIST, getShiftDateRange };