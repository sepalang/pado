export const {
  zip,
  zips,
  //unzip,
  //unzips,
  groupBy
} = require('./data')

typeof describe === "function" && describe('Functions data', ()=>{
  
  it('zip', ()=>{
    expect(zip(['foo','bar'],[1,2])).toEqual({ foo:1, bar:2 })
    expect(zip([1,2,3],[10,20,30])).toEqual({ "1":10, "2":20, "3":30 })
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