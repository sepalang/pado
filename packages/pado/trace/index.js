module.exports = function (fn, name){
  return (...params)=>{
    const result = fn(...params)
    let stack = ''
    try {
      throw new Error('pado/trace')
    } catch (e){
      stack = e
    }
    console.log(`pado/watch --`, { name, params, result, stack: stack.stack })
    return result
  }
}
