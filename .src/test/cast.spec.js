import { entries } from '../src/functions/cast';
describe('Functions reducer', () => {
  
  it('entries', () => {
    expect( entries([1,2,3]) ).toEqual([[0,1],[1,2],[2,3]]);
    expect( entries({foo:"bar"}) ).toEqual([["foo","bar"]]);
    
    //
    expect( entries(null) ).toEqual([]);
    expect( entries() ).toEqual([]);
    expect( entries(1) ).toEqual([]);
    expect( entries("string") ).toEqual([]);
    expect( entries(false) ).toEqual([]);
  });
  
});