import { storiesOf } from '@storybook/vue';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import Welcome from './Welcome.vue';

const story = storiesOf('Welcome', module);
story.add('Welcome', () => ({
  render: h => h(Welcome, { props: { goToButton: linkTo('App') } }),
}));


import { addParameters } from '@storybook/vue';
import { withNotes } from '@storybook/addon-notes';
import WelcomeEdit from './WelcomeEdit.vue';
story.addDecorator(withNotes)
story.add('Edit guide', () => ({
  render: h => h(WelcomeEdit,{ props: { clickLink:action('clickLinkClick') }}),
  mounted (){
    this.$children.forEach(c=>{
      c.$on("clickLinkExample",function(e){
        action("clickLinkExample")(e);
      });
    });
  }
}),{
  notes:`
  여기다 <s>Text</s> HTML 메모를 씁니다. 
  `
});


import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button,
} from '@storybook/addon-knobs/vue';
import WelcomeKnobs from './WelcomeKnobs.vue';
story
.addDecorator(withKnobs)
.add('Knobs guide', ()=>{
  
  const name = text('Name', 'John Doe');
  const age = number('Age', 44);
  const content = `I am ${name} and I'm ${age} years old.`;
  
  const stock = number('Stock', 20, {
    range: true,
    min: 0,
    max: 30,
    step: 5,
  });
  
  const fruits = {
    apples: 'Apple',
    bananas: 'Banana',
    cherries: 'Cherry',
  };
  
  const fruit = select('Fruit', fruits, 'apple');
  const price = number('Price', 2.25);
  const colour = color('Border', 'deeppink');
  const today = date('Today', new Date('Jan 20 2017 GMT+0'));
  const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
  const nice = boolean('Nice', true);
  
  
  return {
    render: h => h(WelcomeKnobs,{
      props:{
        knobs:{
          name,
          age,
          content,
          stock,
          fruit,
          price,
          colour,
          today,
          items,
          nice
        }
      }
    })
  }
});


import { selectParam, params } from '../util/selectParam';
import MethodIO from './MethodIO.vue';

story
.addDecorator(withKnobs)
.add(
  'MethodIO',() => {
    const { asArray } = require("../../../src/functions/cast");
    return {
      components:{
        MethodIO
      },
      computed:{
        defaultCommand:()=>text('command',`
          asArray(i0);
        `.trim()),
        defaultScope:()=>({ asArray }),
        //multi
        inputParams (){
          return [
            {
              title:"String",
              params:params("String",[
                `"Input value"`
              ])
            },
            {
              title:"Boolean",
              params:params("Boolean",[
                `true`
              ])
            },
            {
              title:"null",
              params:params("Null",[
                `null`
              ])
            }
          ];
        },
        //single
        inputText:()=>selectParam("JSON",[
          `"Input value"`,
          `123`,
          `undefined`
        ])
      },
      template:`
        <div>
          <p v-if="!defaultCommand">Undefined defaultCommand</p>
          <p v-if="!defaultScope">Undefined defaultScope</p>
          <section>
            <h2>SINGLE</h2>
            <MethodIO :command="defaultCommand" :input-text="inputText" :scope="defaultScope"></MethodIO>
          </section>
          <section>
            <h2>Multi</h2>
          </section>
          <section v-for="param in inputParams">
            <h2 v-if="param.title">{{param.title}}</h2>
            <MethodIO :command="param.command || defaultCommand" :input-params="param.params" :scope="param.scope || defaultScope"></MethodIO>
          </section>
        </div>
      `
    }
  }
);
