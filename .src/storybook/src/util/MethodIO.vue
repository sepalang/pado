<template>
<div>
  <div>
    <h3>Command</h3>
    <div class="data-display" @click="toggleOpen">
      <pre>{{ commandValue }}</pre>
      <div class="data-display hidden-display">
        <pre v-if="commandDetail">{{commandDetail}}</pre>
      </div>
    </div>
  </div>
  <div class="div-column-2">
    <div>
      <h3>Input</h3>
      <div v-for="(input,ikey) in inputEntries" :key="ikey">
        <div class="data-display">
          <label class="badge">{{ikey}}</label>
          <label class="badge">{{input.inputType}}</label>
          <pre>{{ input.inputDisplay || input.inputValue }}</pre>
        </div>
      </div>
    </div>
    <div>
      <h3>Output</h3>
      <div class="data-display">
        <label v-if="outputType" class="badge">{{outputType}}</label>
        <pre>{{ outputValue }}</pre>
      </div>
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
};

const inputEvaluation = function(input, inputTextMode = false){
  let evalResult = {
    inputValue:undefined,
    inputType:undefined,
    inputError:undefined,
    inputDisplay:undefined
  };
  
  try {
    evalResult.inputValue   = inputTextMode ? !input.trim() ? input : eval(`( ${ input } )`) : input;
    evalResult.inputType    = typeof evalResult.inputValue;
    if(typeof evalResult.inputValue === "object" && Array.isArray(evalResult.inputValue)){
      evalResult.inputType = "Array";
    }
    evalResult.inputError   = null;
    evalResult.inputDisplay = altTextFilter(evalResult.inputValue);
  } catch(e) {
    evalResult.inputType  = null;
    evalResult.inputError = e.message;
    evalResult.inputDisplay = null;
  }
  
  return evalResult;
};

const dataEvaluation = function(data){
  const evalResult = {
    type:undefined
  };
  
  evalResult.type = typeof data;
  
  if(evalResult.type === "object" && Array.isArray(data)){
    evalResult.type = "Array";
  }
  return evalResult;
}

export default {
  props: ["command", "input", "inputText", "inputParams", "scope"],
  data:()=>({
    commandDetail:null,
    inputEvals:[],
    outputError:null,
    outputType:null,
    outputDisplay:null
  }),
  methods:{
    toggleOpen(event){
      if(typeof event.currentTarget.getAttribute("open") === "string"){
        event.currentTarget.removeAttribute("open");
      } else {
        event.currentTarget.setAttribute("open","");
      }
    }
  },
  computed:{
    commandValue (){
      const scopeFn = scopeFunction(this.command);
      this.scopedFn = scopeFn;
      return this.command;
    },
    inputEntries (){
      if(this.inputParams){
        this.inputEvals = [];
        this.inputParams.forEach(dataString=>{
          this.inputEvals.push(inputEvaluation(dataString,true));
        })
      } else {
        let evalResult;
        
        if(typeof this.inputText === "string"){
          evalResult = inputEvaluation(this.inputText,true);
        } else {
          evalResult = inputEvaluation(this.input,false);
        }
        
        this.inputEvals = [evalResult];
      }
      
      return this.inputEvals;
    },
    outputValue (){
      let outputValue;
      
      try {
        const scope = Object.keys(this.scope||{}).reduce((dest,key)=>{
          dest[key] = this.scope[key];
          return dest;
        },{ inputs:this.inputEntries });
        
        scope.inputs && scope.inputs.forEach((meta,key)=>{
          scope[`i${key}`] = meta.inputValue;
        });
        
        outputValue = this.scopedFn(scope,({ func, args, params })=>{
          const paramDetail  = params.reduce((dest,value,index)=>{
            let textValue;
            
            if(typeof value === "function"){
              textValue = "[Function]"
            } else if(args[index] === "inputs"){
              textValue = "[Arguments]";
            } else if(typeof value === "object"){
              textValue = JSON.stringify(value);
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
      
      const { type } = dataEvaluation(outputValue);
      
      try {
        this.outputType = type;
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
  
<style lang="scss" scoped>
h3 {
  display:inline-block;
  margin:5px 0px;
}
pre {
  margin:10px 0px;
}
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
  margin:5px 0px;
  padding:10px 10px;
  border:1px solid #ddd;
  
  .hidden-display {
    display:none;
  }
  
  &:hover, &[open] {
    background-color:#fafafa;
    .hidden-display {
      display:block;
    }
  }
}
.div-column-2 {
  > div {
    float:left;
    width:50%;
  }
  &:after {
    content:"";
    display:block;
    clear:both;
  }
}
</style>