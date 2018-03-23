const success = data => ({
  status: 'resolved',
  data,
});

const fail = err => ({
  status: 'rejected',
  data: err,
});

const reflect = promise => promise.then(success, fail);


module.exports = reflect;
