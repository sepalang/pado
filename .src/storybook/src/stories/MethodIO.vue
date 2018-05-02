<template>
<div>
  <div>
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

export default {
  props: ["input", "inputText", "method"],
  data:()=>({
    inputError:null,
    inputType:null,
    inputDisplay:null,
    outputError:null,
    outputType:null,
    outputDisplay:null
  }),
  computed:{
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
      if(typeof this.method !== "function"){
        return "Undefined function";
      }
      
      let outputValue;
      
      try {
        outputValue = this.method(this.inputValue);
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