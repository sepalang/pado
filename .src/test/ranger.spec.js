import { ranger } from '../src/modules/ranger';

describe('Functions ranger', () => {
  
  it("ranger - add", ()=>{
    const it = ranger();
    expect( it.value ).toEqual( 0 );
    
    it.add(2);
    expect( it.value ).toEqual( 2 );
    
    it.add(-4);
    expect( it.value ).toEqual( -2 );
    
    it.add(2);
    expect( it.value ).toEqual( 0 );
  });
  
  it("ranger - set value", ()=>{
    const ten = ranger(10);
    
    ten.value = 0;
    expect( ten.done ).toEqual( true );
    
    ten.value = 10;
    expect( ten.done ).toEqual( true );
    
    ten.value = 11;
    expect( ten.done ).toEqual( false );
  });
  
  it("ranger - addExpectIn", ()=>{
    const ten = ranger(10);
    expect( ten.addExpectIn(10) ).toEqual( true );
    expect( ten.addExpectIn(11) ).toEqual( false );
    expect( ten.addExpectIn(0) ).toEqual( true );
    expect( ten.addExpectIn(-1) ).toEqual( false );
    //
    expect( ten.value ).toEqual( 0 );
  });
  
})
