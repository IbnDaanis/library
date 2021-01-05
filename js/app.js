const container = document.querySelector('.container')
const libraryContainer = document.querySelector('#libraryContainer')
const addBook = document.querySelector('#addBook')
const modal = document.querySelector('.modal')
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
    div.classList.add('book-item')
    div.setAttribute('data-id', book.id)
    const title = document.createElement('h2')
    title.textContent = book.title
    const author = document.createElement('p')
    author.textContent = `Author: ${book.author}`
    const pages = document.createElement('p')
    pages.textContent = `Pages: ${book.pages}`
    const read = document.createElement('p')
    read.textContent = `${book.isRead ? 'Read' : 'Not read'}`
    const submit = document.createElement('button')
    submit.textContent = 'X'
    submit.onclick = () => {
      removeBook(book.id)
      addBookToDom(myLibrary)
    }
    div.appendChild(title)
    div.appendChild(author)
    div.appendChild(pages)
    div.appendChild(read)
    div.appendChild(submit)

    libraryContainer.appendChild(div)
  })
}
addBookToDom(myLibrary)

addBook.addEventListener('click', () => {
  modal.classList.toggle('closed')
})

form.addEventListener('submit', e => {
  e.preventDefault()
  console.log(isRead.checked)
  addBookToLibrary(author.value, title.value, pages.value, isRead.checked)
  addBookToDom(myLibrary)
  modal.classList.toggle('closed')
  author.value = ''
  title.value = ''
  pages.value = ''
  isRead.value = 'off'
})

document.body.addEventListener('click', e => {
  console.log(e.target)
  if (e.target.classList.contains('overlay')) {
    modal.classList.toggle('closed')
  }
})
