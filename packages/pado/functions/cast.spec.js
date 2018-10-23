import {
  cloneDeep,
  removeValue,
  unique,
  moveOf,
  concatOf,
  filterOf,
  omitOf,
  omit,
  pickOf,
  pick,
  freeOf,
  free,
  purgeOf,
  purge,
  alloc
} from './cast'

describe('Functions cast', ()=>{
  
  it('cloneDeep', ()=>{
    const cloneA = cloneDeep(a)
    expect(cloneA).toEqual(a) 
    expect(cloneA === a).toEqual(false)
  })
  
  it('removeValue', ()=>{
    expect(removeValue([0, 1, 2], 1)).toEqual([0, 2])
    expect(removeValue({ a: 2, b: 3 }, 3)).toEqual({ a: 2 })
    
    const a = { name: 'a' }
    const b = { name: 'b' }
    const c = { name: 'c' }
    const list = [a, b, c]
    expect(removeValue(list, b)).toEqual([a, c])
  })
  
  it('unique', ()=>{
    expect(unique([1, 2, 3, 4])).toEqual([1, 2, 3, 4])
    expect(unique([1, 1, 2, 2])).toEqual([1, 2])
    expect(unique([2, 2, 1, 1, 3])).toEqual([2, 1, 3])
  })
  
  it('moveOf', ()=>{
    expect(moveOf([1, 2], 0, 1)).toEqual([2, 1])
    expect(moveOf([1, 2], 0, 3)).toEqual([2, 1])
    expect(moveOf(1, 0, 3)).toEqual([1])
  })
  
  it('concatOf', ()=>{
    expect(concatOf([1, 2], [0, 3])).toEqual([1, 2, 0, 3])
    expect(concatOf([1, 2], 0, 3)).toEqual([1, 2, 0, 3])
    expect(concatOf(1, 0, 3)).toEqual([1, 0, 3])
  })
  
  it('filterOf', ()=>{
    // const data_1 = [1, 2];
    // expect(filterOf(data_1,n=>typeof n === 'number')).toEqual([1, 2])
    // expect(data_1).toEqual([1, 2])
    // 
    // const data_2 = [1, 2];
    // expect(filterOf(data_2,n=>typeof n === 'string')).toEqual([1, 2])
    // expect(data_2).toEqual([])
  })
  
  it('omitOf', ()=>{
    //
    const target = [1]
    expect(omitOf(target, 0)).toEqual([])
    expect(target).toEqual([])
    
    //
  })
  it('omit', ()=>{
    //
    const target = [1]
    expect(omit(target, 0)).toEqual([])
    expect(target).toEqual([1])
  })
  
  
  const a = { name: 'a', id: 12 }
  
  it('free', ()=>{
    const a = { name: 'a', $checked: true }
    const b = { name: 'b', $checked: true, $detail: { info: [], meta: [] } }
    const c = { $checked: true, $detail: { info: [], meta: [] } }
    const d = { name: 'b', id: 30, _check: false }
    const e = { $$: 'double', $$$: 'triple' }
    
    expect(free(a)).toEqual({ name: 'a' })
    expect(free(b)).toEqual({ name: 'b' })
    expect(free(c)).toEqual({})
    expect(free(d)).toEqual({ name: 'b', id: 30, _check: false })
    expect(free(e)).toEqual({})
  })
  
  it('alloc - scope', ()=>{
    //변수 선언 및 리셋 테스트
    let case1 = alloc(function (){
      let index = 0
      return ()=>index++
    })
    
    expect(case1()).toEqual(0)
    expect(case1()).toEqual(1)
    expect(case1()).toEqual(2)
    
    case1.reset()
    
    expect(case1()).toEqual(0)
    expect(case1()).toEqual(1)
    expect(case1()).toEqual(2)
  })
  
  it('alloc - bind', ()=>{
    const caseClass = function (){ 
      this.name = 'jake'
      this.insideInstance = alloc(function (){
        const prefix = 'inside'
        return function (){
          return `${prefix} ${this.name}`
        }
      })
    }
    
    caseClass.prototype = {
      protoInstance: alloc(function (){
        const prefix = 'proto'
        return function (){
          return `${prefix} ${this.name}`
        }
      })
    }
    
    const testInstance = new caseClass()
    
    testInstance['outsideInstance'] = alloc(function (){
      const prefix = "outside"
      return function (){
        return `${prefix} ${this.name}`
      }
    })
    
    const guestInstance = alloc(function (){
      const prefix = "guest"
      return function (){
        return `${prefix} ${this && this.name || 'undefined'}`
      }
    })
    
    testInstance['guestInstance'] = guestInstance
    
    const bindInstance = alloc(function (){
      const prefix = "bind"
      return function (){
        return `${prefix} ${this.name}`
      }
    })
    
    expect(testInstance.insideInstance()).toEqual('inside jake')
    expect(testInstance.protoInstance()).toEqual('proto jake')
    expect(testInstance.outsideInstance()).toEqual('outside jake')
    expect(testInstance.guestInstance()).toEqual('guest jake')
    expect(guestInstance()).toEqual('guest undefined')
    expect(bindInstance.bind(testInstance)()).toEqual('bind jake')
  })
})

