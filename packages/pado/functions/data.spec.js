export const {
  zip,
  zips,
  unzip,
  unzips,
  groupBy
} = require('./cast')

typeof describe === "function" && describe('Functions data', ()=>{
  
  it('zip', ()=>{
    expect(zip(['foo','bar'],[1,2])).toEqual({ foo:1, bar:2 })
    expect(zip([1,2,3],[10,20,30])).toEqual({ foo:1, bar:2 })
  })
  
  //it('zips', ()=>{
  //  
  //})
  //
  //it('unzip', ()=>{
  //  
  //})
  //
  //it('unzips', ()=>{
  //  
  //})
  //
  //it('groupBy', ()=>{
  //  
  //})
  
})