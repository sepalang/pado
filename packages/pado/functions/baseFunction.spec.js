export const {
  stringTest,
  matchString
} = require('./baseFunction')
typeof describe === "function" && describe('Functions baseFunction', ()=>{
  
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
  
})
