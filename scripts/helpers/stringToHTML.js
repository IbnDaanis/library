const stringToHTML = (str, elementType) => {
  const fragment = elementType
    ? document.createElement(elementType)
    : document.createDocumentFragment()
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  ;[...doc.body.children].forEach(element => fragment.appendChild(element))
  return fragment
}
