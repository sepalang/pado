import { readUrl, serialize } from './url'

describe('Dom::env url', ()=>{
  it("readUrl - base", ()=>{
    expect(readUrl("http://nineten11.net")).toEqual({
      divider : "://", 
      filename: "", 
      fragment: "", 
      host    : "http://nineten11.net", 
      hostname: "nineten11.net", 
      params  : {}, 
      path    : "", 
      port    : "", 
      protocol: "http", 
      query   : "", 
      url     : "http://nineten11.net", 
      userinfo: "",
      valid   : true
    })
  })
  
  it("readUrl - parseParam", ()=>{
    expect(readUrl("http://nineten11.net?uniqueKey=123&uniqueName=foobar")).toEqual({
      divider : "://", 
      filename: "", 
      fragment: "", 
      host    : "http://nineten11.net", 
      hostname: "nineten11.net", 
      params  : {
        uniqueKey : "123",
        uniqueName: "foobar"
      }, 
      path    : "", 
      port    : "", 
      protocol: "http", 
      query   : "?uniqueKey=123&uniqueName=foobar", 
      url     : "http://nineten11.net?uniqueKey=123&uniqueName=foobar", 
      userinfo: "",
      valid   : true
    })
  })
  
  it("readUrl", ()=>{
    expect(serialize({ foo: "bar" })).toEqual("foo=bar")
    expect(serialize({ foo: "bar", kim: 11 })).toEqual("foo=bar&kim=11")
    expect(serialize({ foo: "bar", kim: undefined })).toEqual("foo=bar")
    expect(serialize({ foo: "bar", kim: null })).toEqual("foo=bar&kim=")
  })
})

