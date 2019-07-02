import isNil from "lodash/isNil";
import forEach from "lodash/forEach";

export const keyEvents = {
  isPeriod(e) {
    return e.keyCoe == 190;
  },
  isSpacebar(e) {
    return e.keyCode == 32;
  },
  isNumber(e) {
    const keyCode = e.keyCode || e.charCode;
    return (
      (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)
    );
  },
  isEnter(e) {
    return e.keyCode == 13;
  },
  isEsc(e) {
    return (e.keyCode = 27);
  }
};
