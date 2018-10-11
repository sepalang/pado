export const argumentNamesBy = function getArgs (fn){
  if(typeof fn !== "function") return []
    // normal -  function[^\(]*?\(([^)]*)\)
    // arrow  -  \([\)]*\)\s*\=\>\s*\{
  var args = fn.toString().match(/function[^\(]*?\(([^)]*)\)|\([\)]*\)\s*\=\>\s*\{/)[1]
  if(!args) return []
  return args.split(',').map(s=>s.trim()).filter(n=>n)
}

export const scopelizeBy = function (evalCommand){
  if(evalCommand.indexOf("return") == -1){
    evalCommand = `  return ${evalCommand}`
  }

  const command = evalCommand
  const scopeBeforeFn = function (scope, info){
    const params = []
    const fnArgs = []
    
    Object.keys(scope).forEach(key=>{
      params.push(scope[key])
      fnArgs.push(key)
    })
    
    fnArgs.push(command)
    
    const makeFn = Function.apply(Function, fnArgs)
    
    if(typeof info === "function"){
      info({
        func  : makeFn,
        args  : fnArgs,
        params: params
      })
    }
    
    return makeFn.apply(void 0, params)
  }
  
  scopeBeforeFn.scoped = function (){
    return command
  }
  
  return scopeBeforeFn
}

