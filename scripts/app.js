const firebaseAuth = (() => {
  const signInBtn = document.querySelector('#signIn')
  const signOutBtn = document.querySelector('#signOut')
  const signIn = () => {
    // Sign into Firebase using popup auth & Google as the identity provider.
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const credential = result.credential
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = error.credential
        console.log({ errorMessage })
      })
  }

  const signOut = () => {
    return firebase.auth().signOut()
  }

  const authStateObserver = user => {
    if (user) {
      const profilePicUrl = getProfilePicUrl()
      const userName = getUserName()
      signInBtn.style.display = 'none'
      signOutBtn.style.display = 'block'
      DOM_EVENTS.loadLibrary()
    } else {
      signOutBtn.style.display = 'none'
      signInBtn.style.display = 'block'
      DOM_EVENTS.clearLibrary()
    }
  }

  const initFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(authStateObserver)
  }

  const getProfilePicUrl = () => {
    return firebase.auth().currentUser.photoURL
  }

  const getUserName = () => {
    return firebase.auth().currentUser.displayName
  }

  // Returns true if a user is signed-in.
  const isUserSignedIn = () => {
    return !!firebase.auth().currentUser
  }
  return {
    signIn,
    signOut,
    getUserName,
    isUserSignedIn,
    initFirebaseAuth,
  }
})()
const {
  signIn,
  signOut,
  getUserName,
  isUserSignedIn,
  initFirebaseAuth,
} = firebaseAuth

class Library {
  constructor(library) {
    this.library = library
  }
  addBookToDom = () => {
    DOM_EVENTS.loadLibrary()
  }
  saveLibrary = () => {
    localStorage.setItem('myLibrary', JSON.stringify(this.library))
    const library = this.library.reduce((obj, item, index) => {
      obj[index] = item
      return obj
    }, {})
    const saveMessage = item => {
      return firebase
        .firestore()
        .collection(firebase.auth().currentUser.uid)
        .doc('library')
        .set(item)
        .catch(function (error) {
          console.error('Error writing new message to database', error)
        })
    }
    saveMessage(library)
    console.log(library, this.library)
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
  const libraryContainer = document.querySelector('#libraryContainer')

  const libraryArr = localStorage.getItem('myLibrary')
    ? JSON.parse(localStorage.getItem('myLibrary'))
    : []

  const loadLibrary = () => {
    const query = firebase
      .firestore()
      .collection(firebase.auth().currentUser.uid)

    query.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log(change)
        if (change.type === 'removed') {
          console.log(change)
        } else {
          const documents = change.doc.data()
          const myLibrary = new Library(Object.values(documents))

          libraryContainer.innerHTML = ''
          myLibrary.library.forEach(book => {
            const bookElement = bookContainer(book)
            libraryContainer.appendChild(bookElement)
          })
          libraryContainer.onclick = ({ target }) => {
            if (target.dataset.delete) {
              myLibrary.removeBook(target.parentElement.dataset.id)
            } else if (target.dataset.isRead) {
              myLibrary.toggleIsRead(target.dataset.id)
            }
          }
          console.log(myLibrary.library)
        }
      })
    })
  }

  const clearLibrary = () => {
    libraryContainer.innerHTML = ''
  }

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

  return {
    loadLibrary,
    clearLibrary,
  }
})()

initFirebaseAuth()

const signInBtn = document.querySelector('#signIn')
const signOutBtn = document.querySelector('#signOut')

signInBtn.onclick = async () => {
  await signIn()
  console.log(firebase.auth().currentUser.uid)
}

signOutBtn.onclick = async () => {
  await signOut()
  console.log('Signed Out')
}
