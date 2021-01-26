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
      const removeBookButton = document.createElement('button')
      removeBookButton.textContent = 'X'
      removeBookButton.onclick = () => {
        this.removeBook(book.id)
        this.addBookToDom(this.library)
      }
      const isRead = document.createElement('div')
      isRead.classList.add('is-read', 'toggle-read')
      const toggle = document.createElement('label')
      toggle.textContent = 'Book read?'
      toggle.for = `thisIsRead${book.id}`
      toggle.classList.add('toggle')
      isRead.appendChild(toggle)
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `thisIsRead${book.id}`
      checkbox.classList.add('is-read-checkbox')
      checkbox.onchange = () => {
        book.isRead = !book.isRead
        localStorage.setItem('myLibrary', JSON.stringify(this.library))
        this.addBookToDom(this.library)
      }
      checkbox.checked = book.isRead
      toggle.appendChild(checkbox)
      const toggleFill = document.createElement('span')
      toggleFill.classList.add('toggle__fill')
      toggle.appendChild(toggleFill)
      div.appendChild(title)
      div.appendChild(author)
      div.appendChild(pages)
      div.appendChild(read)
      div.appendChild(removeBookButton)
      div.appendChild(isRead)
      libraryContainer.appendChild(div)
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

  if (libraryArr && libraryArr.length > 1) addABookHere.style.display = ' none'

  setTimeout(() => {
    addABookHere.style.opacity = '0'
  }, 8000)

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
