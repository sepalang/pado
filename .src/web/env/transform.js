import { likeString, isArray } from "../../functions/isLike"
import { multiplyMatrix } from "../../functions/matrix"

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
  let transformStyle     = computedStyle.transform || computedStyle.webkitTransform || computedStyle.MozTransform || computedStyle.msTransform
  let matrix  = parseMatrix(transformStyle)
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
    transformStyle
  }
}

export const transformStyleVariant = (function (likeString, isArray){
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
    
    const { translateX, translateY, translateZ, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ } = props
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
    parseTransformValue(translateZ, singleValueHook(translateVars, "px", 2))
    parseTransformValue(scaleX, singleValueHook(scaleVars, "", 0))
    parseTransformValue(scaleY, singleValueHook(scaleVars, "", 1))
    parseTransformValue(scaleZ, singleValueHook(scaleVars, "", 2))
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
}(likeString, isArray))


export const transformMatrixVariant = function (variant){
  const RSIN = (v)=>{
    return Math.sin(Math.PI * (v / 180))
  }
  const RCOS = (v)=>{
    return Math.cos(Math.PI * (v / 180))
  }
  const UDF = undefined
  const multiplyMatrixList = []
  
  let {
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    scale = 1,
    scaleX = UDF,
    scaleY = UDF,
    scaleZ = UDF,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0
  } = variant
  
  //scaleX = scaleX === UDF ? scale : scaleX
  //scaleY = scaleY === UDF ? scale : scaleY
  //scaleZ = scaleZ === UDF ? scale : scaleZ
  
  
  multiplyMatrixList.push([
    [1, 0, 0, translateX / scaleX],
    [0, 1, 0, translateY / scaleY],
    [0, 0, 1, translateZ / scaleZ],
    [0, 0, 0, 1]
  ])
  
  multiplyMatrixList.push([
    [scaleX === UDF ? scale : scaleX, 0, 0, 0],
    [0, scaleY === UDF ? scale : scaleY, 0, 0],
    [0, 0, scaleZ === UDF ? scale : scaleZ, 0],
    [0, 0, 0, 1]
  ])
  
  rotateX && multiplyMatrixList.push([
    [1, 0, 0, 0],
    [0, RCOS(rotateX), -RSIN(rotateX), 0],
    [0, RSIN(rotateX), RCOS(rotateX), 0],
    [0, 0, 0, 1]
  ])
  
  rotateY && multiplyMatrixList.push([
    [RCOS(rotateY), 0, RSIN(rotateY), 0],
    [0, 1, 0, 0],
    [-RSIN(rotateY), 0, RCOS(rotateY), 0],
    [0, 0, 0, 1]
  ])
  
  rotateZ && multiplyMatrixList.push([
    [RCOS(rotateZ), -RSIN(rotateZ), 0, 0],
    [RSIN(rotateZ), RCOS(rotateZ), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ])
  
  return multiplyMatrixList.reduce((dest, matrix)=>{
    if(!dest) return matrix
    return multiplyMatrix(dest, matrix)
  })
}
