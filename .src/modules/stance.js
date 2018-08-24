import { isArray, isNumber } from '../functions/isLike'
import { asArray } from '../functions/cast'
import { validMatrix, multiplyMatrix } from '../functions/matrix'
import { makeMatrixArray } from './matrix'


const likePoint = function (p){
  return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y")
}

const calcTransformedPoint = (__ref, { matrix, perspectiveOrigin })=>{
  // yet support affin
  //let perspectiveVar = (this.meta && this.meta.perspective)
  //perspectiveVar = !isNumber(perspectiveVar) ? 0 : perspectiveVar;
  //perspectiveVar = -1/perspectiveVar;
  //perspectiveVar = isInfinity(perspectiveVar) ? 0 : (perspectiveVar || 0) ;
  if(!matrix) return
  
  const transformPoint = {}
  const {x:px = 0, y:py = 0, z:pz = 0} = perspectiveOrigin || {x: 0, y: 0, z: 0}
  const [[x], [y], [z], [w]] = multiplyMatrix(matrix, [[__ref.x - px], [__ref.y - py], [__ref.z - pz], [__ref.w]])
  
  transformPoint.x = x + px + matrix[0][3]
  transformPoint.y = y + py + matrix[1][3]
  transformPoint.z = z + pz + matrix[2][3]
  transformPoint.w = w
  
  return transformPoint
}

const Point = function (x = 0, y = 0, z = 0, w = 1, meta){
  // base point config
  const __ref = { x, y, z, w }
  let __meta = {}
  let __transformedPoint
  
  Object.defineProperties(this, {
    x: { 
      enumerable: true,
      get       : ()=>{
        if(this.transform === true){
          !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, this.meta))
          return __transformedPoint ? __transformedPoint.x : __ref.x
        }
        return __ref.x
      }, 
      set: v=>{
        __transformedPoint = undefined
        __ref.x = v
      }
    },
    y: { 
      enumerable: true,
      get       : ()=>{
        if(this.transform === true){
          !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, this.meta))
          return __transformedPoint ? __transformedPoint.y : __ref.y
        }
        return __ref.y
      }, 
      set: v=>{
        __transformedPoint = undefined
        __ref.y = v
      }
    },
    z: { 
      enumerable: true,
      get       : ()=>{
        if(this.transform === true){
          !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, this.meta))
          return __transformedPoint ? __transformedPoint.z : __ref.z
        }
        return __ref.z
      }, 
      set: v=>{
        __transformedPoint = undefined
        __ref.z = v
      }
    },
    w: { 
      enumerable: true,
      get       : ()=>{
        if(this.transform === true){
          !__transformedPoint && (__transformedPoint = calcTransformedPoint(__ref, this.meta))
          return __transformedPoint ? __transformedPoint.w : __ref.w
        }
        return __ref.w
      }, 
      set: v=>{
        __transformedPoint = undefined
        __ref.w = v
      }
    },
    meta: {
      enumerable: false, 
      get (){ return __meta },
      set (it){ 
        typeof it === "object" && Object.assign(__meta, it)
        __transformedPoint = undefined
        return __meta
      }
    },
    transform: {
      enumerable  : false,
      configurable: false,
      writable    : true,
      value       : false
    },
    rx: { enumerable: false,
      get       : ()=>{
        const rangeWidth = (this.meta && this.meta.range && this.meta.range.width) || 0
        return this.x / rangeWidth
      }
    },
    ry: { 
      enumerable: false,
      get       : ()=>{
        const rangeHeight = (this.meta && this.meta.range && this.meta.range.height) || 0
        return this.y / rangeHeight
      }
    }
  })
  
  if(typeof meta === "object"){
    this.meta = meta
  }
}

