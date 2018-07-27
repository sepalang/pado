import { all } from './enumerable'
describe('Functions enumerable', ()=>{
  it('all', ()=>{
    //
    expect(all([1, 2, 3], v=>typeof v === "number")).toEqual(true)
    expect(all([1, "2", 3], v=>typeof v === "number")).toEqual(false)
    
    //
    expect(all()).toEqual(false)
    expect(all(1, v=>typeof v === "number")).toEqual(true)
    expect(all(1, v=>typeof v === "string")).toEqual(false)
  })
})
