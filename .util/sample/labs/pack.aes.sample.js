const { windowServiceReserveSession, getOpenerPresenceProperties } = (function(){
  //to children
  const reservedSessionStorage = {};
  
  //my window
  let pulledWindowToken;
  let pulledWindowSession;
  let openerPresenceProps;
  
  //(부모) 윈도우의 정보를 저장
  const windowServiceReserveSession = function(name,data,listenHandshake){
    if(listenHandshake === true){
      window.windowServiceHandshake = function(){
        delete window.windowServiceHandshake;
        return name;
      };
    }
    reservedSessionStorage[name] = data;
    console.log('reservedSessionStorage',reservedSessionStorage);
    return reservedSessionStorage[name];
  };

  //자식에게 세션을 당겨올수 있도록 지원
  const windowServicePullSession = function(name){
    //console.log("windowServicePullSession",name);
    var data = reservedSessionStorage[name];
    delete reservedSessionStorage[name];
    return data;
  };
  
  //
  const getOpenerPresenceProperties = function(){
    if(typeof openerPresenceProps === "function"){
      return openerPresenceProps()
    }
    return openerPresenceProps;
  };
  
  window.windowServiceReserveSession = windowServiceReserveSession;
  window.windowServicePullSession    = windowServicePullSession;

  try {
    if(window.opener && window.opener.windowServiceHandshake){
      pulledWindowToken = window.opener.windowServiceHandshake();
    }
  } catch(e){
    console.warn("window.opener.windowServiceHandshake error");
  }
    
  if(pulledWindowToken && window.opener && window.opener.windowServicePullSession){
    pulledWindowSession  = window.opener.windowServicePullSession(pulledWindowToken);
    openerPresenceProps = pulledWindowSession;
    
    //임의로 언로드 됐을때 세션을 임시 저장
    var saveSessionFn = function(){
      try {
        window.opener &&
        window.opener.windowServiceReserveSession &&
        window.opener.windowServiceReserveSession(pulledWindowSession.token,pulledWindowSession,true);
      } catch(e) {
        console.warn("Parent window not found.",e);
      }
    };
    
    window.addEventListener("beforeunload",saveSessionFn);
  }
  
  return { windowServiceReserveSession, getOpenerPresenceProperties };
}());

const windowProps = getOpenerPresenceProperties;

const WINDOW_POPUP_DEFAULT_WIDTH = 1100;
const WINDOW_POPUP_DEFAULT_HEIGHT = 900;

