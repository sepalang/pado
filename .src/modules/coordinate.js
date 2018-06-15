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
  toObject (){
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
  points:function(pointCount=2){
    const { start:{x:sx,y:sy,z:sz,w:sw}, end:{x:ex,y:ey,z:ez,w:ew} } = this;
    const divCount = pointCount-1;
    const [dx, dy, dz, dw]=[
      ex-sx/divCount,
      ey-sy/divCount,
      ez-sz/divCount,
      ew-sw/divCount
    ];
    
    return Array(2).fill().map((v,i)=>new Point(sx+(dx*i),sy+(dy*i),sz+(dz*i),sw+(dw*i)));
  },
  point:function(order){
    switch(order){
    case "e": case "end":
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
    default:
      const { x,y,z,w } = this.start;
      return new Point(x,y,z,w);
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
  point (){
    return new Point(this.x,this.y);
  },
  line (order){
    switch(order){
    case "top": case "t":
      return new Line(this.left,this.top,0,0,this.right,this.top,0,0);
    case "right": case "r":
      return new Line(this.right,this.top,0,0,this.right,this.bottom,0,0);
    case "bottom": case "b":
      return new Line(this.left,this.bottom,0,0,this.right,this.bottom,0,0);
    case "left": case "l":
      return new Line(this.left,this.top,0,0,this.left,this.bottom,0,0);
    }
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
