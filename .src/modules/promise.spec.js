import { promisify } from './promise';
import fs from 'fs';
import path from 'path';

describe('Modules promise', () => {
  const f=p=>path.resolve(__dirname,p);
  
  
  it('promisify', async () => {
    
    const _readFile = promisify(fs.readFile);
    
    //normal promisify
    const testContent = await _readFile(f('promise.test.md'),'utf-8');
    expect(testContent).toEqual('Hello world');
    
    //error test
    let maybeError;
    try {
      maybeError = await _readFile(f('unknown.md'),'utf-8')
    } catch(e){
      maybeError = new Error();
    }
    expect(maybeError instanceof Error).toBe(true);
    
    //jest code
    await (new Promise(r=>setTimeout(r,100)));
  })
});

