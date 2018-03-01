import { promise } from './src'

promise(resolve=>resolve()).then(e=>console.log("promise works!"));