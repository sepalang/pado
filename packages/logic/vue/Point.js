/*
  HighOrderPoint([["x","y","point"],[0,0]])
  HighOrderPoint([["left","top","point"],[0,0]])
*/

const DEFAULT_POINT_SIZE_VALUE = 20
export default function (...options){
  if(!options.length){
    options = [[[], []]]
  }

  const props = {}
  const computed = {}

  options.forEach(([ keys = [], defaultValues = [] ])=>{
    const [xKey = 'x', yKey = 'y', pointKey = 'point', rxKey = 'rx', ryKey = 'ry'] = keys
    const [xParam = DEFAULT_POINT_SIZE_VALUE, yParam = DEFAULT_POINT_SIZE_VALUE] = defaultValues

    Object.assign(props, {
      [ xKey ] : { default: xParam },
      [ yKey ] : { default: yParam },
      [ rxKey ]: { default: undefined },
      [ ryKey ]: { default: undefined }
    })

    const pointValueKey = pointKey + 'Value'
    const pointStyleValueKey = pointKey + 'StyleValue'

    Object.assign(computed, {
      [ pointValueKey ]: function (){
        return {
          [ xKey ]: typeof this[rxKey] === "number" ? Number.prototype.toFixed.call(this[rxKey] * 100, 3) : parseInt(this[xKey], 10),
          [ yKey ]: typeof this[ryKey] === "number" ? Number.prototype.toFixed.call(this[ryKey] * 100, 3) : parseInt(this[yKey], 10)
        }
      },
      [ pointStyleValueKey ]: function (){
        return {
          [ xKey ]: typeof this[rxKey] === "number" ? Number.prototype.toFixed.call(this[rxKey] * 100, 3) + '%' : parseInt(this[xKey], 10) + 'px',
          [ yKey ]: typeof this[ryKey] === "number" ? Number.prototype.toFixed.call(this[ryKey] * 100, 3) + '%' : parseInt(this[yKey], 10) + 'px'
        }
      }
    })
  })

  const highOrderMixins = { props, computed }
  return highOrderMixins
}
