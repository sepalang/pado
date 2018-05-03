import MethodIO from './MethodIO.vue';
import { storiesOf as originStoriesOf } from '@storybook/vue';
import { withKnobs, params } from './selectParam.js';

export const storiesOf = function(name,mod){
  return originStoriesOf(name,mod)
  .addDecorator(withKnobs);
}

export const PresetComponents = {
  MethodIO 
}

export const FunctionGuide = {
  components:PresetComponents,
  template:`
    <div>
      <p v-if="!defaultCommand">Undefined defaultCommand</p>
      <p v-if="!defaultScope">Undefined defaultScope</p>
      <section v-for="param in inputParams">
        <h2 v-if="param.title">{{param.title}}</h2>
        <MethodIO :command="param.command || defaultCommand" :input-params="param.inputs" :scope="param.scope || defaultScope"></MethodIO>
      </section>
    </div>
  `
}

export const methodIOInputParams = function(title="methodIO",paramArray,description=""){
  const titleName = `${title}`;
  
  return {
    title:titleName,
    description:`${description}`,
    inputs:params(titleName,paramArray)
  }
};