class Library {
  constructor(library) {
    this.library = library
  }
  addBookToLibrary = book => {
    this.library.push(book)
    localStorage.setItem('myLibrary', JSON.stringify(this.library))
  }
  removeBook = id => {
    this.library = this.library.filter(book => book.id !== id)
    localStorage.setItem('myLibrary', JSON.stringify(this.library))
  }
  toggleIsRead = item => {
    item.isRead = !item.isRead
    localStorage.setItem('myLibrary', JSON.stringify(this.library))
    addBookToDom()
  }
  addBookToDom = (library = this.library) => {
    const libraryContainer = document.querySelector('#libraryContainer')
    libraryContainer.innerHTML = ''
    library.forEach(book => {
      const element = bookContainer(book)
      element.querySelector('input').onchange = () => {
        book.isRead = !book.isRead
        localStorage.setItem('myLibrary', JSON.stringify(this.library))
        this.addBookToDom(this.library)
      }
      libraryContainer.appendChild(element)
    })
  }
}

class Book {
  constructor(author, title, pages, isRead) {
    this.author = author
    this.title = title
    this.pages = pages
    this.isRead = isRead
    this.id = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase()
  }
}

const DOM_EVENTS = (() => {
  const form = document.querySelector('form')
  const modal = document.querySelector('.modal')
  const pages = document.querySelector('#pages')
  const title = document.querySelector('#title')
  const author = document.querySelector('#author')
  const isRead = document.querySelector('#isRead')
  const addBook = document.querySelector('#addBook')
  const addABookHere = document.querySelector('#addABookHere')

  const libraryArr = localStorage.getItem('myLibrary')
    ? JSON.parse(localStorage.getItem('myLibrary'))
    : []

  const myLibrary = new Library(libraryArr)
  myLibrary.addBookToDom()

  addBook.onclick = () => modal.classList.toggle('closed')

  form.onsubmit = e => {
    e.preventDefault()
    const newBook = new Book(
      author.value,
      title.value,
      pages.value,
      isRead.checked
    )
    myLibrary.addBookToLibrary(newBook)
    myLibrary.addBookToDom(myLibrary.library)
    modal.classList.toggle('closed')
    author.value = ''
    title.value = ''
    pages.value = ''
    isRead.checked = false
  }

  document.body.onclick = ({ target }) => {
    if (target.classList.contains('overlay')) {
      modal.classList.toggle('closed')
    }
  }
})()
