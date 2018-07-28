import { rect } from "../../modules/stance"
import { likeString, isArray, likeArray, isNode } from "../../functions/isLike"
import { asArray } from "../../functions/cast"

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
  
  const doc  = document
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

export const getElementTransformMatrix = function (el){
  const computedStyle       = getComputedStyle(el, null)
  const computedMatrixParam = computedStyle.transform || computedStyle.webkitTransform || computedStyle.MozTransform || computedStyle.msTransform
  const c = computedMatrixParam.split(/\s*[(),]\s*/).slice(1, -1)
  if(c.length === 6){
    return [
      [+c[0], +c[2], 0, +c[4]],
      [+c[1], +c[3], 0, +c[5]],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]
  } else if(c.length === 16){
    return [
      [+c[0], +c[4], +c[8], +c[12]],
      [+c[1], +c[5], +c[9], +c[13]],
      [+c[2], +c[6], +c[10], +c[14]],
      [+c[3], +c[7], +c[11], +c[15]]
    ]
  }
  return null
}

/* https://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/ */
const parseMatrix = (function (){
  const DEFAULT_MATRIX = {
    m11: 1,
    m21: 0,
    m31: 0,
    m41: 0,
    m12: 0,
    m22: 1,
    m32: 0,
    m42: 0,
    m13: 0,
    m23: 0,
    m33: 1,
    m43: 0,
    m14: 0,
    m24: 0,
    m34: 0,
    m44: 1
  }
  
  return function (matrixParam){
    let c = matrixParam.split(/\s*[(),]\s*/).slice(1, -1)
    let matrix

    if(c.length === 6){
      // 'matrix()' (3x2)
      matrix = {
        m11: +c[0],
        m21: +c[2],
        m31: 0,
        m41: +c[4],
        m12: +c[1],
        m22: +c[3],
        m32: 0,
        m42: +c[5],
        m13: 0,
        m23: 0,
        m33: 1,
        m43: 0,
        m14: 0,
        m24: 0,
        m34: 0,
        m44: 1
      }
    } else if(c.length === 16){
      // matrix3d() (4x4)
      matrix = {
        m11: +c[0],
        m21: +c[4],
        m31: +c[8],
        m41: +c[12],
        m12: +c[1],
        m22: +c[5],
        m32: +c[9],
        m42: +c[13],
        m13: +c[2],
        m23: +c[6],
        m33: +c[10],
        m43: +c[14],
        m14: +c[3],
        m24: +c[7],
        m34: +c[11],
        m44: +c[15]
      }
    } else {
      // handle 'none' or invalid values.
      matrix = Object.assign({}, DEFAULT_MATRIX)
    }
    return matrix
  }
}())