Point.prototype = {
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj)
    return this
  },
  clone (){
    return new Point(this.x, this.y, this.z, this.w, this.meta)
  },
  call (fn){
    if(typeof fn === "function"){
      return fn(this) || this
    }
    return this
  },
  toJSON (withMeta){
    const json = { x: this.x, y: this.y, z: this.z, w: this.w }
    if(withMeta === true && this.meta) json.meta = this.meta
    return json
  },
  pull (width = 0, angle = "horizontal"){
    const { x, y, z, w } = this
    switch (angle){
      case "h": case "horizontal":
        const xHalf = width <= 0 ? 0 : width / 2
        return new Vertex([{x: x - xHalf, y, z, w}, {x: x + xHalf, y, z, w}])
      default:
    }
  },
  vertexWith (destPoint){
    const points = asArray(destPoint)
    points.unshift(this)
    return new Vertex(points)
  },
  rectWith ({x, y}){
    const [largeX, smallX] = this.x > x ? [ this.x, x ] : [ x, this.x ]
    const [largeY, smallY] = this.y > y ? [ this.y, y ] : [ y, this.y ]
    return new Rect(smallX, smallY, largeX - smallX, largeY - smallY, 0, 0)
  },
  applyTransform (){
    const {x, y, z, w} = this
    this.transform = false
    this.x = x
    this.y = y
    this.z = z
    this.w = w
    return this
  },
  setTransform (matrix44 = this.meta.matrix){
    if(!validMatrix(matrix44)){
      this.transform = false
      throw new Error('Point::setTransform invalid matrix', matrix44)
      return this
    }
    
    this.meta.matrix = matrix44
    this.transform = true
    
    return this
  },
  add ({ x, y, z, w }){
    isNumber(x) && x && (this.x += x)
    isNumber(y) && y && (this.y += y)
    isNumber(z) && z && (this.z += z)
    isNumber(w) && w && (this.w += w)
    return this
  },
  subtract ({ x, y, z, w }){
    isNumber(x) && x && (this.x -= x)
    isNumber(y) && y && (this.y -= y)
    isNumber(z) && z && (this.z -= z)
    isNumber(w) && w && (this.w -= w)
    return this
  }
}

const Vertex = function (pointArray, meta){
  let __meta
  
  Object.defineProperties(this, {
    meta: {
      enumerable: false, 
      get (){ return __meta },
      set (it){ __meta = typeof it === "object" ? it : null; return __meta }
    }
  })
  
  this.meta = meta
  
  asArray(pointArray).forEach(point=>{
    if(!likePoint(point)) return
    const {x, y, z, w} = point
    this.push(new Point(x, y, z, w, __meta))
  })
};

(function (classFunction, methods){
  const prototype = []
  
  classFunction.prototype = prototype
  
  Object.keys(methods).forEach(key=>{
    prototype[key] = methods[key]
  })
  
  Object.defineProperties(prototype, {
    start: {
      enumerable: false,
      get (){
        return this[0]
      }
    },
    end: {
      enumerable: false,
      get (){
        return !this.length ? void 0 : this[this.length - 1]
      }
    }
  })
}(Vertex, {
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj)
    return this
  },
  toJSON (withMeta){
    const result = []
    this.forEach(p=>result.push(p.toJSON(withMeta)))
    return result
  },
  clone (){
    return new Vertex(this)
  },
  eq (index){
    return this[index]
  },
  join: function (fn){
    const joins = []
    this.forEach((refp, i)=>{
      joins.push(refp)
      if(!this[i + 1]) return
      const newp = fn(refp, this[i + 1], i)
      if(!likePoint(newp)) return
      const {x, y, z, w, meta} = newp
      joins.push(new Point(x, y, z, w, meta))
    })
    this.splice(0, this.length)
    joins.forEach(p=>this.push(p))
    return this
  },
  point (order){
    switch (order){
      case "e": case "end":
      case "d": case "down": case "r": case "right":
        const { x:px, y:py, z:pz, w:pw } = this.end
        return new Point(
          px,
          py,
          pz,
          pw,
          this.meta
        )
      case "c": case "m": case "center": case "middle":
        const { x:sx, y:sy, z:sz, w:sw } = this.start
        const { x:ex, y:ey, z:ez, w:ew } = this.end
        return new Point(
          sx / 2 + ex / 2,
          sy / 2 + ey / 2,
          sz / 2 + ez / 2,
          sw / 2 + ew / 2,
          this.meta
        )
      case "s": case "start":
      case "u": case "up": case "l": case "left":
      default:
        const { x, y, z, w } = this.start
        return new Point(
          x,
          y,
          z,
          w,
          this.meta
        )
    }
  },
  rect (){
    const first = this[0]
    
    if(!first){
      return new Rect(0, 0, 0, 0)
    }
    
    let left = first.x
    let right = first.x
    let top = first.y
    let bottom = first.y
    
    for(let d = this, i = 1, l = this.length; i < l; i++){
      const p = d[i]
      p.x < left && (left = p.x)
      p.x > right && (right = p.x)
      p.y < top && (top = p.y)
      p.y > bottom && (bottom = p.y)
    }
    
    return new Rect(left, top, right - left, bottom - top)
  },
  setTransform (param){
    this.forEach(p=>p.setTransform(param))
    return this
  }
}))


