import MethodIO from './MethodIO.vue';
import { storiesOf as originStoriesOf } from '@storybook/vue';
import { withKnobs } from './selectParam.js';

export const storiesOf = function(name,mod){
  return originStoriesOf(name,mod)
  .addDecorator(withKnobs);
}

export const PresetComponents = {
  MethodIO 
}