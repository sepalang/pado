export const {
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
  compactOf,
  compact,
  freeOf,
  free,
  purgeOf,
  purge,
  alloc
} = require('./cast')

export const getTestModel = function (){
  return {
    a: { name: 'a', $checked: true, $detail: { info: [], meta: [] } },
    b: { _name: 'a', age: undefined, job: null },
    c: { $checked: true, $detail: undefined },
    d: { $$: 'double', $$$: 'triple' }
  }
}

typeof describe === "function" && describe('Functions cast', ()=>{
  
  it('cloneDeep', ()=>{
    const data_1 = { my: "name", $is: "foo", data: { bar: "kim" } }
    const cloned_1 = cloneDeep(data_1)
    expect(cloned_1).toEqual(data_1) 
    expect(cloned_1 === data_1).toEqual(false)
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
    // self replace test
    const data_1 = [1, 2]
    const concat_1 = concatOf(data_1, [0, 3])
    expect(concat_1).toEqual([1, 2, 0, 3])
    expect(data_1 === concat_1).toEqual(true)
    
    //
    expect(concatOf([1, 2], [0, 3])).toEqual([1, 2, 0, 3])
    expect(concatOf([1, 2], 0, 3)).toEqual([1, 2, 0, 3])
    expect(concatOf(1, 0, 3)).toEqual([1, 0, 3])
  })
  
  it('filterOf', ()=>{
    const data_1 = [1, 2]
    expect(filterOf(data_1, n=>typeof n === 'number')).toEqual([1, 2])
    expect(data_1).toEqual([1, 2])
    
    const data_2 = [1, 2]
    expect(filterOf(data_2, n=>typeof n === 'string')).toEqual([])
    expect(data_2).toEqual([])
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
  
  it('pickOf', ()=>{
    const data_1 = [1, 2, 3, 4, 5]
    const picked_1 = pickOf(data_1, [0, 2, 4])
    expect(picked_1).toEqual([1, 3, 5])
    expect(picked_1 === data_1).toEqual(true)
    
    //
    const data_2 = {
      "foo": 1,
      "bar": 2,
      "kim": 3
    }
    const picked_2 = pickOf(data_2, ["foo", "kim"])
    expect(picked_2).toEqual({ "foo": 1, "kim": 3 })
    expect(picked_2 === data_2).toEqual(true)
  })
  
  it('pick', ()=>{
    const data_1 = [1, 2, 3, 4, 5]
    const picked_1 = pick(data_1, [0, 2, 4])
    expect(picked_1).toEqual([1, 3, 5])
    expect(picked_1 !== data_1).toEqual(true)
    
    //
    const data_2 = {
      "foo": 1,
      "bar": 2,
      "kim": 3
    }
    const picked_2 = pick(data_2, ["foo", "kim"])
    expect(picked_2).toEqual({ "foo": 1, "kim": 3 })
    expect(picked_2 !== data_2).toEqual(true)
  })
  
  it('compactOf', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(compactOf(a)).toEqual({ name: 'a', $checked: true, $detail: { info: [], meta: [] } })
    expect(compactOf(b)).toEqual({ _name: 'a', job: null })
    expect(compactOf(c)).toEqual({ $checked: true })
    expect(compactOf(d)).toEqual({ $$: 'double', $$$: 'triple' })
  })
  
  it('compact', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(compact(a)).toEqual({ name: 'a', $checked: true, $detail: { info: [], meta: [] } })
    expect(compact(b)).toEqual({ _name: 'a', job: null })
    expect(compact(c)).toEqual({ $checked: true })
    expect(compact(d)).toEqual({ $$: 'double', $$$: 'triple' })
  })
  
  it('freeOf', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(freeOf(a)).toEqual({ name: 'a' })
    expect(freeOf(b)).toEqual({ _name: 'a', age: undefined, job: null })
    expect(freeOf(c)).toEqual({})
    expect(freeOf(d)).toEqual({})
  })
  
  it('free', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(free(a)).toEqual({ name: 'a' })
    expect(free(b)).toEqual({ _name: 'a', age: undefined, job: null })
    expect(free(c)).toEqual({})
    expect(free(d)).toEqual({})
  })
  
  it('purgeOf', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(purgeOf(a)).toEqual({ name: 'a' })
    expect(purgeOf(b)).toEqual({ _name: 'a', job: null })
    expect(purgeOf(c)).toEqual({})
    expect(purgeOf(d)).toEqual({})
  })
  
  it('purge', ()=>{
    const { a, b, c, d } = getTestModel()
    expect(purge(a)).toEqual({ name: 'a' })
    expect(purge(b)).toEqual({ _name: 'a', job: null })
    expect(purge(c)).toEqual({})
    expect(purge(d)).toEqual({})
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