/* https://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/ */
export const getElementTransform = function (el){
  let computedStyle = getComputedStyle(el, null)
  let val     = computedStyle.transform || computedStyle.webkitTransform || computedStyle.MozTransform || computedStyle.msTransform
  let matrix  = parseMatrix(val)
  let rotateY = Math.asin(-matrix.m13)
  let rotateX = Math.atan2(matrix.m23, matrix.m33)
  let rotateZ = Math.atan2(matrix.m12, matrix.m11)
  
  return {
    rotate: {
      x: rotateX,
      y: rotateY,
      z: rotateZ
    },
    translate: {
      x: matrix.m41,
      y: matrix.m42,
      z: matrix.m43
    },
    matrix        : matrix,
    transformStyle: val
  }
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


export const transformVariant = (function (){
  const TRANSFORM_UNDEFINED = "0"
  
  const parseTransformValue = function (value, matched){
    likeString(value) && matched(value)
  }
  
  const parseTransformMultivalue = function (value, matched){
    isArray(value) && matched(value)
  }
  
  const valueProcess = function (value, unit){
    if(typeof value === "number"){
      return `${value}${unit}`
    }
    if(typeof value === "string" && value.trim() !== ""){
      return value
    }
    return undefined
  }
  
  const singleValueHook = function (bag, unit, i){
    return (value)=>{
      const parseValue = valueProcess(value, unit)
      if(parseValue === undefined) return
      bag[i] = parseValue
    }
  }
  
  const multiValueHook = function (bag, unit){
    return (multiValue)=>{
      multiValue.forEach((value, i)=>{
        const parseValue = valueProcess(value, unit)
        if(parseValue === undefined) return
        bag[i] = parseValue
      })
    }
  }
  
  const oneNumberToTwoArray = function (one){
    return typeof one === "number" ? [one, one] : one
  }
  
  return function (props){
    if(typeof props !== "object"){
      return ""
    }
    const { translateX, translateY, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ } = props
    let { translate, translate3d, scale, scale3d, rotate, rotate3d } = props
    translate = oneNumberToTwoArray(translate)
    translate3d = oneNumberToTwoArray(translate3d)
    scale = oneNumberToTwoArray(scale)
    scale3d = oneNumberToTwoArray(scale3d)
    if(typeof rotate === "number"){
      rotate = [undefined, undefined, rotate]
    }
    if(typeof rotate3d === "number"){
      rotate3d = [rotate3d]
    }
    
    const translateVars = Array(3).fill(TRANSFORM_UNDEFINED)
    const scaleVars  = Array(3).fill(TRANSFORM_UNDEFINED)
    const rotateVars = Array(4).fill(TRANSFORM_UNDEFINED)
    const perspective = valueProcess(props.perspective, "px")
    const result = []
    
    parseTransformMultivalue(translate, multiValueHook(translateVars, "px"))
    parseTransformMultivalue(translate3d, multiValueHook(translateVars, "px"))
    parseTransformMultivalue(scale, multiValueHook(scaleVars, "%"))
    parseTransformMultivalue(scale3d, multiValueHook(scaleVars, "%"))
    parseTransformMultivalue(rotate, multiValueHook(rotateVars, "deg"))
    parseTransformMultivalue(rotate3d, multiValueHook(rotateVars, "deg"))
    parseTransformValue(translateX, singleValueHook(translateVars, "px", 0))
    parseTransformValue(translateY, singleValueHook(translateVars, "px", 1))
    parseTransformValue(scaleX, singleValueHook(scaleVars, "%", 0))
    parseTransformValue(scaleY, singleValueHook(scaleVars, "%", 1))
    parseTransformValue(scaleZ, singleValueHook(scaleVars, "%", 2))
    parseTransformValue(rotateX, singleValueHook(rotateVars, "deg", 0))
    parseTransformValue(rotateY, singleValueHook(rotateVars, "deg", 1))
    parseTransformValue(rotateZ, singleValueHook(rotateVars, "deg", 2))
    
    perspective && result.push(`perspective(${perspective})`)
    
    if(translateVars.some(v=>v !== TRANSFORM_UNDEFINED)){
      translateVars[2] === TRANSFORM_UNDEFINED 
        ? result.push(`translate(${translateVars[0]},${translateVars[1]})`)
        : result.push(`translate3d(${translateVars[0]},${translateVars[1]},${translateVars[2]})`)
    }
    if(scaleVars.some(v=>v !== TRANSFORM_UNDEFINED)){
      scaleVars[2] === TRANSFORM_UNDEFINED 
        ? result.push(`scale(${scaleVars[0]},${scaleVars[1]})`)
        : result.push(`scale3d(${scaleVars[0]},${scaleVars[1]},${scaleVars[2]})`)
    }
    if(rotateVars.some(v=>v !== TRANSFORM_UNDEFINED)){
      if(rotateVars[0] === TRANSFORM_UNDEFINED && rotateVars[1] === TRANSFORM_UNDEFINED && rotateVars[2] !== TRANSFORM_UNDEFINED){
        return result.push(`rotate(${rotateVars[2]})`)
      }
      if(rotateVars[0] !== TRANSFORM_UNDEFINED){
        result.push(`rotate3d(1,0,0,${rotateVars[0]})`)
      }
      if(rotateVars[1] !== TRANSFORM_UNDEFINED){
        result.push(`rotate3d(0,1,0,${rotateVars[1]})`)
      }
      if(rotateVars[2] !== TRANSFORM_UNDEFINED){
        result.push(`rotate3d(0,0,1,${rotateVars[2]})`)
      }
    }
    
    return result.join(" ")
  }
}())

export const svgPathWithVertex = function (vertex, close){
  let dValue = ""
  
  vertex.forEach((point, index)=>{
    const prefix = index === 0 ? 'M' : 'L'
    dValue += `${prefix}${point.x} ${point.y} `
  })
  
  if(!!dValue && close === true){
    dValue += " Z"
  }
  
  return dValue
}

const SVGBuilder = function (){
  this.drawVariants = []
}

SVGBuilder.prototype = {
  addPath (points, attributes){
    this.drawVariants.push({
      tag   : "path",
      attributes,
      params: points
    })
    return this
  },
  createElement (){
    const svgTag = document.createElementNS('http://www.w3.org/2000/svg', "svg")
    let realMaxWidth  = 0
    let realMaxHeigth = 0 
    
    this.drawVariants.forEach(({ tag, attributes, params})=>{
      if(tag === "path"){
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', "path")
        
        if(typeof attributes !== "object"){
          attributes = {}
        }
        
        pathElement.setAttribute("fill", attributes['fill'] || "transparent")
        pathElement.setAttribute("stroke", attributes['stroke'] || "gray")
        pathElement.setAttribute("stroke-width", attributes['strokeWidth'] || attributes['stroke-width'] || "1")
        pathElement.setAttribute("stroke-linecap", "butt")
        pathElement.setAttribute("stroke-linejoin", "miter")
        
        const dValue = svgPathWithVertex(params)
        params.forEach(point=>{
          if(point.x > realMaxWidth) realMaxWidth = point.x
          if(point.y > realMaxHeigth) realMaxHeigth = point.y
        })
        
        pathElement.setAttribute("d", dValue)
        svgTag.appendChild(pathElement)
      }
    })
    svgTag.setAttribute("style", "overflow:visible;")
    svgTag.setAttribute("width", realMaxWidth)
    svgTag.setAttribute("height", realMaxHeigth)
    return svgTag
  }
}

export const makeSVG = function (){
  return new SVGBuilder()
}
