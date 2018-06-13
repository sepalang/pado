const Point = function(x=0,y=0,z=0,w=0){
  this._ref = { x,y,z,w };
};

Point.prototype = {
  toRect (width=0, height=0){
    return new Rect(this.x,this.y,width,height);
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

Object.defineProperties(Point.prototype,{
  x:{ get(){ return this._ref.x; } },
  y:{ get(){ return this._ref.y; } },
  z:{ get(){ return this._ref.z; } },
  w:{ get(){ return this._ref.w; } },
});

const Line = function(sx,sy,sz,sw,ex,ey,ez,ew){
  this._ref = { sx,sy,sz,sw,ex,ey,ez,ew };
};

Line.prototype =  {
  point:function(order){
    switch(order){
    case "e": case "end":
      const { x:px,y:py,z:pz,w:pw } = this.end;
      return new Point(px,py,pz,pw);
    case "c": case "m":
    case "center": case "middle":
      const { x:sx, y:sy, z:sz, w:sw } = this.start;
      const { x:ex, y:ey, z:ez, w:ew } = this.end;
      return new Point(
        sx + ex/2,
        sy + ey/2,
        sz + ez/2,
        sw + ew/2
      );
    case "s": case "start":
    default:
      const { x,y,z,w } = this.start;
      return new Point(x,y,z,w);
    }
  }
};

Object.defineProperties(Point.prototype,{
  start:{
    get (){
      return {
        x:this._ref.sx,
        y:this._ref.sy,
        w:this._ref.sw,
        z:this._ref.sz
      }
    }
  },
  end:{
    get (){
      return {
        x:this._ref.ex,
        y:this._ref.ey,
        w:this._ref.ew,
        z:this._ref.ez
      }
    }
  }
});


const Rect = function(x=0,y=0,width=0,height=0){
  this.__ref = { x,y,width,height }
};

Rect.prototype = {
  point (){
    return new Point(this.x,this.y);
  },
  line (order){
    switch(order){
    case "top":
      return new Line(this.left,this.top,0,0,this.left,this.right,0,0);
    case "right":
      return new Line(this.right,this.top,0,0,this.right,this.bottom,0,0);
    case "bottom":
      return new Line(this.right,this.bottom,0,0,this.left,this.bottom,0,0);
    case "left":
      return new Line(this.left,this.top,0,0,this.left,this.bottom,0,0);
    }
  },
  object (){
    return {
      x:this.x,
      y:this.y,
      width:this.width,
      height:this.height,
      left:this.left,
      top:this.top,
      right:this.right,
      bottom:this.bottom
    }
  }
};

Object.defineProperties(Rect.prototype,{
  x:{ get(){ return this._ref.x; } },
  y:{ get(){ return this._ref.y; } },
  width:{ get(){ return this._ref.width; } },
  height:{ get(){ return this._ref.height; } },
  left:{ get(){ return this._ref.x; } },
  top:{ get(){ return this._ref.y; } },
  right:{ get(){ return this.x + this.width; } },
  bottom:{ get(){ return this.y + this.height; } },
});

export const point = function(x,y,z,w){
  return typeof x === "object" ? 
  new Ponint(x.x,x.y,x.z,x.w) : 
  new Ponint(x,y,z,w);
};

export const line = function(start,end){
  new Line(start.x,start.y,start.z,start.w,end.x,end.y,end.z,end.w);
};

export const rect = function(x,y,width,height){
  return typeof x === "object" ?
  new Rect(x.x,x.y,x.width,x.height) :
  new Rect(x,y,width,height);
};
