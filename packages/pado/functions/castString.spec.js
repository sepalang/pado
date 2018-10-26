import { pascalCase, camelCase } from './castString'

describe('cast string', ()=>{
  
  function getSample (){
    return [
      "HelloWorld",
      "hello-world",
      "hello_world",
      "helloWorld"
    ]
  };
  
  it('pascalCase', ()=>{
    const sample = getSample()
    expect(pascalCase(sample[0])).toEqual("HelloWorld")
    expect(pascalCase(sample[1])).toEqual("HelloWorld")
    expect(pascalCase(sample[2])).toEqual("HelloWorld")
    expect(pascalCase(sample[3])).toEqual("HelloWorld")
  })
  
  it('camelCase', ()=>{
    const sample = getSample()
    expect(camelCase(sample[0])).toEqual("helloWorld")
    expect(camelCase(sample[1])).toEqual("helloWorld")
    expect(camelCase(sample[2])).toEqual("helloWorld")
    expect(camelCase(sample[3])).toEqual("helloWorld")
  })
  
})

