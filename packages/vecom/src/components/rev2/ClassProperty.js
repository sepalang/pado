//import { Vue as _Vue, Component as _Component, Model as _Model, Prop as _Prop } from 'nuxt-property-decorator';
//import { createDecorator } from 'vue-class-component';
//import { namespace } from 'vuex-class';
//import _get from 'lodash/get';
//import _set from 'lodash/set';
//import { asArray } from '@/utils';
//
//const VOID0FN = (()=>void 0);
//
//const parseDecorateOption = ({ componentOptions, map, key })=>{
//  const originalPath = typeof map === "string" ? map : key;
//  let defaultValueFn = VOID0FN;
//  
//  if(typeof map === "object" && map){
//    const { default:defaultParam } = map;
//    if(typeof defaultParam === "function"){
//      defaultValueFn = ()=>defaultParam();
//    }
//  }
//  
//  return { originalPath, defaultValueFn };
//};
//
//const touchComponentOption = (componentOptions, propName="computed")=>{
//  if(!componentOptions[propName]){
//    componentOptions[propName] = {};
//  }
//  return componentOptions[propName];
//};
//
//export const Vue = _Vue;
//
//export const Component = _Component;
//
//export const Model = _Model;
//
//export const Prop = _Prop;
//
////Like distructure property
//export const Delegate = (map?):any=>{
//  return createDecorator((componentOptions, key)=>{
//    const { originalPath } = parseDecorateOption({ componentOptions, map, key });
//
//    touchComponentOption(componentOptions, "computed")[key] = {
//      get(){
//        return _get(this,originalPath);
//      },
//      set(value){
//        return _set(this,originalPath,value);
//      }
//    }
//  });
//};
//
////Watch Refs change
//export const Refs = (map)=>{
//  return createDecorator((componentOptions, key)=>{
//    const { originalPath, defaultValueFn } = parseDecorateOption({ componentOptions, map, key });
//    
//    const watchRefKey = `zzWatchRefsKey$${originalPath}$${key}$Count`;
//    const mixinsOption = componentOptions["mixins"] = asArray(componentOptions["mixins"]);
//    
//    
//    // 😍 mixins 로 업데이트 잘 되는지 확인해용
//    
//    mixinsOption.push({
//      data:()=>({ [watchRefKey]:0 }),
//      updated:()=>{ this[watchRefKey]++; }
//    })
//    
//    
//    touchComponentOption(componentOptions, "computed")[key] = {
//      get(){
//        const [ target ] = [_get(this.$refs,[originalPath]), this[watchRefKey]];
//        return target ? target : defaultValueFn();
//      }
//    }
//  });
//}
//
//export const vuexNamespace = (path):any=>{
//  const { Action, Mutation } = namespace(path);
//  const namespaceInstance = { Action, Mutation, Getter:undefined, Method:undefined, State:undefined };
//    
//  namespaceInstance["Getter"] = function(map, namespace:string|undefined){
//    return createDecorator((componentOptions, key)=>{
//      const { originalPath } = parseDecorateOption({ componentOptions, map, key });
//
//      touchComponentOption(componentOptions, "computed")[key] = {
//        get(){
//          const { $store:{ getters } } = this;
//          return getters[`${path}/${originalPath}`];
//        }
//      };
//    });
//  };
//    
//  namespaceInstance["State"] = function(map, namespace:string|undefined){
//    return createDecorator((componentOptions, key)=>{
//      const { originalPath } = parseDecorateOption({ componentOptions, map, key });
//
//      touchComponentOption(componentOptions, "computed")[key] = {
//        get(){
//          const { $store:{ state } } = this;
//          return _get(state,`${path}.${originalPath}`);
//        },
//        set(value){
//          const { $store:{ state } } = this;
//          return _set(state, `${path}.${originalPath}`, value);
//        }
//      };
//    });
//  };
//    
//  try {
//    const { methods } = require(`@/store/${path}.ts`);
//    namespaceInstance["Method"] = (map, namespace:string|undefined)=>{
//      return createDecorator((componentOptions, key) => {
//        const { originalPath } = parseDecorateOption({ componentOptions, map, key });
//        const storeMethod = methods[originalPath];
//        
//        if(typeof storeMethod === "function"){
//          touchComponentOption(componentOptions, "methods")[key] = storeMethod;
//        } else if(typeof storeMethod === "object" && storeMethod){
//          touchComponentOption(componentOptions, "computed")[key]= ()=>storeMethod;
//        } else {
//          throw Error(`${originalPath} must be function or instance`);
//        }
//      });
//    }
//  } catch(e){
//    namespaceInstance["Method"] = (map, namespace:string|undefined)=>{ 
//      return createDecorator((componentOptions, key)=>{
//        const { originalPath } = parseDecorateOption({ componentOptions, map, key });
//          
//        touchComponentOption(componentOptions, "methods")[key] = (function(){
//          console.log(`Not working ${originalPath}`, e);
//        } as any);
//      })
//    };
//  }
//  
//  return namespaceInstance;
//};
