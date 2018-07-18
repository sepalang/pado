import Vue from 'vue';

const vueCompileWithFile = function (vueFile, delegates){
  const vueInstance = (function (){
    const renderOptions = {};
    const compileOptions = {
      mixins: [],
      render: h=>h(vueFile, renderOptions)
    };

    if(typeof delegates === 'object'){
      for(const key in delegates){
        if(delegates.hasOwnProperty(key)){
          switch (key){
            case 'props':
            case 'on':
              if(typeof delegates[key] === 'object'){
                renderOptions[key] = delegates[key];
              }
              break;
            case 'mixins':
              delegates.mixins && delegates.mixins.forEach(e=>{ compileOptions.mixins.push(e); });
              break;
            case 'render':
              console.warn(`Not allow '${key}' option`, delegates);
              break;
            case 'appendTo':
              break;
            default:
              compileOptions[key] = delegates[key];
              break;
          }
        }
      }
    }

    return new Vue(compileOptions);
  }());

  let appendToParam = delegates.appendTo;
  if(typeof appendToParam === 'object'){
    let mountElement = document.createElement('div');
    vueInstance.$mount(mountElement);
    mountElement = vueInstance.$el || mountElement;

    // jquery
    if(appendToParam.eq){
      appendToParam = appendToParam.eq(0);
      appendToParam.append(mountElement);
    } else if(appendToParam.appendChild){
      appendToParam.appendChild(mountElement);
    } else {
      console.error('appendToParam is worng', appendToParam);
    }
  }

  return vueInstance;
};

// vue file compile
export const createVue = vueCompileWithFile;
// promisify render after
export const nextTick = (fn = undefined)=>new Promise(resolve=>Vue.nextTick(()=>{ typeof fn === 'function' ? resolve(fn()) : resolve(); }));
// pormisify timeout 0
export const nextQueue = (fn = undefined, time = 0)=>new Promise(resolve=>setTimeout(()=>{ typeof fn === 'function' ? resolve(fn()) : resolve(); }, time));
