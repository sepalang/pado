import { limitOf, turn } from '../src/functions/nice';

describe('Functions nice', () => {
  
  it("limitOf", ()=>{
    expect( limitOf(1,2,0) ).toEqual(1);
    expect( limitOf(-1,2,0) ).toEqual(0);
    expect( limitOf(9,2,0) ).toEqual(2);
    expect( limitOf(-10,5,-5) ).toEqual(-5);
    expect( limitOf(-20,10,10) ).toEqual(10);
    expect( limitOf([-10,0,10],-30) ).toEqual([0,-30,-30]);
    expect( limitOf([-10,0,10],-30,null) ).toEqual([-30,-30,-30]);
    expect( limitOf([-10,0,10],-30,NaN) ).toEqual([-30,-30,-30]);
  });
  
  it('turn', ()=>{
    expect( turn(0,3)   ).toEqual( 0 );
    expect( turn(1,3)   ).toEqual( 1 );
    expect( turn(2,3)   ).toEqual( 2 );
    expect( turn(3,3)   ).toEqual( 0 );
    expect( turn(4,3)   ).toEqual( 1 );
    expect( turn(0,2,2) ).toEqual( 0 );
    expect( turn(1,2,2) ).toEqual( 0 );
    expect( turn(2,2,2) ).toEqual( 1 );
    expect( turn(3,2,2) ).toEqual( 1 );
    expect( turn(4,2,2) ).toEqual( 0 );
    expect( turn(5,2,2) ).toEqual( 0 );
  });
  
})
