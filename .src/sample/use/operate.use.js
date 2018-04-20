import { operate, promise, randRange } from '../../src';

console.log("start operate feature test")
const op = operate({
  input:({ entry })=>{
    console.log("op1 start",entry);
    return entry;
  },
  output:({ entry })=>{
    return promise.timeout(()=>{ console.log("op1 end", entry); return entry; },2000);
  }
})
.operate({
  input:({ entry })=>{
    const wait = randRange([1800,3000]);
    return promise.timeout(()=>{ return entry; },wait);
  },
  output:({ entry })=>{
    console.log('op2 output',entry);
  }
});


//op.concat([1,2,3,4,5,6]);
op.clone.concat([1,2,3,4,5,6]);
//op.promisify([1,2,3,4]);