let $;

try {
  $ = require('jquery');
} catch(e) {
  try {
    $ = jQuery || $;
    if(!$){
      throw new Error("No jQuery");
    }
  } catch(e2){
    throw new Error("pado/dom sometimes requires jquery.");
  }
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
  }
});

export default $;