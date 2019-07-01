export class Cache {
  engine = null;

  constructor(engine = localStorage) {
    this.engine = engine;
  }

  get = key => {
    let valStr = this.engine.getItem(key);
    if (valStr == null) {
      return null;
    }
    let res;
    try {
      res = JSON.parse(valStr);
    } catch (error) {
      console.log("[CACHE] Error:", error);
      res = null;
    }
    return res;
  };

  set = (value, key, options = {}) => {
    if (value == null) {
      this.engine.removeItem(key);
    } else {
      try {
        // console.log(JSON.stringify(value));
        this.engine.setItem(key, JSON.stringify(value), options);
      } catch (error) {
        // May throw exception if not enough memory allocated or in Safari's private mode!!
      }
    }
  };
}
