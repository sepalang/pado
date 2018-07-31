import { cut, cuts,  top } from './reduce'
describe('Functions reducer', ()=>{
  it('cut', ()=>{
    expect(cut([1, 2, 3])).toEqual([1])
    expect(cut([1, 2, 3], 2)).toEqual([1, 2])
    expect(cut([1, 2], 3)).toEqual([1, 2, undefined])
    expect(cut([1], 3, 1)).toEqual([1, 1, 1])
    expect(cut([0], 3, i=>i)).toEqual([0, 1, 2])
    expect(cut([0], 3, i=>i * i)).toEqual([0, 1, 4])
    expect(cut(0, 3, i=>i)).toEqual([0, 1, 2])
    //
    expect(cut([1, 2, 3], 1, undefined, true)).toEqual([[1], [2, 3]])
    expect(cut([1, 2, 3], 2, undefined, true)).toEqual([[1, 2], [3]])
    expect(cut([1, 2, 3], 4, 4, true)).toEqual([[1, 2, 3, 4], []])
    expect(cut([1, 2, 3], 4, i=>i, true)).toEqual([[1, 2, 3, 3], []])
  })
  
  it('cuts', ()=>{
    expect(cuts([1, 2, 3])).toEqual([[1], [2], [3]])
    expect(cuts([1, 2, 3], 2)).toEqual([[1, 2], [3, undefined]])
    //index
    expect(cuts([1, 2, 3], 2, (index, column, row)=>index)).toEqual([[1, 2], [3, 3]])
    expect(cuts([1, 2, 3, 4, 5], 2, (index, column, row)=>index)).toEqual([[1, 2], [3, 4], [5, 5]])
    //col
    expect(cuts([1, 2, 3], 2, (index, column, row)=>column)).toEqual([[1, 2], [3, 1]])
    expect(cuts([1, 2, 3, 4, 5], 2, (index, column, row)=>column)).toEqual([[1, 2], [3, 4], [5, 1]])
    //row
    expect(cuts([1], 2, (index, column, row)=>row)).toEqual([[1, 0]])
    expect(cuts([1, 2, 3], 2, (index, column, row)=>row)).toEqual([[1, 2], [3, 1]])
    expect(cuts([1, 2, 3, 4, 5], 2, (index, column, row)=>row)).toEqual([[1, 2], [3, 4], [5, 2]])
  })
  
  it('top', ()=>{
    expect(top([4, 2, 5])).toEqual(5)
    expect(top(["a", "b", "c"])).toEqual("c")
    
    //
    expect(top([4, 2, 5], null, 1)).toEqual([5])
    expect(top([4, 2, 5], null, 2)).toEqual([5, 4])
    expect(top([4, 2, 5], null, 10)).toEqual([5, 4, 2])
    
    //none array
    expect(top()).toEqual()
    expect(top(null)).toEqual()
    expect(top(false)).toEqual(false)
    expect(top(13)).toEqual(13)
    expect(top(13, null, 1)).toEqual([13])
    
    //
    expect(top([1, 2, 3], true)).toEqual(3)
    expect(top([1, 2, 3], false)).toEqual(1)
    expect(top([1, 2, 3], true, true)).toEqual([3, 2, 1])
    expect(top([1, 2, 3], false, true)).toEqual([1, 2, 3])    
    expect(top([1, 2, 3], (a, b)=>a < b, true)).toEqual([3, 2, 1])
    expect(top([1, 2, 3], (a, b)=>a > b, true)).toEqual([1, 2, 3])
    
    //
    expect(top([{id: 1}, {id: 3}, {id: 2}], "id", true)).toEqual([{id: 3}, {id: 2}, {id: 1}])
    expect(top([{id: 1}, {id: 3}, {id: 2}], "id")).toEqual({id: 3})
    
    //it's natural way
    expect(top([1, 2, 3], (a, b)=>a > b, false)).toEqual([])
  })
})
