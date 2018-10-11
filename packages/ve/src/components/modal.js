import ModalServiceComponent from './bases/ModalView.vue';

import { promise } from '@sepalang/pado/.src/modules/promise';
import { asArry, asObject } from '@sepalang/pado/.src/functions/cast';
import { createVue } from '@/utils';

const ModalComponentCompile = function (options){
  options = asObject(options);
  return createVue(ModalServiceComponent, { props: { ...options }, appendTo: document.body });
};

export const newDialog = function (options){
  options = asObject(options);
  return new ModalComponentCompile({ title: 'alarm', ...options, theme: 'dialog' });
};

export const newMessage = function (options){
  options = asObject(options);
  return new ModalComponentCompile({ closeButton: false, ...options, theme: 'message' });
};

export const alert = function (text, icon){
  const param = asObject(text, "text");

  return promise(resolve=>{
    let $modal = newDialog({
      ...param,
      icon       : (typeof icon === "string" ? icon : false),
      closeButton: false,
      buttons    : [function ({ close }){ 
        this.innerHTML = 'ok';
        this.addEventListener("click", close);
      }],
      on: {
        close (){
          resolve($modal);
        }
      }
    });
  });
};

export const confirm = function (text, icon, buttons){
  const param = asObject(text, "html");

  return promise(resolve=>{
    let buttonFilter = buttons || [
      function (){ 
        this.innerHTML = `<i class="icon-close mr-5"></i>Cancel`;
        return false;
      },
      function (){ 
        this.innerHTML = `<i class="icon-check mr-5"></i>OK`;
        this.className += " light-blue";
        return true;
      }
    ];
    

    buttonFilter = asArry(buttonFilter).map((fn, index)=>{
      return function ({ close }){
        if(typeof fn === "function"){
          var result = Function.prototype.apply.call(fn, this, Array.prototype.slice.call(arguments));
          this.addEventListener("click", function (){
            resolve([result, index, $modal]);
            close();
          });
        }
      };
    });

    const $modal = newDialog({
      ...param,
      icon       : (typeof icon === "string" ? icon : false),
      closeButton: false,
      buttons    : buttonFilter,
      on         : {
        close (){
          // 그냥 닫았을 때
          resolve([undefined, -1, $modal]);
        }
      }
    });
  });
};

export const message = function (text, icon, delay){
  const param = asObject(text, "text");

  return promise(resolve=>{
    const $modal = newMessage({
      ...param,
      text : typeof param.text === "string" ? param.text : 'Processing',
      icon : typeof icon === "string" ? icon : false,
      delay: delay || 3000,
      on   : {
        close (){
          // 그냥 닫았을 때
          resolve([$modal]);
        }
      }
    });
  });
};
