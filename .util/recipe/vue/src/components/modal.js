import { promise } from '../../../../../.src/modules/promise';
import { asObject } from '../../../../../.src/functions/cast';
import { createVue } from '@/service/vue-compile';

const ModalComponentCompile = function(options){
  options = asObject(options);
  return createVue(ModalServiceComponent, { props: { ...options, }, appendTo: document.body });
};

export const newDialog = function(options){
  options = asObject(options);
  return new ModalComponentCompile({ title: 'alarm', ...options, theme: 'dialog' });
}

export const newMessage = function(options){
  options = asObject(options);
  return new ModalComponentCompile({ closeButton: false, ...options, theme      : 'message' });
}

export const alert = function(text, icon){
  
}

