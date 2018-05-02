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
        <label>[{{ inputType }}]</label>
        <pre>{{ inputDisplay || inputValue }}</pre>
      </div>
    </div>
    <div>
      <b>Output</b>
      <label v-if="outputType">[{{outputType}}]</label>
      <pre>{{ outputValue }}</pre>
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