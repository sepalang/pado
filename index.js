import promise from './packages/promise'

promise(resolve=>resolve()).then(e=>console.log("promise works!"));