let $;

try {
  (window,document);
  $ = require('jquery');
} catch(e){
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<html><head><meta charset="utf-8"></head><body></body></html>',{
    contentType: "text/html",
    userAgent: "Mellblomenator/9000",
    includeNodeLocations: true
  });
  global.window = dom.window;
  global.document = dom.document;
  $ = require('jquery');
}

$.fn.extend({
  //파라메터 노드가 제이쿼리가 가진 노드 안에 있는지 확인
  containsIn (node){
    var [ target ] = $(node).eq(0);
    if(target) for(var i=0,l=this.length;i<l;i++){
      if(this[i] === target) return true;
      if(this.eq(i).find(target).length) return true;
    }
    return false;
  },
  //파라메터 노드가 제이쿼리가 가진 노드 밖에 있는지 확인
  containsOut (node){
    return !this.containsIn(node);
  },
  offsetAll (){
    const [ element ] = this.eq(0);
    let result;
    
    if(!element){
      return;
    }
    
    if(element["innerWidth"]){
      result = {
        top:0,
        left:0,
        width:window.innerWidth,
        height:window.innerHeight,
        right:window.innerWidth,
        bottom:window.innerHeight
      }
    } else {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = element;
      result = {
        top:offsetTop,
        left:offsetLeft,
        width:offsetWidth,
        height:offsetHeight,
        right:offsetLeft + offsetWidth,
        bottom:offsetTop + offsetHeight
      }
    }
    
    return result;
  }
});

export default $;