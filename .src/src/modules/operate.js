import { 
  asArray,
  isNumber
} from '../functions';

const immediate = function(fn,timeout=0){
  let reserved;
  let allArgs = [];
  return function(...args){
    allArgs.push(args);
    if(!reserved){
      reserved = setTimeout(()=>{
        fn(allArgs);
        allArgs = [];
        clearTimeout(reserved);
        reserved = undefined;
      },0);
    }
  };
};

export const operate = (function(){
  const PARENT_OUTPUT_UPDATED = "ParentOutputUpdated";
  const CHILDREN_INPUT_UPDATED = "ParentOutputUpdated";
  
  const operate = function({ input, output, concurrent, rescue, limitInput, limitOutput }){
    this.parent   = undefined;
    this.children = [];
    this.inputs   = [];
    this.outputs  = [];
    this.limitInput  = isNumber(limitInput) || limitInput > 0 ? limitInput : Number.POSITIVE_INFINITY;
    this.limitOutput = isNumber(limitOutput) || limitOutput > 0 ? limitOutput : Number.POSITIVE_INFINITY;
    
    //
    let current = 0;
    concurrent  = isNumber(concurrent) || concurrent > 0 ? concurrent : 1;
    
    Object.defineProperty(this,"avaliablePullCount",{
      get:()=>{
        let limit = this.limitInput - this.inputs.length;
        if(limit < 0) limit = 0;
        return limit;
      }
    });
    
    Object.defineProperty(this,"avaliableOutputCount",{
      get:()=>{
        return this.limitOutput + current + this.outputs.length;
      }
    });
    
    const inputOutput = { input, output };
    const kickStart = ()=>{
      let avaliableQueLength = concurrent - current;
      
      // 작동가능한 큐
      if(avaliableQueLength < 1){
        return;
      }
      
      // input의 길이로 확인하여 실행 가능한 큐
      if(avaliableQueLength > this.inputs.length){
        avaliableQueLength = this.inputs.length;
      }
      
      // output의 제한을 확인하여 사용 가능한 큐
      if(avaliableQueLength > this.avaliableOutputCount){
        avaliableQueLength = this.avaliableOutputCount;
      }
      
      if(avaliableQueLength < 1){
        return;
      }
      
      Array(avaliableQueLength).fill(inputOutput).forEach(async ({input, output})=>{
        let entry = this.inputs.shift();
        current++;
        
        const outputHandle = async (formInputDataum)=>{
          if(output){
            await output({ entry:formInputDataum });
          }
          
          this.outputs.push(formInputDataum);
          current--;
          
          this.children.forEach(child=>child.emit(PARENT_OUTPUT_UPDATED));
          kickStart();
        };
        
        if(input){
          try {
            outputHandle(await input({ entry }));
          } catch(e) {
            if(typeof rescue === "function"){
              rescue(e);
            } else {
              throw e;
            }
            current--;
          }
        } else {
          outputHandle(entry);
        }
      });
    };

    Object.defineProperty(this,"push",{
      value:(pushData)=>{
        this.inputs.push(pushData);
        kickStart();
        return this;
      }
    });
    
    Object.defineProperty(this,"concat",{
      value:(pushData)=>{
        asArray(pushData).forEach(d=>this.inputs.push(d));
        kickStart();
        return this;
      }
    });
    
    Object.defineProperty(this,"emit",{
      value:(eventName, payload)=>{
        switch(eventName){
          case PARENT_OUTPUT_UPDATED:
            if(this.avaliablePullCount < 1) return;
            let pullData = this.parent.pull(this.avaliablePullCount);
            
            if(pullData.length < 1) return;
            pullData.forEach(datum=>this.inputs.push(datum));
            kickStart();
            break;
        }
      }
    });
    
    Object.defineProperty(this,"pull",{
      value:(pullLength)=>{
        if(!(isNumber(pullLength) || pullLength == Number.POSITIVE_INFINITY)) return [];
        const pullData = this.outputs.splice(0,pullLength);
        pullData.length && kickStart();
        return pullData;
      }
    })
  };
  
  operate.prototype = {
    append:function(child){
      child.parent = this;
      this.children.push(child);
      return this;
    },
    remove:function(child){
      let index = this.children.indexOf(child);
      if(index < 0) return this;
      child.parent = undefined;
      this.children.splice(index,1);
    },
    operate:function(option){
      return this.append(operateFunction(option));
    }
  }
  
  const operateFunction = function(option){
    return new operate(Object.assign({},option));
  };
  
  return operateFunction;
  
}());
