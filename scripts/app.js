// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut()
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver)
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser
}

class Library {
  constructor(library) {
    this.library = library
  }
  addBookToDom = (library = this.library) => {
    const libraryContainer = document.querySelector('#libraryContainer')
    libraryContainer.innerHTML = ''
    library.forEach(book => {
      const bookElement = bookContainer(book)
      libraryContainer.appendChild(bookElement)
    })
    libraryContainer.onclick = ({ target }) => {
      if (target.dataset.delete) {
        this.removeBook(target.parentElement.dataset.id)
      } else if (target.dataset.isRead) {
        this.toggleIsRead(target.dataset.id)
      }
    }
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
  toggleIsRead = id => {
    this.library = this.library.map(book => {
      book.id === id && (book.isRead = !book.isRead)
      return book
    })
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
