import { rect } from "@sepalang/pado/modules/stance"
import { likeArray, isNode } from "@sepalang/pado/functions/isLike"

export const getNode = function (el){
  let select = likeArray(el) ? el[0] : el
  return isNode(select) ? select : undefined
}

export const isElement = function (el){
  return el instanceof Element
}

export const getElementOffsetRect = function (el){
  el = getNode(el)
  
  if(!isElement(el)){
    return rect({
      x     : 0, y     : 0, left  : 0, top   : 0, width : 0, height: 0, right : 0, bottom: 0, valid : false
    })
  }
  
  let offsetLeft = 0
  let offsetTop  = 0
  let offsetWidth = el.offsetWidth
  let offsetHeight = el.offsetHeight
  
  do {
    offsetLeft += el.offsetLeft
    offsetTop += el.offsetTop
    el = el.offsetParent
      
    if((!el.html && !el.body) && /absoute|relative|fixed/.test(window.getComputedStyle(el).getPropertyValue("position"))){
      el = null
    }
  } while(el)
  
  
  return rect({
    x     : offsetLeft,
    y     : offsetTop,
    left  : offsetLeft,
    top   : offsetTop,
    width : offsetWidth,
    height: offsetHeight,
    valid : true
  })
}

const getBoundingRect = function (el){
  el = getNode(el)
  
  if(!isElement(el)){
    return rect({
      x     : 0, y     : 0, left  : 0, top   : 0, width : 0, height: 0, right : 0, bottom: 0, valid : false
    })
  }
  
  const doc = document
  const win = window
  const body = doc.body

  let offsetX = win.pageXOffset !== undefined ? win.pageXOffset
    : (doc.documentElement || body.parentNode || body).scrollLeft
  let offsetY = win.pageYOffset !== undefined ? win.pageYOffset
    : (doc.documentElement || body.parentNode || body).scrollTop
  
  const boundingRect = el.getBoundingClientRect()

  if(el !== body){
    let parent = el.parentNode
    while(parent && parent !== body){
      offsetX += parent.scrollLeft
      offsetY += parent.scrollTop
      parent = parent.parentNode
    }
  }
  
  return rect({
    x     : boundingRect.left + offsetX,
    y     : boundingRect.top + offsetY,
    left  : boundingRect.left + offsetX,
    top   : boundingRect.top + offsetY,
    width : boundingRect.width,
    height: boundingRect.height,
    right : boundingRect.right + offsetX,
    bottom: boundingRect.bottom + offsetY,
    valid : true
  })
}

export const getElementBoundingRect = function (el){
  el = getNode(el)
  
  //const doc  = document
  const win  = window
  
  const elRect = getBoundingRect(el).toJSON()
  
  if(elRect.valid === false){
    return rect(elRect)
  }
  
  let current = el
  let parent  = el.parentNode
  
  do {
    if(parent && (!parent.html && !parent.body) && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))){
      const { top, left } = getBoundingRect(parent)
      elRect.top -= top
      elRect.left -= left
      elRect.right = elRect.left + elRect.width
      elRect.bottom = elRect.top + elRect.height
      current = parent = null
    } else if(!parent){
      current = null
    } else {
      current = parent
      parent = current.parentNode
    }
  } while(parent)
  
  return rect(elRect)
}

export const windowRect = function (){
  return rect({
    left  : window.screenLeft || window.screenX,
    top   : window.screenTop || window.screenY,
    width : window.outerWidth,
    height: window.outerHeight
  })
}

export const screenRect = function (){
  return rect({
    left  : 0,
    top   : 0,
    width : screen.width,
    height: screen.height
  })
}
