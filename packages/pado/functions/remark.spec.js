import { fallback, valueOf, stringTest, entries, keys, deepKeys, matchString, findIndex, findIndexes } from './remark'

describe('Functions remark', ()=>{
  
  it('fallback', ()=>{
    const fallbackValue = { fallback: "value" }
    expect(fallback(1, ()=>fallbackValue)).toEqual(1)
    expect(fallback('', ()=>fallbackValue)).toEqual('')
    expect(fallback('a', ()=>fallbackValue)).toEqual('a')
    expect(fallback({ foo: 'bar' }, ()=>fallbackValue)).toEqual({ foo: 'bar' })
    expect(fallback(true, ()=>fallbackValue)).toEqual(true)
    expect(fallback(false, ()=>fallbackValue)).toEqual(false)
    expect(fallback(null, ()=>fallbackValue)).toEqual(null)
    const fnValue = ()=>{}
    expect(fallback(fnValue, ()=>fallbackValue)).toEqual(fnValue)
    expect(fallback(undefined, ()=>fallbackValue)).toEqual(fallbackValue)
    //
  })
  
  it('valueOf', ()=>{
    const arg1 = "bar"
    const arg2 = "kim"
    expect(valueOf(1, arg1)).toEqual(1)
    expect(valueOf('', arg1)).toEqual('')
    expect(valueOf('a', arg1)).toEqual('a')
    expect(valueOf({ foo: 'bar' }, arg1)).toEqual({ foo: 'bar' })
    expect(valueOf(true, arg1)).toEqual(true)
    expect(valueOf(false, arg1)).toEqual(false)
    expect(valueOf(null, arg1)).toEqual(null)
    expect(valueOf(undefined, arg1)).toEqual(undefined)
    expect(valueOf(()=>'foo', arg1)).toEqual('foo')
    expect(valueOf((arg)=>'foo' + arg, arg1)).toEqual('foobar') 
    expect(valueOf((...args)=>args.join(''), arg1, arg2)).toEqual('barkim') 
  })
  
  it('stringTest', ()=>{
    expect(stringTest(undefined)).toEqual(false)
    expect(stringTest('nofilter')).toEqual(true)
    expect(stringTest('true', ()=>true)).toEqual(true)
    expect(stringTest('false', ()=>false)).toEqual(false)
    expect(stringTest('false', 'false')).toEqual(true)
    expect(stringTest('false', 'true')).toEqual(false)
    expect(stringTest('false', ['false'])).toEqual(true)
    expect(stringTest('false', ['false', 'true'])).toEqual(true)
    expect(stringTest('123', '123')).toEqual(true)
    expect(stringTest(123, 123)).toEqual(true)
    expect(stringTest(123, '123')).toEqual(true)
    expect(stringTest('123', 123)).toEqual(true)
    expect(stringTest([123], 123)).toEqual(false)
    expect(stringTest([123], [123])).toEqual(false)
    expect(stringTest('123', /^12/)).toEqual(true)
    expect(stringTest('123', /^123/)).toEqual(true)
    expect(stringTest('123', /^1234/)).toEqual(false)
    expect(stringTest(123, /^12/)).toEqual(true)
    expect(stringTest(123, /^123/)).toEqual(true)
    expect(stringTest(123, /^1234/)).toEqual(false)
    expect(stringTest(123, (value)=>typeof value === "number")).toEqual(true)
    expect(stringTest('123', (value)=>typeof value === "string")).toEqual(true)
    expect(stringTest(123, (value)=>value > 100)).toEqual(true)
    expect(stringTest(123, (value)=>value < 100)).toEqual(false)
  })
  
  it('entries', ()=>{
    expect(entries([1, 2, 3])).toEqual([[0, 1], [1, 2], [2, 3]])
    expect(entries({ foo: "bar" })).toEqual([["foo", "bar"]])
    
    //
    expect(entries(null)).toEqual([])
    expect(entries()).toEqual([])
    expect(entries(1)).toEqual([])
    expect(entries("string")).toEqual([])
    expect(entries(false)).toEqual([])
  })
  
  it('keys', ()=>{
    const dummyInstance = getInstance()
    
    //
    expect(keys([1, 2, 3])).toEqual([0, 1, 2])
    expect(keys([1, 2])).toEqual([0, 1])
    expect(keys({ foo: "bar", kim: "chi" })).toEqual(["foo", "kim"])
    expect(keys(dummyInstance)).toEqual(["name", "called", "now"])
    
    //
    const arrKey = [2, 3]
    arrKey["foo"] = 123
    expect(keys(arrKey)).toEqual([0, 1])
    
    //
    expect(keys([])).toEqual([])
    expect(keys({})).toEqual([])
    expect(keys(new Date())).toEqual([])
    //
    expect(keys()).toEqual([])
    expect(keys(false)).toEqual([])
    expect(keys(null)).toEqual([])
    
    
    function getInstance (){
      var DummyClass = function (){
        this.name = "dummy"
        this.called = 0
        this.now = ()=>this.called
      }

      DummyClass.prototype = {
        plus (){
          this.called++
        }
      }

      var dummyInstance = new DummyClass()
      dummyInstance.plus()
      dummyInstance.plus()
      return dummyInstance
    }
  })
  
  it('deepKeys', ()=>{
    expect(deepKeys({ a: 1, b: { d: 1, e: 2 }, c: [1, 2, 3] })).toEqual([ 
      ['a'],
      ['b'],
      ['b', 'd'],
      ['b', 'e'],
      ['c'],
      ['c', 0],
      ['c', 1],
      ['c', 2] 
    ])
    
    expect(deepKeys([null, {}, { a: 1, b: 2, arr: [3, 4, [5, null]] }, 123, { the: "end" }])).toEqual([ 
      [0],
      [1],
      [2],
      [2, 'a'],
      [2, 'b'],
      [2, 'arr'],
      [2, 'arr', 0],
      [2, 'arr', 1],
      [2, 'arr', 2],
      [2, 'arr', 2, 0],
      [2, 'arr', 2, 1],
      [3],
      [4],
      [4, 'the']
    ])
  })
  
  
  it('matchString', ()=>{
    expect(matchString("hello.world", ".")).toEqual([5, 1])
    expect(matchString("hello-world.hello", ".")).toEqual([11, 1])
    expect(matchString("hello.world.hello", ".", 6)).toEqual([11, 1])
    expect(matchString("hello..world", "..")).toEqual([5, 2])
    expect(matchString("hello.world", /l./)).toEqual([2, 2])
    expect(matchString("hello.world", /l.o/)).toEqual([2, 3])
    expect(matchString("hello.world", /o.w/)).toEqual([4, 3])
    
    expect(matchString("abcd", "c")).toEqual([2, 1])
    expect(matchString("abcd", "c", 2)).toEqual([2, 1])
    
    expect(matchString("hello.world", /l./, 5)).toEqual([9, 2])
    expect(matchString("hello.world", /l.o/, 5)).toEqual([-1, 0])
    
    expect(matchString("hello.world", "")).toEqual([0, 0])
    expect(matchString("hello.world", "z")).toEqual([-1, 0])
  })
  
  // isEmpty
  it('findIndex', ()=>{
    expect(findIndex("hello world", "l")).toEqual(2)
    expect(findIndex("hello world", /l/)).toEqual(2)
    expect(findIndex("hello world", /\s/)).toEqual(5)
  })
  
  it('findIndexes', ()=>{
    expect(findIndexes("hello world", "l")).toEqual([2, 3, 9])
    expect(findIndexes("hello world", /l/)).toEqual([2, 3, 9])
    expect(findIndexes("hello world", /\s/)).toEqual([5])
  })
})
