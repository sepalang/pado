import { isArray } from '../functions/isLike';
import { asArray } from '../functions/cast';

const likePoint = function(p){
  return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
}

const Point = function(x=0,y=0,z=0,w=0){
  const __ref = { x,y,z,w };
  Object.defineProperties(this,{
    x:{ enumerable:true, get(){ return __ref.x; }, set(v){ return __ref.x = v; }},
    y:{ enumerable:true, get(){ return __ref.y; }, set(v){ return __ref.y = v; }},
    z:{ enumerable:true, get(){ return __ref.z; }, set(v){ return __ref.z = v; }},
    w:{ enumerable:true, get(){ return __ref.w; }, set(v){ return __ref.w = v; }},
  });
};

Point.prototype = {
  clone (){
    return new Point(this.x,this.y,this.z,this.w);
  },
  toJSON (){
    return {
      x:this.x,
      y:this.y,
      z:this.z,
      w:this.w
    }
  },
  pull (width=0, angle="horizontal"){
    const { x, y, z, w } = this;
    switch(angle){
      case "h": case "horizontal":
        const xHalf = width <= 0 ? 0 : width/2;
        return new Vertex([{x:x-xHalf, y, z, w}, {x:x+xHalf, y, z, w}]);
      default:
    }
  },
  vertexWith (destPoint){
    const points = asArray(destPoint);
    points.unshift(this);
    
    const pointArray = new Vertex(points.map(({x,y,z,w})=>new Point(x,y,z,w)))
    return pointArray;
  },
  rectWith ({x, y}){
    const [largeX, smallX] = this.x > x ? [ this.x, x ] : [ x, this.x ];
    const [largeY, smallY] = this.y > y ? [ this.y, y ] : [ y, this.y ];
    return new Rect(smallX,smallY,largeX-smallX,largeY-smallY,0,0);
  },
  translate ({x=0, y=0, z=0}){
    this.x = this.x + x;
    this.y = this.y + y;
    this.z = this.z + z;
    return this;
  },
  rotate ({x:angleX=0, y:angleY=0, z:angleZ=0}){
    let x1 = this.x,
        y1 = this.y,
        z1 = this.z,

        cr = Math.cos(angleX),
        cp = Math.cos(angleY),
        cy = Math.cos(angleZ),
        sr = Math.sin(angleX),
        sp = Math.sin(angleY),
        sy = Math.sin(angleZ),

        w = cr * cp * cy + -sr * sp * -sy,
        x = sr * cp * cy - -cr * sp * -sy,
        y = cr * sp * cy + sr * cp * sy,
        z = cr * cp * sy - -sr * sp * -cy,

        m0 = 1 - 2 * ( y * y + z * z ),
        m1 = 2 * (x * y + z * w),
        m2 = 2 * (x * z - y * w),

        m4 = 2 * ( x * y - z * w ),
        m5 = 1 - 2 * ( x * x + z * z ),
        m6 = 2 * (z * y + x * w ),

        m8 = 2 * ( x * z + y * w ),
        m9 = 2 * ( y * z - x * w ),
        m10 = 1 - 2 * ( x * x + y * y );
        
    this.x = x1 * m0 + y1 * m4 + z1 * m8;
    this.y = x1 * m1 + y1 * m5 + z1 * m9;
    this.z = x1 * m2 + y1 * m6 + z1 * m10;
    return this;
  },
  transform (transform){
    const { rotate, translate } = transform;
    this.rotate(rotate);
    this.translate(translate);
    return this;
  }
};

const Vertex = function(pointArray){
  asArray(pointArray).forEach(point=>{
    if(!likePoint(point)) return;
    const {x,y,z,w} = point;
    this.push(new Point(x,y,z,w));
  });
};

(function(classFunction, methods){
  const prototype = [];
  
  classFunction.prototype = prototype;
  Object.keys(methods).forEach(key=>{
    prototype[key] = methods[key]
  });
  
  Object.defineProperties(prototype,{
    start:{
      enumerable:false,
      get (){
        return this[0];
      }
    },
    end:{
      enumerable:false,
      get (){
        return !this.length ? void 0 : this[this.length-1];
      }
    }
  });
}(Vertex, {
  toJSON (){
    const result = [];
    this.forEach(p=>result.push(p.toJSON()));
    return result;
  },
  clone (){
    return new Vertex(this);
  },
  eq (index){
    return this[index];
  },
  join:function(fn){
    const joins = [];
    this.forEach((refp,i)=>{
      joins.push(refp);
      if(!this[i+1]) return;
      const newp = fn(refp, this[i+1], i);
      if(!likePoint(newp)) return;
      const {x,y,z,w} = newp;
      joins.push(new Point(x,y,z,w));
    });
    this.splice(0,this.length);
    joins.forEach(p=>this.push(p));
    return this;
  },
  point (order){
    switch(order){
    case "e": case "end":
    case "d": case "down": case "r": case "right":
      const { x:px,y:py,z:pz,w:pw } = this.end;
      return new Point(px,py,pz,pw);
    case "c": case "m": case "center": case "middle":
      const { x:sx, y:sy, z:sz, w:sw } = this.start;
      const { x:ex, y:ey, z:ez, w:ew } = this.end;
      return new Point(
        sx/2 + ex/2,
        sy/2 + ey/2,
        sz/2 + ez/2,
        sw/2 + ew/2
      );
    case "s": case "start":
    case "u": case "up": case "l": case "left":
    default:
      const { x,y,z,w } = this.start;
      return new Point(x,y,z,w);
    }
  },
  transform (transform,rect){
    const useRect = !!rect;
    
    if(useRect){
      const { left, top, width, height } = rect;;
      
      //rotateOrigin
      const originX = left + width/2;
      const originY = top + height/2;
      
      this.forEach(point=>{
        const { left, top } = rect;
        point.translate({ x:-originX, y:-originY });
        point.transform(transform);
        point.translate({ x:originX, y:originY });
      });
    } else {
      this.forEach(point=>{
        point.transform(transform)
      });
    }
    return this;
  }
}));



