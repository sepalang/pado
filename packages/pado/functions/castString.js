const baseCaseSplit = function (s){
  s = s.replace(/^\#/, "").trim()

  var e = s.split(/\s+/)
  if(e.length > 1) return e

  var k = s.split(/\-+/)
  if(k.length > 1) return k

  var _ = s.split(/\_+/)
  if(_.length > 1) return _

  return s.replace(/[A-Z][a-z]/g, function (s){ return `%@${s}` }).replace(/^\%\@/, "").split("%@")
}

export const pascalCase = function (string, joinString = ""){
  const words = baseCaseSplit(string)
  for(var i = 0, l = words.length; i < l; i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase()
  return words.join(joinString)
}

export const camelCase = function (string, joinString = ""){
  const pascalCaseString = pascalCase(string, joinString)
  return `${(pascalCaseString.substr(0, 1) || '').toLowerCase()}${pascalCaseString.substr(1) || ''}`
}