const openWindow = function(href, windowParam) {
  const hasParam   = typeof windowParam === "object";
  const windowName = hasParam && windowParam["name"] || "_blank";
  const useResize  = (hasParam && windowParam["resize"]+"") !== "false";

  let destWindowWidth  = (hasParam && windowParam["width"] || WINDOW_POPUP_DEFAULT_WIDTH);
  let destWindowHeight = (hasParam && windowParam["height"] || WINDOW_POPUP_DEFAULT_HEIGHT);
  let destWindowTop    = (hasParam && windowParam["top"] || windowParam["y"] || 0);
  let destWindowLeft   = (hasParam && windowParam["left"] || windowParam["x"] || 0);

  const availMaxWidth = screen.availWidth;
  let availMaxHeight = screen.availHeight;

  // IE bottom bar
  if(navigator.platform.indexOf("Win") === 0) {
    availMaxHeight -= 65;
  }

  if(destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
  if(destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;
  
  windowServiceReserveSession(windowName,windowProps,true);
  
  const newWindow = window.open(
    href,
    windowName,
    `top=${destWindowTop},left=${destWindowLeft},width=${destWindowWidth},height=${destWindowHeight}${useResize ? ",resizable=1" : ",resizable=0"},scrollbars=yes,status=1`
  );

  return newWindow;
};

const closeWindow = function(){
  window.close();
};

const isAbsoluteNaN = function(it){
  return it!==it && typeof it === "number"
};

const isNone = function(data) {
  return isAbsoluteNaN(data) || data === undefined || data === null
};

const isNumber = function(it){
  return (typeof it === "number" && !isAbsoluteNaN(it))
};

const isArray = function(data) {
  return Array.isArray(data) || data instanceof Array;
};

const isObject   = it=>(it !== null && typeof it === "object") ? true : false;

const likeArray = (function(nodeFn,webFn){
  let definedNodeList;
  
  try {
    definedNodeList = (0 instanceof NodeList);
    definedNodeList = true;
  } catch(e) {
    definedNodeList = false;
  }
  
  return definedNodeList ? webFn : nodeFn;
}(
  //nodeFn
  function(data){
    return (typeof data === "object" && data.hasOwnProperty("length")) ? 
    true :
    isArray(data);
  },
  //webFn
  function(data){
    return (typeof data === "object" && data.hasOwnProperty("length")) ?
    true :
    isArray(data) || data instanceof NodeList;
  }
));

//TODO : native isPlainObject
const isNode = (a)=>isObject(a) && typeof a.nodeType === "number";

const likePromise = (target)=>(typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function");

const asArray = function(data, defaultArray = undefined) {
  if(isArray(data)) {
    return data;
  }
  if(isNone(data)) {
    return isArray(defaultArray) ? defaultArray
      : isNone(defaultArray) ? [] : [defaultArray];
  }
  if(typeof data === "object" && typeof data.toArray === "function") {
    return data.toArray();
  }
  return [data];
};

const times = function(length,fn){
  const result = [];
  for(var i=0,l=length;i<l;i++){
    result.push(fn(i));
  }
  return result;
};

const turn = function(i, p, ts) {
  if(i < 0) { var abs = Math.abs(i / ts); i = p - (abs > p ? abs % p : abs); }
  ts = ts || 1; i = Math.floor(i / ts);
  return (p > i) ? i : i % p;
};

//validate matrix format
const validMatrix = function(arr){
  // Matrix must be array
  if(!likeArray(arr)){
    return false;
  }
  
  // Empty is valid
  if(arr.length === 0){
    return true;
  }
  
  //find some error ( return true => false)
  return Array.from(arr).some((v)=>{
    if(likeArray(v)){
      //length check
      if(v.length !== arr.length) return true;
      //type check
      return v.some(likeError=>!(likeError == undefined || isNumber(likeError)));
    }
    return true;
  }) ? false : true;
};

// real matrix model
const asMatrix = function(arr,columnSize){
  const result = [];
  if(typeof columnSize === "number" && columnSize > 0){
    const rowCount = Math.ceil(arr.length / columnSize);
    times(rowCount,i=>{
      const column = [];
      times(columnSize,ci=>{ column.push(arr[i*columnSize+ci]); });
      result.push(column);
    });
  } else {
    return [arr];
  }
  return result;
};

const multiplyMatrix = function(aMatrix,bMatrix){
  if(!validMatrix(aMatrix) && validMatrix(bMatrix)){
    return null;
  }
  if(aMatrix[0].length !== bMatrix.length){
    return null;
  }
  const result = [];
  times(bMatrix.length, rRowIndex=>{
    const columnLength = bMatrix[rRowIndex].length;
    const columnResult = [];
    times(columnLength, rColumnIndex=>{
      //var calcLog = [];
      const multiplied = aMatrix[rRowIndex].reduce((dist,num,index)=>{
        //calcLog.push(`${num} * ${bMatrix[index][rColumnIndex]}`)
        return num * bMatrix[index][rColumnIndex] + dist;
      },0);
      //console.log("calcLog",calcLog.join(" + "))
      columnResult.push(multiplied);
    });
    result.push(columnResult);
  });
  return result;
};

const likePoint = function(p){
  return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
};


const Point = function(x=0,y=0,z=0,w=1,meta){
  // base point config
  const __ref = { x,y,z,w };
  let __meta;
  
  // compute matrix
  const __matrix   = [];
  const __computed = {
    matrixVersion:0,
    computedVersion:0,
    memoizeRef:null,
    memoizeOutput:null
  };
  
  const compute = (key)=>{
    const { matrixVersion, computedVersion } = __computed;
    //why un used?
    //const { memoizeRef } = __computed;
    
    let needCompute = !__computed.memoizeRef || matrixVersion !== computedVersion || !(
      __computed.memoizeRef.x === __ref.x &&
      __computed.memoizeRef.y === __ref.y &&
      __computed.memoizeRef.z === __ref.z &&
      __computed.memoizeRef.w === __ref.w 
    );
    
    if(needCompute){
      const newMemoizeRef = {
        x:__ref.x,
        y:__ref.y,
        z:__ref.z,
        w:__ref.w
      };
      const newComputedMatrix = __matrix.reduce(
        (dest, matrix)=>multiplyMatrix(matrix,dest),
        asMatrix([newMemoizeRef.x,newMemoizeRef.y,newMemoizeRef.z,newMemoizeRef.w],1)
      );
      //
      __computed.memoizeOutput   = {
        x:newComputedMatrix[0][0],
        y:newComputedMatrix[0][1],
        z:newComputedMatrix[0][2],
        w:newComputedMatrix[0][3]
      };
      __computed.memoizeRef      = newMemoizeRef;
      __computed.computedVersion = matrixVersion;
    } 
    //else {
    //  console.log(`compute cache ${key}`);
    //}
    return key && __computed.memoizeOutput[key] || __computed.memoizeOutput;
  };
  
  Object.defineProperties(this,{
    x:{ enumerable:true, get:()=>(__matrix.length &&  compute('x') || __ref.x), set:v=>__ref.x = v},
    y:{ enumerable:true, get:()=>(__matrix.length &&  compute('y') || __ref.y), set:v=>__ref.y = v},
    z:{ enumerable:true, get:()=>(__matrix.length &&  compute('z') || __ref.z), set:v=>__ref.z = v},
    w:{ enumerable:true, get:()=>(__matrix.length &&  compute('w') || __ref.w), set:v=>__ref.w = v},
    meta:{
      enumerable:false, 
      get(){ return __meta },
      set(it){ this.__meta = typeof it === "object" ? it : null; return this.__meta; }
    },
    addMatrix: {
      enumerable:false,
      value:function(matrix){
        if(!validMatrix(matrix)) throw new Error("invalid addMatrix param");
        __matrix.push(matrix);
        __computed.matrixVersion+=1;
        return this;
      }
    }
  });
  
  this.meta = meta;
};

Point.prototype = {
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta&&this.meta||{},obj);
    return this;
  },
  clone (){
    return new Point(this.x,this.y,this.z,this.w);
  },
  toJSON (withMeta){
    const json = { x:this.x, y:this.y, z:this.z, w:this.w };
    if(withMeta === true && this.meta) json.meta = this.meta;
    return json;
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
    return new Vertex(points);
  },
  rectWith ({x, y}){
    const [largeX, smallX] = this.x > x ? [ this.x, x ] : [ x, this.x ];
    const [largeY, smallY] = this.y > y ? [ this.y, y ] : [ y, this.y ];
    return new Rect(smallX,smallY,largeX-smallX,largeY-smallY,0,0);
  }
};

const Vertex = function(pointArray,meta){
  let __meta;
  
  Object.defineProperties(this,{
    meta:{
      enumerable:false, 
      get(){ return __meta },
      set(it){ this.__meta = typeof it === "object" ? it : null; return this.__meta; }
    }
  });
  
  this.meta = meta;
  
  asArray(pointArray).forEach(point=>{
    if(!likePoint(point)) return;
    const {x,y,z,w} = point;
    this.push(new Point(x,y,z,w,__meta));
  });
};

(function(classFunction, methods){
  const prototype = [];
  
  classFunction.prototype = prototype;
  
  Object.keys(methods).forEach(key=>{
    prototype[key] = methods[key];
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
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta&&this.meta||{},obj);
    return this;
  },
  toJSON (withMeta){
    const result = [];
    this.forEach(p=>result.push(p.toJSON(withMeta)));
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
      const {x,y,z,w,meta} = newp;
      joins.push(new Point(x,y,z,w,meta));
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
      return new Point(x,y,z,w,this.meta);
    }
  },
  transform (transform,rect){
    const useRect = !!rect;
    
    if(useRect){
      const { left, top, width, height } = rect;      
      //rotateOrigin
      const originX = left + width/2;
      const originY = top + height/2;
      
      this.forEach(point=>{
        point.translate({ x:-originX, y:-originY });
        point.transform(transform);
        point.translate({ x:originX, y:originY });
      });
    } else {
      this.forEach(point=>{
        point.transform(transform);
      });
    }
    return this;
  }
}));



