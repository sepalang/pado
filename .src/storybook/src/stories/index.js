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
import EditGuide from './EditGuide.vue';
story.addDecorator(withNotes)
story.add('Edit guide', () => ({
  render: h => h(EditGuide,{ props: { clickLink:action('clickLinkClick') }}),
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