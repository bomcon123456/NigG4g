/* eslint-disable eqeqeq */
import isNil from "lodash/isNil";
import forEach from "lodash/forEach";

export const keyEvents = {
  isPeriod(e) {
    return e.keyCode == 190;
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
    return e.keyCode == 27;
  }
};

export function createEventEmitter() {
  const _events = {};
  const on = (event, listener) => {
    if (isNil(_events[event])) {
      _events[event] = [];
    }
    _events[event].push(listener);

    return () => {
      removeListener(event, listener);
    };
  };
  const removeListener = (event, listener) => {
    if (isNil(_events[event])) {
      return;
    }
    let i = _events[event].indexOf(listener);
    _events[event].splice(i, 1);
  };
  return {
    on,
    events: () => _events,
    emit: (event, ...args) => {
      if (isNil(_events[event])) {
        return;
      }
      forEach(_events[event], listener => {
        listener(...args);
      });
    },
    removeListener,
    once: (event, listener) => {
      on(event, function handler(...args) {
        removeListener(event, handler);
        listener(args);
      });
    }
  };
}
