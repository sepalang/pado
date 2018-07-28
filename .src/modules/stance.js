import { isArray, isNumber } from '../functions/isLike'
import { asArray } from '../functions/cast'
import { asMatrix, validMatrix, multiplyMatrix } from '../functions/matrix'
import { makeMatrixArray } from './matrix'


const likePoint = function (p){
  return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y")
}


const Point = function (x = 0, y = 0, z = 0, w = 1, meta){
  // base point config
  const __ref = { x, y, z, w }
  let __meta
  
  // compute matrix
  const __matrix   = []
  const __computed = {
    matrixVersion  : 0,
    computedVersion: 0,
    memoizeRef     : null,
    memoizeOutput  : null
  }
  
  const compute = (key)=>{
    const { matrixVersion, computedVersion } = __computed
    //why un used?
    //const { memoizeRef } = __computed;
    
    let needCompute = !__computed.memoizeRef || matrixVersion !== computedVersion || !(
      __computed.memoizeRef.x === __ref.x &&
      __computed.memoizeRef.y === __ref.y &&
      __computed.memoizeRef.z === __ref.z &&
      __computed.memoizeRef.w === __ref.w 
    )
    
    if(needCompute){
      const newMemoizeRef = {
        x: __ref.x,
        y: __ref.y,
        z: __ref.z,
        w: __ref.w
      }
      const newComputedMatrix = __matrix.reduce(
        (dest, matrix)=>multiplyMatrix(matrix, dest),
        asMatrix([newMemoizeRef.x, newMemoizeRef.y, newMemoizeRef.z, newMemoizeRef.w], 1)
      )
      //
      __computed.memoizeOutput = {
        x: newComputedMatrix[0][0],
        y: newComputedMatrix[0][1],
        z: newComputedMatrix[0][2],
        w: newComputedMatrix[0][3]
      }
      __computed.memoizeRef = newMemoizeRef
      __computed.computedVersion = matrixVersion
    } 
    //else {
    //  console.log(`compute cache ${key}`);
    //}
    return key && __computed.memoizeOutput[key] || __computed.memoizeOutput
  }
  
  Object.defineProperties(this, {
    x   : { enumerable: true, get: ()=>(__matrix.length && compute('x') || __ref.x), set: v=>__ref.x = v},
    y   : { enumerable: true, get: ()=>(__matrix.length && compute('y') || __ref.y), set: v=>__ref.y = v},
    z   : { enumerable: true, get: ()=>(__matrix.length && compute('z') || __ref.z), set: v=>__ref.z = v},
    w   : { enumerable: true, get: ()=>(__matrix.length && compute('w') || __ref.w), set: v=>__ref.w = v},
    meta: {
      enumerable: false, 
      get (){ return __meta },
      set (it){ __meta = typeof it === "object" ? it : null; return __meta }
    },
    rx: { enumerable: false,
      get       : ()=>{
        console.log("rx", this.meta && this.meta.range && this.meta.range.width, this.x)
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
    },
    addMatrix: {
      enumerable: false,
      value     : function (matrix){
        if(!validMatrix(matrix)) throw new Error("invalid addMatrix param")
        __matrix.push(matrix)
        __computed.matrixVersion += 1
        return this
      }
    }
  })
  this.meta = meta
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
    console.log(" point this.meta", this.meta)
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
  transform (transform, rect){
    const useRect = !!rect
    
    if(useRect){
      const { left, top, width, height } = rect
      
      //rotateOrigin
      const originX = left + width / 2
      const originY = top + height / 2
      
      this.forEach(point=>{
        point.translate({ x: -originX, y: -originY })
        point.transform(transform)
        point.translate({ x: originX, y: originY })
      })
    } else {
      this.forEach(point=>{
        point.transform(transform)
      })
    }
    return this
  }
}))


const Rect = function (left = 0, top = 0, width = 0, height = 0, meta = null){
  const __ref = { left, top, width, height }
  let __meta
  Object.defineProperties(this, {
    width: { 
      enumerable: true, 
      get (){ return __ref.width },
      set (newValue){
        const oldValue = __ref.width
        const offsetValue = newValue - oldValue
        __ref.width = newValue
        __ref.right += offsetValue
        return newValue
      }
    },
    height: { 
      enumerable: true, 
      get (){ return __ref.height },
      set (newValue){
        const oldValue = __ref.height
        const offsetValue = newValue - oldValue
        __ref.height = newValue
        __ref.bottom += offsetValue
        return newValue
      }
    },
    left  : { enumerable: true, get (){ return __ref.left } },
    top   : { enumerable: true, get (){ return __ref.top } },
    right : { enumerable: true, get (){ return this.left + this.width } },
    bottom: { enumerable: true, get (){ return this.top + this.height } },
    meta  : {
      enumerable: false, 
      get (){ return __meta },
      set (it){ 
        __meta = typeof it === "object" ? it : null 
        return __meta
      }
    }
  })
  
  this.meta = meta
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
  toJSON (withMeta){
    const json = {width: this.width, height: this.height, left: this.left, top: this.top, right: this.right, bottom: this.bottom }
    if(withMeta === true && this.meta) json.meta = this.meta
    return json
  },
  findPoint (findWord){
    const [ lineFind, pointFind ] = isArray(findWord) ? findWord : findWord.trim().split(/\s+/)
    return this.vertex(lineFind).point(pointFind)
  },
  vertex (order){
    const inheritMeta = Object.assign({
      perspective      : 0,
      perspectiveOrigin: {
        x: this.left + (this.width / 2),
        y: this.top + (this.top / 2),
        z: 0
      }
    }, this.meta)
    
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
  piecesWithCount (splitCount, eachResultHook){
    const { column, row } = splitCountParser(splitCount)
    const width = this.width
    const height = this.height
    const pieceWidth = width / column
    const pieceHeight = height / row
    eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined
    
    const pacResult = makeMatrixArray(column, row, (index, colIndex, rowIndex)=>{
      const pacMeta = { 
        column: colIndex,
        row   : rowIndex,
        coords: [colIndex, rowIndex], 
        range : { width, height }
      }
      const result = new Rect(colIndex * pieceWidth, rowIndex * pieceHeight, pieceWidth, pieceHeight, pacMeta)
      return eachResultHook ? eachResultHook(result, index, colIndex, rowIndex) : result
    })
    
    return pacResult
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
