import { isArray } from '../../functions/isLike';
import { asArray } from '../../functions/cast';

const likePoint = function(p){
  return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
}

const PointArray = function(points){
  asArray(points).forEach(point=>{
    if(!likePoint(point)) return;
    const {x,y,z,w} = point;
    this.push(new Point(x,y,z,w));
  });
};

(function(methods){
  const prototype = [];
  PointArray.prototype = prototype;
  Object.keys(methods).forEach(key=>{
    prototype[key] = methods[key]
  });
}({
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
  toJSON (){
    const result = [];
    this.points.forEach(p=>result.push(p.toJSON()));
    return result;
  }
}));


const Point = function(x=0,y=0,z=0,w=0){
  const __ref = { x,y,z,w };
  Object.defineProperties(this,{
    x:{ enumerable:true, get(){ return __ref.x; } },
    y:{ enumerable:true, get(){ return __ref.y; } },
    z:{ enumerable:true, get(){ return __ref.z; } },
    w:{ enumerable:true, get(){ return __ref.w; } },
  });
};

Point.prototype = {
  pull (width=0, angle="horizontal"){
    const { x, y, z, w } = this;
    switch(angle){
      case "h": case "horizontal":
        const xHalf = width <= 0 ? 0 : width/2;
        return new Line(x-xHalf, y, z, w, x+xHalf, y, z, w);
      default:
    }
  },
  arrayWith (destPoint){
    const points = asArray(destPoint)
    points.unshift(this);
    
    const pointArray = new PointArray(points.map(({x,y,z,w})=>new Point(x,y,z,w)))
    return pointArray;
  },
  rectWith ({x, y}){
    const [largeX, smallX] = this.x > x ? [ this.x, x ] : [ x, this.x ];
    const [largeY, smallY] = this.y > y ? [ this.y, y ] : [ y, this.y ];
    return new Rect(smallX,smallY,largeX-smallX,largeY-smallY,0,0);
  },
  toJSON (){
    return {
      x:this.x,
      y:this.y,
      z:this.z,
      w:this.w
    }
  }
};

const Line = function(sx,sy,sz,sw,ex,ey,ez,ew){
  const __ref = { sx,sy,sz,sw,ex,ey,ez,ew };
  
  Object.defineProperties(this,{
    start:{
      enumerable:true,
      get (){
        return {
          x:__ref.sx,
          y:__ref.sy,
          w:__ref.sw,
          z:__ref.sz
        }
      }
    },
    end:{
      enumerable:true,
      get (){
        return {
          x:__ref.ex,
          y:__ref.ey,
          w:__ref.ew,
          z:__ref.ez
        }
      }
    }
  });
};

Line.prototype =  {
  points (pointCount=2){
    const { start:{x:sx,y:sy,z:sz,w:sw}, end:{x:ex,y:ey,z:ez,w:ew} } = this;
    const divCount = pointCount-1;
    const [dx, dy, dz, dw]=[
      ex-sx/divCount,
      ey-sy/divCount,
      ez-sz/divCount,
      ew-sw/divCount
    ];
    
    return new PointArray( Array(2).fill().map((v,i)=>new Point(sx+(dx*i),sy+(dy*i),sz+(dz*i),sw+(dw*i))) );
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
  toJSON (){
    return {
      start:{ ...this.start },
      end:{ ...this.end }
    }
  }
};




const Rect = function(left=0,top=0,width=0,height=0,x,y,valid=true){
  const __ref = { left,top,width,height,x,y,valid }
  
  Object.defineProperties(this,{
    x:{ enumerable:true, get(){ return typeof __ref.x === "number" ? __ref.x : __ref.left; } },
    y:{ enumerable:true, get(){ return typeof __ref.y === "number" ? __ref.y : __ref.top; } },
    width:{ enumerable:true, get(){ return __ref.width; } },
    height:{ enumerable:true, get(){ return __ref.height; } },
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
  line (order){
    switch(order){
    case "right": case "r":
      return new Line(this.right,this.top,0,0,this.right,this.bottom,0,0);
    case "bottom": case "b":
      return new Line(this.left,this.bottom,0,0,this.right,this.bottom,0,0);
    case "left": case "l":
      return new Line(this.left,this.top,0,0,this.left,this.bottom,0,0);
    case "top": case "t":
    default:
      return new Line(this.left,this.top,0,0,this.right,this.top,0,0);
    }
  },
  findPoint (findWord){
    const [ lineFind, pointFind ] = isArray(findWord) ? findWord : findWord.trim().split(/\s+/);
    console.log("lineFind, pointFind",lineFind, pointFind,this.line(lineFind).toJSON(),this.line(lineFind).point(pointFind).toJSON())
    return this.line(lineFind).point(pointFind);
  },
  toJSON (){
    return {
      x:this.x,
      y:this.y,
      width:this.width,
      height:this.height,
      left:this.left,
      top:this.top,
      right:this.right,
      bottom:this.bottom,
      valid:this.valid
    }
  }
};

export const pointArray = function(array){
  return new PonintArray(array);
};

export const point = function(x,y,z,w){
  return typeof x === "object" ? 
  new Ponint(x.x,x.y,x.z,x.w) : 
  new Ponint(x,y,z,w);
};

export const line = function(start,end){
  new Line(start.x,start.y,start.z,start.w,end.x,end.y,end.z,end.w);
};

export const rect = function(left,top,width,height,x,y,valid){
  return typeof left === "object" ?
  new Rect(left.left,left.top,left.width,left.height,left.x,left.y,left.valid) :
  new Rect(left,top,width,height,x,y,valid);
};
