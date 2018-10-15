import { asArray } from '@sepalang/pado/functions/cast'
import { isNode } from '@sepalang/pado/functions/isLike';

const QUERY_SELECTOR_ENGINE = function(node,selector){
  try {
    return Array.from(
      (node||document)[QUERY_SELECTOR_NAME](
        selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){
          return s.replace(/\=.+\]$/,function(s){
            return '=\"' + s.substr(1,s.length-2) + '\"]';
          })
        })
      )
    );
  } catch(e) {
    console.error("QUERY_SELECTOR_ENGINE error",node,selector);
  }
};

const MATCHES_SELECTOR_ENGINE = function(node,selector){
  return node[MATCHES_SELECTOR_NAME](
    selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){
      return s.replace(/\=.+\]$/,function(s){
        return '=\"' + s.substr(1,s.length-2) + '\"]';
      })
    })
  );
}

export const nodeList = function(node, eq){
  node = asArray(node).map(item=>isNode(item)?item:undefined);
  return typeof eq === "number" ? node[eq] : node;
};

export const is = function(node,selectText){
  return !isNode(node) ? false : ((typeof selectText === "undefined") || selectText == "*" || selectText == "") ? true : MATCHES_SELECTOR_ENGINE(node,selectText);
};

export const query = function(query,root){
  //querySelectorSupport
  if(typeof query !== "string" || (query.trim().length == 0)) return [];
  root = ((typeof root === "undefined") ? document : isNode(root) ? root : document);
  return root == document ?
    QUERY_SELECTOR_ENGINE(root,query) :
    MATCHES_SELECTOR_ENGINE(root,query) ?
    [root].concat(Array.prototype.slice.call(QUERY_SELECTOR_ENGINE(root,query))) :
    QUERY_SELECTOR_ENGINE(root,query);
};

export const toCSSQueryString = function(node, detail){
  var t = nodeList(node, 0)[0];
  if(!t) return undefined;
  var tag = t.tagName.toLowerCase();
  var tid = tclass = tname = tattr = tvalue = '';
  N.propEach(N.NODEKIT.attr(t),function(value,sign){
    switch(sign){
    case "id"   :
      var id = t.getAttribute(sign);
      id.length && (tid='#'+id) ;
      break;
    case "class":
      tclass = t.getAttribute(sign).trim().replace(/\s\s/g,' ').split(' ').join('.');
      if(tclass) tclass = "." + tclass;
      break;
      case "name" : tname  = "[name="+t.getAttribute(sign)+"]"; break;
      case "value": break;
      default     :
      if(detail == true) {
        attrValue = t.getAttribute(sign);
        tattr += ( (attrValue == '' || attrValue == null) ? ("["+sign+"]") : ("["+sign+"="+attrValue+"]") );
      }
      break;
    }
  });

  if(detail == true) {
    if(!/table|tbody|thead|tfoot|ul|ol/.test(tag)) {
      var tv = N.node.value(t);
      if(typeof tv !== undefined || tv !== null ) if(typeof tv === 'string' && tv.length !== 0) tvalue = '::'+tv;
      if(typeof tvalue === 'string') tvalue = tvalue.trim();
    }
  }

  return tag+tid+tclass+tname+tattr+tvalue;
}
