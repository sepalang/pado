import { rect } from './baseDimenstion'

export const rectWithRect = function({left:refX, top:refY, width:refWidth, height:refHeight}, { left=0, top=0, width, height, ...targetProps },position){
  switch(position){
  case "center":
    return rect({
      left:refX + refWidth/2 - width/2,
      top:refY + refHeight/2 - height/2,
      width:width,
      height:height,
      ...targetProps
    });
  default:
    return rect({ left, top, width, height, ...targetProps});
  }
}