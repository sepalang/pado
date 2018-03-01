import promise from './src/promise'

promise(resolve=>resolve()).then(e=>console.log("promise works!"));