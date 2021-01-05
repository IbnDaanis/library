const container = document.querySelector('.container')
const libraryContainer = document.querySelector('#libraryContainer')
const addBook = document.querySelector('#addBook')
const modal = document.querySelector('.modal')
const form = document.querySelector('form')
const author = document.querySelector('#author')
const title = document.querySelector('#title')
const pages = document.querySelector('#pages')
const isRead = document.querySelector('#isRead')
const addABookHere = document.querySelector('#addABookHere')

setTimeout(() => {
  addABookHere.style.opacity = '0'
}, 8000)

let myLibrary = localStorage.getItem('myLibrary')
  ? JSON.parse(localStorage.getItem('myLibrary'))
  : []
if (myLibrary.length > 1) addABookHere.style.display = ' none'

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
    book.isRead && div.classList.add('read')
    div.setAttribute('data-id', book.id)
    const title = document.createElement('h2')
    title.textContent = book.title
    const author = document.createElement('p')
    author.textContent = `Author: ${book.author}`
    const pages = document.createElement('p')
    pages.textContent = `Pages: ${book.pages}`
    const read = document.createElement('p')
    read.textContent = `${book.isRead ? 'Read' : 'Not read'}`
    const toggleRead = document.createElement('p')
    toggleRead.classList.add('toggle-read')
    toggleRead.style.opacity = '0'
    toggleRead.textContent = `Click to ${
      book.isRead ? 'mark as unread' : 'mark as read'
    }`
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
    div.appendChild(toggleRead)
    div.onclick = () => {
      book.isRead = !book.isRead
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
      addBookToDom(myLibrary)
    }
    libraryContainer.appendChild(div)
  })
}
addBookToDom(myLibrary)

addBook.addEventListener('click', () => {
  modal.classList.toggle('closed')
})

form.addEventListener('submit', e => {
  e.preventDefault()
  addBookToLibrary(author.value, title.value, pages.value, isRead.checked)
  addBookToDom(myLibrary)
  modal.classList.toggle('closed')
  author.value = ''
  title.value = ''
  pages.value = ''
  isRead.value = 'off'
})

document.body.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) {
    modal.classList.toggle('closed')
  }
})
