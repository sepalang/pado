import { deepKeys } from '../../src';

const result = deepKeys([null,{},{a:1,b:2,arr:[3,4,[5,null]]}])

console.log({ result });