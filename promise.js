var newFunc = (opts) => {
  var promise = new Promise((resolve, reject) => {
    if (opts.hasOwnProperty('haha')) {
      resolve('lallala');
    } else {
      reject('dfasdfsa');
    }
  });
  return promise;
};

newFunc({
  haha: 'sdfd'
}).then((x) => {
  console.log(x);
});
