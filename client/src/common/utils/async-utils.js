export const asyncParallel = asyncArr =>
  new Promise((resolve, reject) => {
    let result = [];
    let invokeResolve = () => {
      if (result.length === asyncArr.length) {
        resolve(result);
      }
    };
    for (let fnc of asyncArr) {
      fnc()
        .then(res => {
          result.push(res);
          invokeResolve();
        })
        .catch(err => {
          result.push({ error: err });
          invokeResolve();
        });
    }
  });
