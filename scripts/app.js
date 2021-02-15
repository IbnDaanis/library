const firebaseAuth = (() => {
  const signInBtn = document.querySelector('#signIn')
  const signOutBtn = document.querySelector('#signOut')
  const addBookBtn = document.querySelector('#addBook')
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
      addBookBtn.style.display = 'block'
      DOM_EVENTS.loadLibrary()
    } else {
      signOutBtn.style.display = 'none'
      signInBtn.style.display = 'block'
      addBookBtn.style.display = 'none'
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
  addBookToLibrary = book => {
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('library')
      .add(book)
      .catch(err => console.error('Error adding book to database. ', err))
  }
  removeBook = id => {
    this.library = this.library.filter(book => book.id !== id)
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('library')
      .doc(id)
      .delete()
  }
  toggleIsRead = id => {
    this.library = this.library.map(book => {
      if (book.id === id) {
        const isRead = book.isRead
        db.collection('users')
          .doc(firebase.auth().currentUser.uid)
          .collection('library')
          .doc(id)
          .update({ isRead: !isRead })

        book.isRead = !book.isRead
      }
      return book
    })
    console.log(this.library)
  }
}

class Book {
  constructor(author, title, pages, isRead) {
    this.author = author
    this.title = title
    this.pages = pages
    this.isRead = isRead
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

  let myLibrary = new Library([])

  const _addBooksToDom = library => {
    libraryContainer.innerHTML = ''
    myLibrary.library.forEach(book => {
      const bookElement = bookContainer(book)
      libraryContainer.appendChild(bookElement)
    })
    libraryContainer.onclick = ({ target }) => {
      if (target.dataset.delete) {
        library.removeBook(target.parentElement.dataset.id)
      } else if (target.dataset.isRead) {
        library.toggleIsRead(target.dataset.id)
      }
    }
  }

  const loadLibrary = () => {
    const query = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('library')

    query.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (['modified', 'removed'].includes(change.type)) {
          return _addBooksToDom(myLibrary)
        }
        const document = change.doc.data()
        myLibrary.library.push({ id: change.doc.id, ...document })
      })
      _addBooksToDom(myLibrary)
      console.log(myLibrary.library)
    })
  }

  const clearLibrary = () => {
    libraryContainer.innerHTML = ''
    myLibrary = new Library([])
  }

  const _resetForm = () => {
    author.value = ''
    title.value = ''
    pages.value = ''
    isRead.checked = false
  }

  const addBookToLibraryForm = () => {
    const newBook = new Book(
      author.value,
      title.value,
      pages.value,
      isRead.checked
    )
    console.log({ ...newBook })
    myLibrary.addBookToLibrary({ ...newBook })
    modal.classList.toggle('closed')
  }

  addBook.onclick = () => modal.classList.toggle('closed')

  form.onsubmit = e => {
    e.preventDefault()
    addBookToLibraryForm()
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
}

signOutBtn.onclick = async () => {
  await signOut()
  console.log('Signed Out')
}
