import { operate, promise } from '../../src';

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
  concurrent:2,
  input:({ entry })=>{
    console.log("op2 start", entry);
    return promise.timeout(()=>{ return entry; },2500);
  },
  output:({ entry })=>{
    console.log('op2 output',entry);
  }
});

//op.push(1)
//op.concat([1,2,3,4,5,6]);
//op.clone.concat([1,2,3,4,5,6]);