import { asArray } from '@sepalang/pado/functions/cast'
import { isNode, isArray } from '@sepalang/pado/functions/isLike'

// eslint-disable-next-line no-use-before-define
export const window = typeof window !== "undefined" ? window : undefined
export const document = window && window.document || undefined

const TEST_ELEMENT = document && document.createElement('div')

const QUERY_SELECTOR_NAME   = 
document
  ? ('querySelectorAll' in document) ? 'querySelectorAll'
  : ('webkitQuerySelectorAll' in document) ? 'webkitQuerySelectorAll'
  : ('msQuerySelectorAll' in document) ? 'msQuerySelectorAll'
  : ('mozQuerySelectorAll' in document) ? 'mozQuerySelectorAll'
  : ('oQuerySelectorAll' in document) ? 'oQuerySelectorAll' : null 
  : null

const MATCHES_SELECTOR_NAME =
TEST_ELEMENT 
  ? ('matches' in TEST_ELEMENT) ? 'matches'
  : ('webkitMatchesSelector' in TEST_ELEMENT) ? 'webkitMatchesSelector'
  : ('msMatchesSelector' in TEST_ELEMENT) ? 'msMatchesSelector'
  : ('mozMatchesSelector' in TEST_ELEMENT) ? 'mozMatchesSelector'
  : ('oMatchesSelector' in TEST_ELEMENT) ? 'oMatchesSelector' : null
  : null

const QUERY_SELECTOR_ENGINE = function (node, selector){
  try {
    return Array.from(
      (node || document)[QUERY_SELECTOR_NAME](
        selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function (s){
          return s.replace(/\=.+\]$/, function (s){
            return '=\"' + s.substr(1, s.length - 2) + '\"]'
          })
        })
      )
    )
  } catch (e){
    console.error("QUERY_SELECTOR_ENGINE error", node, selector)
  }
}

const MATCHES_SELECTOR_ENGINE = function (node, selector){
  return node[MATCHES_SELECTOR_NAME](
    selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function (s){
      return s.replace(/\=.+\]$/, function (s){
        return '=\"' + s.substr(1, s.length - 2) + '\"]'
      })
    })
  )
}

export const nodeList = function (node, eq){
  node = asArray(node).map(item=>isNode(item) ? item : undefined)
  console.log("node", node)
  return typeof eq === "number" ? node[eq] : node
}

export const is = function (node, selectText){
  return !isNode(node) ? false : ((typeof selectText === "undefined") || selectText == "*" || selectText == "") ? true : MATCHES_SELECTOR_ENGINE(node, selectText)
}

export const query = function (query, root){
  //querySelectorSupport
  if(typeof query !== "string" || (query.trim().length == 0)) return []
  root = ((typeof root === "undefined") ? document : isNode(root) ? root : document)
  return root == document
    ? QUERY_SELECTOR_ENGINE(root, query)
    : MATCHES_SELECTOR_ENGINE(root, query)
      ? [root].concat(Array.prototype.slice.call(QUERY_SELECTOR_ENGINE(root, query)))
      : QUERY_SELECTOR_ENGINE(root, query)
}

const isNothing = function (o){ 
  if(typeof o === "undefined") return true
  if(typeof o === "string") return o.trim().length < 1
  if(typeof o === "object"){
    if(o instanceof RegExp) return false
    if(isNode(o)) return false
    if(o == null) return true
    if(isArray(o)){
      o = o.length
    } else {
      o = Object.keys(o).length
    }
  }
  if(typeof o === "number") return o < 1
  if(typeof o === "function") return false
  if(typeof o === "boolean") return !this.Source
  return true
}

export const nodeAttr = function (node, v1, v2){
  if(!isNode(node)){ return null }
  if(arguments.length === 1){
    const attributes = asArray(node.attributes)
    attributes.reduce((dest, attr)=>{
      dest[attr.name] = node.getAttribute(attr.name)
      return dest
    }, {})
  } else if(typeof v1 === "object"){
    for(var k in v1) node.setAttribute(k, v1[k])
  } else if(typeof v1 === "string"){
    var readMode   = typeof v2 === "undefined"
    var lowerKey = v1.toLowerCase()
    switch (lowerKey){
      case "readonly":
        if("readOnly" in node){
          if(readMode){
            return node.readOnly
          } else {
            node.readOnly = v2
            return node
          }
        } 
        break
      case "disabled": case "checked":
        if(lowerKey in node){
          if(readMode){
            return node[lowerKey]
          } else {
            node[lowerKey] = v2
            return node
          }
        }
        break
    }
    if(readMode){
      var result = (node.getAttribute && node.getAttribute(v1)) || null
      if(!result){
        var attrs = node.attributes
        if(!isNothing(attrs)){
          var length = attrs.length
          for(var i = 0; i < length; i++){
            if(attrs[i].nodeName === v1){
              result = attrs[i].value
              if(typeof result === "undefined") result = attrs[i].nodeValue
            }
          } 
        }
      }
      return result
    } else {
      node.setAttribute(v1, v2)
    }
  }
  return node
}

export const toCSSQueryString = function (node, detail){
  var t = nodeList(node, 0)[0]
  if(!t) return undefined
  var tag = t.tagName.toLowerCase()
  let tid, tclass, tname, tattr
  tid = tclass = tname = tattr = ''
    
  const attrHash = nodeAttr(t)
  
  Object.keys(attrHash).forEach(attrKey=>{
    switch (attrKey){
      case "id" :
        var id = t.getAttribute(attrKey)
        id.length && (tid = '#' + id) 
        break
      case "class":
        tclass = t.getAttribute(attrKey).trim().replace(/\s\s/g, ' ').split(' ').join('.')
        if(tclass) tclass = "." + tclass
        break
      case "name" : tname = "[name=" + t.getAttribute(attrKey) + "]"; break
      case "value": break
      default :
        if(detail == true){
          const attrValue = t.getAttribute(attrKey)
          tattr += ((attrValue == '' || attrValue == null) ? ("[" + attrKey + "]") : ("[" + attrKey + "=" + attrValue + "]"))
        }
        break
    }
  })

  return tag + tid + tclass + tname + tattr
}