const Rect = function(left=0,top=0,width=0,height=0,x,y,valid=true){
  const __ref = { left,top,width,height,x,y,valid }
  
  Object.defineProperties(this,{
    x:{ enumerable:true, get(){ return typeof __ref.x === "number" ? __ref.x : __ref.left; } },
    y:{ enumerable:true, get(){ return typeof __ref.y === "number" ? __ref.y : __ref.top; } },
    width:{ 
        enumerable:true, 
        get(){ return __ref.width; },
        set(newValue){
            const oldValue = __ref.width;
            const offsetValue = newValue - oldValue;
            __ref.width = newValue;
            __ref.right += offsetValue;
            return newValue;
        }
    },
    height:{ 
        enumerable:true, 
        get(){ return __ref.height; },
        set(newValue){
            const oldValue = __ref.height;
            const offsetValue = newValue - oldValue;
            __ref.height = newValue;
            __ref.bottom    += offsetValue;
            return newValue;
        }
    },
    left:{ enumerable:true, get(){ return __ref.left; } },
    top:{ enumerable:true, get(){ return __ref.top; } },
    right:{ enumerable:true, get(){ return this.left + this.width; } },
    bottom:{ enumerable:true, get(){ return this.top + this.height; } },
    valid:{ get(){ return typeof __ref.valid === "boolean" ? __ref.valid : (
      typeof __ref.left === "number" &&
      typeof __ref.top === "number" &&
      __ref.width >= 0 &&
      __ref.height >= 0
    ) } }
  });
};

Rect.prototype = {
  findPoint (findWord){
    const [ lineFind, pointFind ] = isArray(findWord) ? findWord : findWord.trim().split(/\s+/);
    return this.vertex(lineFind).point(pointFind);
  },
  vertex (order){
    switch(order){
    case "right": case "r":
      return new Vertex([{x:this.right, y:this.top, z:0, w:0},{x:this.right,y:this.bottom,z:0,w:0}]);
    case "bottom": case "b":
      return new Vertex([{x:this.left, y:this.bottom, z:0, w:0},{x:this.right,y:this.bottom,z:0,w:0}]);
    case "left": case "l":
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.left,y:this.bottom,z:0,w:0}]);
    case "top": case "t":
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.right,y:this.top,z:0,w:0}]);
    default:
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.left,y:this.bottom,z:0,w:0},{x:this.right,y:this.bottom,z:0,w:0},{x:this.right, y:this.top, z:0, w:0}]);
    }
  },
  //TODO : incompleted sticky(parent, position, offset);
  sticky ({left:refX, top:refY, width:refWidth, height:refHeight}, position="bottom left"){
    const { left, top, width, height } = this;
    switch(position){
    case "bl": case "obl": case "bottom left": case "outer bottom left":
      return rect({
        left:refX,
        top:refY+refHeight,
        width,
        height
      });
    case "c": case "m": case "mc": case "center": case "middle": case "middle center":
      return rect({
        left:refX + refWidth/2 - width/2,
        top:refY + refHeight/2 - height/2,
        width,
        height
      });
    default:
      return rect({ left, top, width, height });
    }
  },
  toJSON (){
    return { x:this.x, y:this.y, width:this.width, height:this.height, left:this.left, top:this.top, right:this.right, bottom:this.bottom, valid:this.valid };
  }
};

export const point = function(x,y,z,w){
  return typeof x === "object" ? 
  new Point(x.x,x.y,x.z,x.w) : 
  new Point(x,y,z,w);
};

export const vertex = function(start,end){
  new Vertex([{x:start.x,y:start.y,z:start.z,w:start.w},{x:end.x,y:end.y,z:end.z,w:end.w}]);
};

export const rect = function(left,top,width,height,x,y,valid){
  return typeof left === "object" ?
  new Rect(left.left,left.top,left.width,left.height,left.x,left.y,left.valid) :
  new Rect(left,top,width,height,x,y,valid);
};
