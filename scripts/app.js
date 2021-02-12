class Library {
  constructor(library) {
    this.library = library
  }
  addBookToDom = (library = this.library) => {
    const libraryContainer = document.querySelector('#libraryContainer')
    libraryContainer.innerHTML = ''
    library.forEach(book => {
      const bookElement = bookContainer(
        book,
        this.toggleIsRead,
        this.removeBook
      )
      libraryContainer.appendChild(bookElement)
    })
  }
  saveLibrary = () => {
    localStorage.setItem('myLibrary', JSON.stringify(this.library))
  }
  addBookToLibrary = book => {
    this.library.push(book)
    this.saveLibrary()
    this.addBookToDom()
  }
  removeBook = id => {
    this.library = this.library.filter(book => book.id !== id)
    this.saveLibrary()
    this.addBookToDom()
  }
  toggleIsRead = item => {
    item.isRead = !item.isRead
    this.saveLibrary()
    this.addBookToDom()
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

  const libraryArr = localStorage.getItem('myLibrary')
    ? JSON.parse(localStorage.getItem('myLibrary'))
    : []

  const myLibrary = new Library(libraryArr)
  myLibrary.addBookToDom()

  const _resetForm = () => {
    author.value = ''
    title.value = ''
    pages.value = ''
    isRead.checked = false
  }

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
    _resetForm()
  }

  document.body.onclick = ({ target }) => {
    if (target.classList.contains('overlay')) {
      modal.classList.toggle('closed')
    }
  }
})()
