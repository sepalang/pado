import { 
  WINDOW,
  DOCUMENT,
  TEST_ELEMENT,
  QUERY_SELECTOR_NAME,
  MATCHES_SELECTOR_NAME,
  SUPPORT_COMPUTED_STYLE
} from './webenv'

import { asArray } from '@sepalang/pado/functions/cast'
import { camelCase } from '@sepalang/pado/functions/castString'
import { isNode, isArray } from '@sepalang/pado/functions/isLike'

const QUERY_SELECTOR_ENGINE = function (node, selector){
  try {
    return Array.from(
      (node || DOCUMENT)[QUERY_SELECTOR_NAME](
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
  return typeof eq === "number" ? node[eq] : node
}

export const is = function (node, selectText){
  return !isNode(node) ? false : ((typeof selectText === "undefined") || selectText == "*" || selectText == "") ? true : MATCHES_SELECTOR_ENGINE(node, selectText)
}

export const query = function (query, root){
  //querySelectorSupport
  if(typeof query !== "string" || (query.trim().length == 0)) return []
  root = ((typeof root === "undefined") ? DOCUMENT : isNode(root) ? root : DOCUMENT)
  return root == DOCUMENT
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


const supportPrefix = {};

((()=>{
  const lab3Prefix = function (s){
    if(s.match(/^Webkit/)) return "-webkit-"
    if(s.match(/^Moz/)) return "-moz-"
    if(s.match(/^O/)) return "-o-"
    if(s.match(/^ms/)) return "-ms-"
    return ""
  }

  //transform
  "transform WebkitTransform MozTransform OTransform msTransform".replace(/\S+/g, function (s){
    if(s in TEST_ELEMENT.style){
      supportPrefix["transform"] = lab3Prefix(s)
    } 
  })

  //transition
  "transition WebkitTransition MozTransition OTransition msTransition".replace(/\S+/g, function (s){
    if(s in TEST_ELEMENT.style){
      supportPrefix["transition"] = lab3Prefix(s)
    }
  })
})())

      
const getCSSName = function (cssName){
  if(typeof cssName !== "string"){
    return cssName + ""
  }
  cssName.trim()
  for(var prefix in supportPrefix){
    if(cssName.indexOf(prefix) === 0){
      var sp = supportPrefix[prefix]
      if(sp.length) return sp + cssName
    }
  }
  return cssName
}

export const nodeCss = function (node, styleName, value){
  if(typeof styleName === "undefined"){
    return SUPPORT_COMPUTED_STYLE ? WINDOW.getComputedStyle(node, null) : node.currentStyle
  }
  if(typeof styleName === "string"){
    //mordern-style-name
    var prefixedName = getCSSName(styleName)
    if(arguments.length < 3){
      return SUPPORT_COMPUTED_STYLE ? WINDOW.getComputedStyle(node, null).getPropertyValue(prefixedName) : node.currentStyle[camelCase(prefixedName)]
    }
    //set
    var wasStyle = nodeAttr(node, "style") || ""
    if(value === null){
      wasStyle = wasStyle.replace(new RegExp(`(-webkit-|-o-|-ms-|-moz-|)${styleName}(.?:.?|)[^\;]+\;`, "g"), ()=>'')
      nodeAttr(node, "style", wasStyle)
    } else {
      var prefixedValue = getCSSName(value)
      //set //with iefix
      wasStyle = wasStyle.replace(new RegExp(`(-webkit-|-o-|-ms-|-moz-|)${styleName}.?:.?[^\;]+\;`, "g"), "")
      nodeAttr(node, "style", prefixedName + ":" + prefixedValue + ";" + wasStyle)
    }
  } else if(typeof styleName === "object"){
    const styleProps = Object.keys(styleName)
    styleProps.forEach((val, name)=>{
      if(typeof name === "string"){ nodeCss(node, name, val) }
    })
  }
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