const Rect = function(left=0,top=0,width=0,height=0,meta=null){
  const __ref = { left,top,width,height };
  let __meta;
  Object.defineProperties(this,{
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
    meta:{
      enumerable:false, 
      get(){ return __meta },
      set(it){ this.__meta = typeof it === "object" ? it : null; return this.__meta; }
    }
  });
  
  this.meta = meta;
};

Rect.prototype = {
  addMeta (obj){
    if(typeof obj === "object") this.meta = Object.assign(this.meta&&this.meta||{},obj);
    return this;
  },
  toJSON (withMeta){
    const json = {width:this.width, height:this.height, left:this.left, top:this.top, right:this.right, bottom:this.bottom };
    if(withMeta === true && this.meta) json.meta = this.meta;
    return json;
  },
  findPoint (findWord){
    const [ lineFind, pointFind ] = isArray(findWord) ? findWord : findWord.trim().split(/\s+/);
    return this.vertex(lineFind).point(pointFind);
  },
  vertex (order){
    const inheritMeta = Object.assign({
      perspective:0,
      perspectiveOrigin:{
        x:this.left + (this.width / 2),
        y:this.top  + (this.top / 2),
        z:0
      }
    },this.meta);
    
    switch(order){
    case "right": case "r":
      return new Vertex([{x:this.right, y:this.top, z:0, w:0},{x:this.right,y:this.bottom,z:0,w:0}],inheritMeta);
    case "bottom": case "b":
      return new Vertex([{x:this.left, y:this.bottom, z:0, w:0},{x:this.right,y:this.bottom,z:0,w:0}],inheritMeta);
    case "left": case "l":
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.left,y:this.bottom,z:0,w:0}],inheritMeta);
    case "top": case "t":
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.right,y:this.top,z:0,w:0}],inheritMeta);
    default:
      return new Vertex([{x:this.left, y:this.top, z:0, w:0},{x:this.left,y:this.bottom,z:0,w:0},{x:this.right,y:this.bottom,z:0,w:0},{x:this.right, y:this.top, z:0, w:0}],inheritMeta);
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
  }
};

