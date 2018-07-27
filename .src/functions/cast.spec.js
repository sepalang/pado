import { cloneDeep, free } from './cast'

describe('Functions cast', ()=>{
  const a = {name: 'a', id: 12}
  
  it('cloneDeep', ()=>{
    expect(cloneDeep(a)).toEqual(a) 
  })
  
  it('free', ()=>{
    const a = {name: 'a', $checked: true}
    const b = {name: 'b', $checked: true, $detail: { info: [], meta: [] }}
    const c = {$checked: true, $detail: { info: [], meta: [] }}
    const d = {name: 'b', id: 30, _check: false}
    const e = {$$: 'double', $$$: 'triple'}
    
    expect(free(a)).toEqual({name: 'a'})
    expect(free(b)).toEqual({name: 'b'})
    expect(free(c)).toEqual({})
    expect(free(d)).toEqual({name: 'b', id: 30, _check: false})
    expect(free(e)).toEqual({})
  })
})