const Rect = function (left = 0, top = 0, width = 0, height = 0, meta = null){
  const __ref = { left, top, width, height }
  let __meta = {}
  
  Object.defineProperties(this, {
    width: { 
      enumerable: true, 
      get (){ return __ref.width },
      set (newValue){
        const oldValue = __ref.width
        __ref.width = newValue
        return newValue
      }
    },
    height: { 
      enumerable: true, 
      get (){ return __ref.height },
      set (newValue){
        const oldValue = __ref.height
        __ref.height = newValue
        return newValue
      }
    },
    left: { enumerable: true,
      get (){ return __ref.left },
      set (newValue){
        const oldValue = __ref.left
        __ref.left = newValue
        return newValue
      }
    },
    top: { enumerable: true,
      get (){ return __ref.top },
      set (newValue){
        const oldValue = __ref.top
        __ref.top = newValue
        return newValue
      }
    },
    right : { enumerable: true, get (){ return this.left + this.width } },
    bottom: { enumerable: true, get (){ return this.top + this.height } },
    meta  : {
      enumerable: false, 
      get (){ return __meta },
      set (it){ 
        typeof it === "object" && Object.assign(__meta, it)
        return __meta
      }
    }
  })
  
  if(typeof meta === "object"){
    this.meta = meta
  }
}

const splitCountParser = (split)=>{
    //splitCount [ horizental, vertical ]
    //1 = [ 1 ]
    //[1, 2] = [1, 2]
  const [ columnOrder, rowOrder ] = asArray(split)
  return {
    column: isNumber(columnOrder) && columnOrder > 0 ? parseInt(columnOrder, 10) : 1,
    row   : isNumber(rowOrder) && rowOrder > 0 ? parseInt(rowOrder, 10) : 1
  }
}

