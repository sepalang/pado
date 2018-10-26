// eslint-disable-next-line no-use-before-define
export const WINDOW = typeof window !== "undefined" ? window : undefined
export const DOCUMENT = WINDOW && WINDOW.document || undefined

export const WEBENV = ()=>({
  window  : WINDOW,
  document: DOCUMENT
})

export const TEST_ELEMENT = DOCUMENT && DOCUMENT.createElement('div')

export const QUERY_SELECTOR_NAME = 
DOCUMENT
  ? ('querySelectorAll' in DOCUMENT) ? 'querySelectorAll'
  : ('webkitQuerySelectorAll' in DOCUMENT) ? 'webkitQuerySelectorAll'
  : ('msQuerySelectorAll' in DOCUMENT) ? 'msQuerySelectorAll'
  : ('mozQuerySelectorAll' in DOCUMENT) ? 'mozQuerySelectorAll'
  : ('oQuerySelectorAll' in DOCUMENT) ? 'oQuerySelectorAll' : null 
  : null

export const MATCHES_SELECTOR_NAME =
TEST_ELEMENT 
  ? ('matches' in TEST_ELEMENT) ? 'matches'
  : ('webkitMatchesSelector' in TEST_ELEMENT) ? 'webkitMatchesSelector'
  : ('msMatchesSelector' in TEST_ELEMENT) ? 'msMatchesSelector'
  : ('mozMatchesSelector' in TEST_ELEMENT) ? 'mozMatchesSelector'
  : ('oMatchesSelector' in TEST_ELEMENT) ? 'oMatchesSelector' : null
  : null

export const SUPPORT_COMPUTED_STYLE = WINDOW ? ('getComputedStyle' in WINDOW) : false
