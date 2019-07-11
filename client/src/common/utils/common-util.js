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

export { wait, getBase64, buildParams, getMetaTags };
