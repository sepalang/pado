import { storiesOf } from '@storybook/vue';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import Welcome from './Welcome.vue';

const story = storiesOf('Welcome', module);
story.add('Welcome', () => ({
  render: h => h(Welcome, { props: { goToButton: linkTo('App') } }),
}));