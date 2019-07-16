const wait = (fn, amount = 2000) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      fn();
      res();
    }, amount);
  });

const getBase64 = file =>
  new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({ file, src: reader.result, fileID: file.lastModified });
    };
  });

let buildParams = obj => {
  let params = Object.keys(obj);
  let val = Object.values(obj);
  let result = val.reduce((total, cur, i) => {
    if (cur !== undefined && cur !== null) {
      return total + `${params[i]}=${cur}&`;
    }
    return total;
  }, "?");
  if (result === "?") {
    return "";
  }
  return result.slice(0, result.length - 1);
};

// DEPRECATED, should use scrapper-util if possible
const getMetaTags = url => {
  const data = {
    key: "5d23fe49576914abd325e59c9705044764303dc5845b0",
    q: url
  };

  return fetch("https://api.linkpreview.net", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => response)
    .catch(err => {
      throw err;
    });
};

const getMonthName = (month, length) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return months[month].substring(0, length);
};

const timeDifference = date => {
  let millisec = Math.abs(date - Date.now());
  let sec = Math.floor(millisec / 1000);
  let mins = Math.floor(millisec / 60000);
  let hrs = Math.floor(mins / 60);
  let days = Math.floor(hrs / 24);
  if (days <= 0) {
    if (hrs <= 0) {
      if (mins <= 0) {
        return `${sec}s`;
      }
      return `${mins}m`;
    }
    return `${hrs}h`;
  } else if (days <= 30) {
    return `${days}d`;
  } else {
    return `${date.getDate()} ${getMonthName(date.getMonth(), 3)}`;
  }
};

const convertSecToMinSec = sec => {
  let second = Math.floor(sec);

  let min = Math.floor(second / 60);
  second = second - min * 60;
  second = second.toString();
  if (second.length === 1) {
    second = `0${second}`;
  }
  return `${min}:${second}`;
};

export {
  wait,
  getBase64,
  buildParams,
  getMetaTags,
  timeDifference,
  convertSecToMinSec
};
