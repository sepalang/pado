import {
  promise,
  defer as _defer,
  timeout as _timeout,
  valueOf as _valueOf,
  abort as _abort,
  reject as _reject
} from './promise';

export const awaitLeadOnly = function(func) {
  return alloc(function() {
    let $pending = false;
    return function(...args) {
      if($pending === true) {
        return _abort();
      } else {
        $pending = true;
        return promise((resolve, reject)=>{
          return _valueOf(func.apply(this, args)).then(resolve).catch(reject);
        })
        .then(e=>{
          $pending = false;
          return e;
        })
        .catch(e=>{
          $pending = false;
          return _reject(e);
        });
      }
    };
  });
};

export const awaitCompose = function(funcArgs) {
  return alloc(function() {
    const composeFuncs = [];

    asArray(funcArgs).forEach(f=>{ typeof f === "function" && composeFuncs.push(f); });

    return function(payload) {
      return promise((resolve, reject)=>{
        function* iterator() {
          for(let d = composeFuncs, i = 0, l = d.length; i < l; i++) {
            yield d[i];
          }
        }

        const doWhile = ({ value: proc, done }, taskPayload)=>{
          if(done) {
            resolve(taskPayload);
          } else {
            _valueOf(proc.call(this, taskPayload))
            .then(nextPayload=>{
              doWhile(iterator.next(), nextPayload);
            })
            .catch(reject);
          }
        };

        doWhile.apply(iterator.next(), payload);
      });
    };
  });
};
