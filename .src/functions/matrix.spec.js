import { domainRangeValue, domainRangeInterpolate } from './matrix';

describe('Functions matrix', () => {

  it('domainRangeValue', ()=>{
    expect( domainRangeValue([0,10],[0,100],1) ).toEqual(10); 
    expect( domainRangeValue([0,10],[0,100],5) ).toEqual(50); 
    expect( domainRangeValue([0,10],[0,100],10) ).toEqual(100); 
    expect( domainRangeValue([0,10],[0,100],20) ).toEqual(200); 
    expect( domainRangeValue([0,10],[0,100],-10) ).toEqual(-100); 
  });
  
  it('domainRangeInterpolate', ()=>{
    const tenIntp = domainRangeInterpolate([0,10],[0,100]);
    
    expect( tenIntp(1) ).toEqual(10); 
    expect( tenIntp(5) ).toEqual(50); 
    expect( tenIntp(10) ).toEqual(100); 
    expect( tenIntp(20) ).toEqual(200); 
    expect( tenIntp(-10) ).toEqual(-100); 
    
    tenIntp.domain([0,100])
    
    expect( tenIntp(10) ).toEqual(10); 
    expect( tenIntp(100) ).toEqual(100); 
    expect( tenIntp(1000) ).toEqual(1000); 
  });
  
});