const rect = function(left,top,width,height,x,y,valid){
  return typeof left === "object" ?
  new Rect(left.left,left.top,left.width,left.height,left.x,left.y,left.valid) :
  new Rect(left,top,width,height,x,y,valid);
};

const getNode = function(el){
  let select = likeArray(el) ? el[0] : el;
  return isNode(select) ? select : undefined;
};

const isElement = function(el){
  return el instanceof Element;
};

const getBoundingRect = function(el){
  el = getNode(el);
  
  if(!isElement(el)){
    return rect({
      x:0,y:0,left:0,top:0,width:0,height:0,right:0,bottom:0,valid:false
    });
  }
  
  const doc = document;
  const win = window;
  const body = doc.body;

  let offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
  (doc.documentElement || body.parentNode || body).scrollLeft;
  let offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
  (doc.documentElement || body.parentNode || body).scrollTop;
  
  const boundingRect = el.getBoundingClientRect();

  if (el !== body) {
    var parent = el.parentNode;

    while (parent !== body) {
      offsetX += parent.scrollLeft;
      offsetY += parent.scrollTop;
      parent   = parent.parentNode;
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
  });
};

const getElementBoundingRect = function(el){
  el = getNode(el);
  const win  = window;
  
  const elRect = getBoundingRect(el).toJSON();
  
  if(elRect.valid === false){
    return rect(elRect);
  }
  
  let current = el;
  let parent  = el.parentNode;
  
  do {
    if(parent && (!parent.html && !parent.body)  && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))){
      const { top, left } = getBoundingRect(parent);
      elRect.top   -= top;
      elRect.left  -= left;
      elRect.right  = elRect.left + elRect.width;
      elRect.bottom = elRect.top + elRect.height;
      current = parent = null;
    } else if(!parent) {
      current = null;
    } else {
      current = parent;
      parent = current.parentNode;
    }
  } while( !!parent )
  
  return rect(elRect);
};

