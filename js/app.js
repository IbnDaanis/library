const container = document.querySelector('.container')
const libraryContainer = document.querySelector('#libraryContainer')
const form = document.querySelector('form')
const author = document.querySelector('#author')
const title = document.querySelector('#title')
const pages = document.querySelector('#pages')
const isRead = document.querySelector('#isRead')

let myLibrary = localStorage.getItem('myLibrary')
  ? JSON.parse(localStorage.getItem('myLibrary'))
  : []

function Book(author, title, pages, isRead) {
  this.author = author
  this.title = title
  this.pages = pages
  this.isRead = isRead
  this.id = (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase()
}

const addBookToLibrary = (author, title, pages, isRead) => {
  const newBook = new Book(author, title, pages, isRead)
  myLibrary.push(newBook)
  console.log(myLibrary)
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
}

const removeBook = id => {
  myLibrary = myLibrary.filter(book => book.id !== id)
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
}

const addBookToDom = library => {
  libraryContainer.innerHTML = ''
  library.forEach(book => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.setAttribute('data-id', book.id)
    const title = document.createElement('h1')
    title.textContent = book.title
    const author = document.createElement('p')
    author.textContent = book.author
    const pages = document.createElement('p')
    pages.textContent = book.pages

    const submit = document.createElement('button')
    submit.textContent = 'Remove Book'
    submit.onclick = () => {
      removeBook(book.id)
      addBookToDom(myLibrary)
    }
    div.appendChild(title)
    div.appendChild(author)
    div.appendChild(pages)
    div.appendChild(submit)

    libraryContainer.appendChild(div)
  })
}
addBookToDom(myLibrary)

form.addEventListener('submit', e => {
  e.preventDefault()
  console.log(isRead.checked)
  addBookToLibrary(author.value, title.value, pages.value, isRead.checked)
  addBookToDom(myLibrary)
  author.value = ''
  title.value = ''
  pages.value = ''
  isRead.value = 'off'
})
