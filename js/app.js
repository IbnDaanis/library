const container = document.querySelector('.container')
const books = document.querySelector('.books')
const form = document.querySelector('form')
const author = document.querySelector('#author')
const title = document.querySelector('#title')
const pages = document.querySelector('#pages')

let myLibrary = []

function Book(author, title, pages) {
  this.author = author
  this.title = title
  this.pages = pages
}

const addBookToLibrary = (author, title, pages) => {
  const newBook = new Book(author, title, pages)
  myLibrary.push(newBook)
  console.log(myLibrary)
}

const removeBook = title => {
  myLibrary = myLibrary.filter(book => book.title !== title)
}

const addBookToDom = library => {
  books.innerHTML = ''
  library.forEach(book => {
    const div = document.createElement('div')
    div.classList.add('card')
    const title = document.createElement('h1')
    title.textContent = book.title
    const author = document.createElement('p')
    author.textContent = book.author
    const pages = document.createElement('p')
    pages.textContent = book.pages
    const submit = document.createElement('button')
    submit.textContent = 'Add book'
    submit.onclick = () => {
      removeBook(book.title)
      addBookToDom(myLibrary)
    }
    div.appendChild(title)
    div.appendChild(author)
    div.appendChild(pages)
    div.appendChild(submit)

    books.appendChild(div)
  })
}

form.addEventListener('submit', e => {
  e.preventDefault()
  addBookToLibrary(author.value, title.value, pages.value)
  addBookToDom(myLibrary)
  author.value = ''
  title.value = ''
  pages.value = ''
})