const windowRect = function(){
  return rect({
    left:window.screenLeft || window.screenX,
    top:window.screenTop || window.screenY,
    width:window.outerWidth,
    height:window.outerHeight
  });
};

const svgPathWithVertex = function(vertex$$1, close){
  let dValue = "";
  
  vertex$$1.forEach((point$$1, index)=>{
    const prefix = index === 0 ? 'M' : 'L';
    dValue += `${prefix}${point$$1.x} ${point$$1.y} `;
  });
  
  if(!!dValue && close === true){
    dValue += " Z";
  }
  
  return dValue;
};

/*
  usage
  const size = 20
  const stroke = 1

  const { x, y, radius, diameter } = drawCircleVars(size, stroke);
  
  const d = `M${x} ${y} 
  a ${radius} ${radius} 0 0 1 0 ${diameter}
  a ${radius} ${radius} 0 0 1 0 -${diameter}`

  <svg viewbox="0 0 {size} {size}">
    <path d="{d}" stroke-width="stroke"></path>
  </svg>
*/

const readUrl = function(inputUrl){
  let info;
  let url; 
    
  try {
    url  = inputUrl?inputUrl:window.document.URL.toString();
    info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_\;\=]+|)(\?[\d\w\=\&\%\,\.\/\(\)-]+|)(\#[\d\w]*|)/.exec(url);
  } catch(e) {
    info = null;
  }
  
  if(info === null) {
    console.error("faild parse url",inputUrl);
    return {
      url:url || null,
      valid:false
    };
  }
  
  const protocol = info[1];
  const divider = info[2];
  const userinfo = info[3];
  const hostname = info[4];
  const port = info[5].substring(1);
  const path = info[6]+info[7];
  const query = info[8];
  const fragment = info[9];
  const filename = /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6]+info[7])[2];
  const host = info[1]+info[2]+info[4]+info[5];
  const params = (function(){
    const result = {};
    if(query){
      query.substr(1).split("&").forEach((onePiece)=>{
        const entry = onePiece.split("=");
        result[decodeURI(entry[0])] = decodeURI(entry[1]);
      });
    }
    return result;
  }());

  return {
    url,
    protocol,
    divider,
    userinfo,
    hostname,
    port,
    path,
    query,
    fragment,
    filename,
    host,
    params,
    valid:true
  };
};

const PromiseClass = Promise;

const resolveFn = PromiseClass.resolve;
const rejectFn = PromiseClass.reject;

const newPromise=(fn)=>(new PromiseClass((r,c)=>{
  const maybeAwaiter = fn(r,c);
  likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
}));

const promise = (fn)=>newPromise(fn);
const PromiseFunction = promise;

const all$1     = Promise.all;
PromiseFunction.all  = all$1;

const resolve    = resolveFn;
PromiseFunction.resolve = resolve;

const reject    = rejectFn;
PromiseFunction.reject = reject;

const timeout = function(fn,time){
  if(typeof fn === "number"){
    return newPromise( resolve => setTimeout(() => resolve(time), fn) );
  } else {
    return newPromise( resolve => setTimeout(() => resolve(typeof fn === "function" ? fn() : fn),time) );
  }
};
PromiseFunction.timeout = timeout;

