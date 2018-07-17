import { likeNumber } from '../../../../../../.src/functions';
/*
  usage
  HighOrderRect([["width","height","size","rect"],[20,20]])
  this.width = 20
  this.height = 20
  this.size
  this.sizeValue
  this.rectValue
*/
//
//
const DEFAULT_RECT_SIZE_VALUE = 20;
export default function (...options){
  if (!options.length){
    options = [[[], []]];
  }
  const props = {};
  const computed = {};

  options.forEach(([ keys = [], defaultValues = [] ])=>{
    const [widthKey = 'width', heightKey = 'height', sizeKey = 'size', rectKey = 'rect'] = keys;
    const [widthParam = DEFAULT_RECT_SIZE_VALUE, heightParam = DEFAULT_RECT_SIZE_VALUE] = defaultValues;

    Object.assign(props, {
      [ widthKey ] : { default: widthParam },
      [ heightKey ]: { default: heightParam },
      [ sizeKey ]  : {}
    });

    const sizeValueKey = sizeKey + 'Value';
    const rectValueKey = rectKey + 'Value';

    Object.assign(computed, {
      [ sizeValueKey ]: function (){
        return likeNumber(this[sizeKey]) ? parseFloat(this[sizeKey]) : undefined;
      },
      [ rectValueKey ]: function (){
        const width = typeof this[sizeValueKey] === 'number' ? this[sizeValueKey] : parseInt(this[widthKey], 10);
        const height = typeof this[sizeValueKey] === 'number' ? this[sizeValueKey] : parseInt(this[heightKey], 10);
        return { width, height };
      }
    });
  });

  const highOrderMixins = { props, computed };
  return highOrderMixins;
}
