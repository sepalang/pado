<template>
<div>
  <div>
    <div>
      <b>Command</b>
      <pre class="data-display">{{ commandValue }}</pre>
    </div>
  </div>
  <div v-if="hasInput === true">
    <div v-if="inputError !== null">
      <b>Input</b>
      <label>Error : </label>
      <pre>{{ inputError }}</pre>
    </div>
    <div v-else>
      <b>Input</b>
      <label class="badge">{{ inputType }}</label>
      <pre class="data-display">{{ inputDisplay || inputValue }}</pre>
    </div>
  </div>
  <div>
    <b>Output</b>
    <label v-if="outputType" class="badge">{{outputType}}</label>
    <pre class="data-display">{{ outputValue }}</pre>
  </div>
  <div>
    <div>
      <b>IO Reason</b>
      <pre class="data-display" v-if="commandDetail">{{commandDetail}}</pre>
    </div>
  </div>
</div>
</template>

<script>
const altTextFilter = function(value){
  if(typeof value === "string"){
    return `"${value}"`;
  } else if(value === null){
    return "null";
  } else if(value === undefined){
    return "undefined";
  } else {
    return null;
  }
};

const scopeFunction = function(evalCommand){
  if(evalCommand.indexOf("return") > -1){
    evalCommand
  } else {
    evalCommand = `  return ${evalCommand}`;
  }

  const command = evalCommand;
  const scopeBeforeFn = function(scope,info){
    const params = [];
    const fnArgs = [];
    
    Object.keys(scope).forEach(key=>{
      params.push(scope[key]);
      fnArgs.push(key);
    });
    
    fnArgs.push(command);
    
    const makeFn = Function.apply(Function,fnArgs);
    
    if(typeof info === "function"){
      info({
        func:makeFn,
        args:fnArgs,
        params:params
      });
    }
    
    return makeFn.apply(void 0,params);
  };
  
  scopeBeforeFn.scoped = function(){
    return command;
  };
  
  return scopeBeforeFn;
}

export default {
  props: ["command", "input", "inputText", "scope"],
  data:()=>({
    commandDetail:null,
    inputError:null,
    inputType:null,
    inputDisplay:null,
    outputError:null,
    outputType:null,
    outputDisplay:null
  }),
  computed:{
    commandValue (){
      const scopeFn = scopeFunction(this.command);
      this.scopedFn = scopeFn;
      return this.command;
    },
    hasInput (){
      return this.commandValue.indexOf("input") > -1;
    },
    inputValue (){
      const inputTextMode = typeof this.inputText === "string";
      let inputValue;
      try {
        inputValue = inputTextMode ? !this.inputText.trim() ? this.inputText : eval(`( ${ this.inputText } )`) : this.input;
        this.inputType    = typeof inputValue;
        this.inputError   = null;
        this.inputDisplay = altTextFilter(inputValue);
      } catch(e) {
        this.inputType  = null;
        this.inputError = e.message;
        this.inputDisplay = null;
      }
      return inputValue;
    },
    outputValue (){
      if(this.inputError){
        return "Error";
      }
      
      let outputValue;
      
      try {
        const scope = Object.keys(this.scope||{}).reduce((dest,key)=>{
          dest[key] = this.scope[key];
          return dest;
        },{ input: this.inputValue });
        outputValue = this.scopedFn(scope,({ func, args, params })=>{
          const paramDetail  = params.reduce((dest,value,index)=>{
            let textValue;
            
            if(typeof value === "function"){
              textValue = "[Function]"
            } else {
              textValue = value+"";
            }
            
            dest[args[index]] = textValue;
            return dest;
          },{});
          
          this.commandDetail = JSON.stringify(paramDetail,2,2);
          this.commandDetail += `\n\n${func}`;
        });
      } catch(e) {
        this.outputType = null;
        this.outputDisplay = null;
        return e.message;
      }
      
      try {
        this.outputType = typeof outputValue;
        this.outputDisplay = altTextFilter(outputValue);
      } catch(e) {
        this.outputType = null;
        this.outputDisplay = null;
        return e.message;
      }
      
      return JSON.stringify(outputValue);
    }
  }
}
</script>
  
<style lang="scss">
.badge {
  display:inline-block;
  background-color:gray;
  font-size:13px;
  padding:0 5px;
  height:15px;
  line-height:15px;
  border-radius:4px;
  color:white;
}
.data-display {
  padding:10px 5px;
  border:1px solid silver;
}
</style>