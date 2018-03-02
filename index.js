import { promise } from './src'

promise(resolve=>resolve()).then(e=>console.log("promise works!"));


import train from './src/train'

console.log("train",Object.keys(train));