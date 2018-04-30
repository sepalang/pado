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
        <pre>{{ inputValue }}</pre>
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
  export default {
    props: ["input", "inputText", "function"],
    data:()=>({
      inputError:null,
      inputType:null,
      outputError:null,
      outputType:null
    }),
    computed:{
      inputValue (){
        const inputTextMode = typeof this.inputText === "string";
        let inputValue;
        try {
          inputValue      = inputTextMode ? !this.inputText.trim() ? this.inputText : eval(`( ${ this.inputText } )`) : this.input;
          this.inputType  = typeof inputValue;
          this.inputError = null;
        } catch(e) {
          this.inputType  = null;
          this.inputError = e.message;
        }
        return inputValue;
      },
      outputValue (){
        if(this.inputError){
          return "Error";
        }
        if(typeof this.function !== "function"){
          return "Undefined function";
        }
        
        let result;
        
        try {
          result = this.function(this.inputValue);
          this.outputType = typeof result;
        } catch(e) {
          this.outputType = null;
          return e.message;
        }
        
        return JSON.stringify(result);
      }
    }
  }
</script>