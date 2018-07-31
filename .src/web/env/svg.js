
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
