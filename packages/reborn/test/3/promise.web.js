import { promise, resolve, reject, all, defer, timeout, valueOf } from '@sepalang/pado/modules/promise';

const promiseFn = function(...args){
  return promise(...args);
};

promiseFn['resolve'] = resolve;
promiseFn['reject'] = reject;
promiseFn['all'] = all;
promiseFn['defer'] = defer;
promiseFn['timeout'] = timeout;
promiseFn['valueOf'] = valueOf;




export default promiseFn;