Rect.prototype = {
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj)
    return this
  },
  clone (){
    return new Rect(this.left, this.top, this.width, this.height, this.meta)
  },
  toJSON (withMeta){
    const json = {width: this.width, height: this.height, left: this.left, top: this.top, right: this.right, bottom: this.bottom }
    if(withMeta === true && this.meta) json.meta = this.meta
    return json
  },
  defaultPerspective (){
    return {
      perspective      : 0,
      perspectiveOrigin: {
        x: this.left + (this.width / 2),
        y: this.top + (this.height / 2),
        z: 0
      }
    }
  },
  findPoint (findWord){
    const [ lineFind, pointFind ] = isArray(findWord) ? findWord : findWord.trim().split(/\s+/)
    return this.vertex(lineFind).point(pointFind)
  },
  vertex (order){
    const inheritMeta = Object.assign(this.defaultPerspective(), this.meta)
    
    switch (order){
      case "right": case "r":
        return new Vertex([{x: this.right, y: this.top, z: 0, w: 0}, {x: this.right, y: this.bottom, z: 0, w: 0}], inheritMeta)
      case "bottom": case "b":
        return new Vertex([{x: this.left, y: this.bottom, z: 0, w: 0}, {x: this.right, y: this.bottom, z: 0, w: 0}], inheritMeta)
      case "left": case "l":
        return new Vertex([{x: this.left, y: this.top, z: 0, w: 0}, {x: this.left, y: this.bottom, z: 0, w: 0}], inheritMeta)
      case "top": case "t":
        return new Vertex([{x: this.left, y: this.top, z: 0, w: 0}, {x: this.right, y: this.top, z: 0, w: 0}], inheritMeta)
      case "middle": case "m":
        const middleY = this.height / 2 + this.top
        return new Vertex(
          [
            {x: this.left, y: middleY, z: 0, w: 0},
            {x: this.right, y: middleY, z: 0, w: 0}
          ],
          inheritMeta
        )
      case "center": case "c":
        const centerX = this.width / 2 + this.x
        return new Vertex(
          [
            {x: centerX, y: this.top, z: 0, w: 0},
            {x: centerX, y: this.bottom, z: 0, w: 0}
          ],
          inheritMeta
        )
      default:
        return new Vertex(
          [
            {x: this.left, y: this.top, z: 0, w: 0},
            {x: this.left, y: this.bottom, z: 0, w: 0},
            {x: this.right, y: this.bottom, z: 0, w: 0},
            {x: this.right, y: this.top, z: 0, w: 0}
          ],
          inheritMeta
        )
    }
  },
  transformRect (){
    this.vertex()
  },
  piecesWithCount (splitCount, eachResultHook){
    const { column, row } = splitCountParser(splitCount)
    const width = this.width
    const height = this.height
    const pieceWidth = width / column
    const pieceHeight = height / row
    eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined
    
    
    const pacExt = { ...this.defaultPerspective() }
    
    if(this.meta.matrix && this.meta.matrix instanceof Array){
      Object.assign(pacExt, {
        matrix: this.meta.matrix
      })
    }
    
    const pacResult = makeMatrixArray(column, row, (index, colIndex, rowIndex)=>{
      const pacMeta = { 
        column: colIndex,
        row   : rowIndex,
        coords: [colIndex, rowIndex], 
        range : { width, height },
        ...pacExt
      }
      
      //
      const result = new Rect(colIndex * pieceWidth, rowIndex * pieceHeight, pieceWidth, pieceHeight, pacMeta)
      return eachResultHook ? eachResultHook(result, index, colIndex, rowIndex) : result
    })
    
    return pacResult
  },
  diff ({ left:aleft = 0, top:atop = 0, width:awidth = 0, height:aheight = 0, right:aright, bottom:abottom }){
    const diffResult = {}
    const original = this.toJSON()
    const offset = {left: 0, top: 0}
    Object.defineProperties(diffResult, {
      left: {
        enumerable: true, 
        get       : ()=>original.left - aleft + offset.left,
        set       : (want)=>{ offset.left = typeof want === "number" ? -original.left + want : 0 }
      },
      top: {
        enumerable: true,
        get       : ()=>original.top - atop + offset.top,
        set       : (want)=>{ offset.top = typeof want === "number" ? -original.top + want : 0 }
      },
      width : { enumerable: true, get: ()=>original.width - awidth},
      height: { enumerable: true, get: ()=>original.height - aheight},
      right : { enumerable: true, get: ()=>original.right - aright + offset.left},
      bottom: { enumerable: true, get: ()=>original.bottom - abottom + offset.top},
      x     : { enumerable: false, get: ()=>offset.left},
      y     : { enumerable: false, get: ()=>offset.top},
      offset: {
        enumerable: false,
        get       : ()=>()=>({
          x     : offset.left,
          y     : offset.top,
          right : diffResult.right,
          bottom: diffResult.bottom,
          over  : diffResult.right > diffResult.bottom ? diffResult.right : diffResult.bottom
        })
      },
      move: {
        enumerable: false,
        get       : ()=>(nleft, ntop)=>{
          diffResult.left = typeof nleft === "number" ? nleft : aleft
          diffResult.top = typeof ntop === "number" ? ntop : atop
          return diffResult
        }
      },
      toJSON: {
        enumerable: false,
        get       : ()=>()=>({ ...diffResult })
      }
    })
    
    return diffResult
  },
  fit (rect){
    if(typeof rect !== "object"){ throw new Error("fit::argument[0] is not object") }
    const { width, height } = rect
    
    if(!isNumber(width) || !isNumber(height)){ throw new Error("fit::argument[0] is not { width:Number, height:Number }") }
    const WHRatio = [ width / this.width, height / this.height ]
    const transformRatio = WHRatio.sort()[0]
    
    this.width = (this.width * transformRatio) || 0
    this.height = (this.height * transformRatio) || 0
    
    return this
  },
  //TODO : incompleted sticky(parent, position, offset);
  sticky ({left:refX, top:refY, width:refWidth, height:refHeight}, position = "bottom left"){
    const { left, top, width, height } = this
    switch (position){
      case "bl": case "obl": case "bottom left": case "outer bottom left":
        return rect({
          left: refX,
          top : refY + refHeight,
          width,
          height
        })
      case "c": case "m": case "mc": case "center": case "middle": case "middle center":
        return rect({
          left: refX + refWidth / 2 - width / 2,
          top : refY + refHeight / 2 - height / 2,
          width,
          height
        })
      default:
        return rect({ left, top, width, height })
    }
  },
  add ({ left, top, width, height }){
    isNumber(left) && left && (this.left += left)
    isNumber(top) && top && (this.top += top)
    isNumber(width) && width && (this.width += width)
    isNumber(height) && height && (this.height += height)
    return this
  },
  subtract ({ left, top, width, height }){
    isNumber(left) && left && (this.left -= left)
    isNumber(top) && top && (this.top -= top)
    isNumber(width) && width && (this.width -= width)
    isNumber(height) && height && (this.height -= height)
    return this
  }
}

export const point = function (x, y, z, w){
  return typeof x === "object" 
    ? new Point(x.x, x.y, x.z, x.w) 
    : new Point(x, y, z, w)
}

export const vertex = function (start, end){
  return new Vertex([{x: start.x, y: start.y, z: start.z, w: start.w}, {x: end.x, y: end.y, z: end.z, w: end.w}])
}

export const rect = function (left, top, width, height, x, y, valid){
  return typeof left === "object"
    ? new Rect(left.left, left.top, left.width, left.height, left.x, left.y, left.valid)
    : new Rect(left, top, width, height, x, y, valid)
}