const valueOf = function(maybeQ){
  return newPromise(function(resolve,reject){
    likePromise(maybeQ) ?
    maybeQ.then(resolve).catch(reject) :
    resolve(maybeQ) ;
  });
};
PromiseFunction.valueOf = valueOf;

const abortMessage = new (function() {
  Object.defineProperty(this, "message", {
    get: ()=>":abort"
  });
  Object.defineProperty(this, "abort", {
    get: ()=>true
  });
})();

const abort = function(notifyConsole = undefined) {
  return new PromiseClass((resolve, reject)=>{
    if(notifyConsole === true) {
      console.warn("abort promise");
    }
    reject(abortMessage);
  });
};
PromiseFunction.abort = abort;

const defer = function(){
  var resolve, reject;
  var promise = new PromiseClass(function() {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
};
PromiseFunction.defer = defer;

const until = function(tasks, option) {
  if(!(tasks instanceof Array)) {
    return PromiseFunction.reject(new Error("tasks must be array"));
  }

  if(!tasks.length || !tasks.some(e=>typeof e === "function")) {
    return PromiseFunction.reject(new Error("not found wheel executable"));
  }

  if(!tasks.some(e=>(typeof e !== "function" || typeof e !== "number"))) {
    return PromiseFunction.reject(new Error("wheel task only function or number executable"));
  }

  if(typeof option !== "object") {
    option = {};
  }

  let finished = false;
  let defer;
  const limit = (typeof option.limit === "number" && option.limit > 0) ? parseInt(option.limit, 10) : 10000;
  const taskLength = tasks.length;
  let wheelTick = 0;
  let resetScope = 0;
  const nextWheelTick = (tick, value, tickScope)=>{
    const nowAction = tasks[turn(tick, taskLength, 1)];

    const isActiveFn = ()=>{
      return tickScope === resetScope;
    };

    const nextTickFn = passValue=>{
      // if reset called
      if(!isActiveFn()) return;
      // if over tick
      if(wheelTick > limit) {
        return defer.reject(new Error("limit"));
      }
      if(finished === false) {
        nextWheelTick(wheelTick++, passValue, tickScope);
      }
    };

    if(typeof nowAction === "function") {
      nowAction(
        {
          value,
          next    : nextTickFn,
          isActive: isActiveFn,
          resolve : defer.resolve,
          reject  : defer.reject
        },
        Math.floor(tick / tasks.length),
        tick
      );
    } else if(typeof nowAction === "number") {
      setTimeout(()=>{ nextTickFn(value); }, nowAction);
    }
  };
  
  const thenStack  = [
    e=>{
      if(finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }
  ];
  const catchStack = [
    e=>{
      if(finished === null) return PromiseFunction.abort();
      finished = true;
      return PromiseFunction.reject(e);
    }
  ];
  
  const deferReset = (resetTick)=>{
    defer && defer.stop();
    //
    defer = PromiseFunction.defer();
    thenStack.forEach(fn=>defer.promise.then(fn));
    catchStack.forEach(fn=>defer.promise.catch(fn));
    
    //
    defer.stop = ()=>{
      finished = null;
      resetScope += 1;
    };
    
    defer.start = (resetTick)=>{
      if(finished === null) {
        finished = false;
        wheelTick = typeof resetTick === "number" ? resetTick : 0;
        nextWheelTick(wheelTick++, option.value, resetScope);
      }
    };
    //
    defer.reset = deferReset;
    //
    finished = null;
    defer.start(resetTick);
  };
  
  deferReset(0);
  
  const wheelControls = {
    ...defer,
    then (fn){
      defer.promise.then(fn);
      thenStack.push(fn);
      return wheelControls;
    },
    catch (fn){
      defer.promise.catch(fn);
      catchStack.push(fn);
      return wheelControls;
    }
  };
  
  return wheelControls;
};

export { readUrl, windowRect, windowProps, openWindow, closeWindow, getElementBoundingRect, svgPathWithVertex, rect, until, timeout };
