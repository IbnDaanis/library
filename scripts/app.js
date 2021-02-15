const firebaseAuth = (() => {
  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log('Signed in. ', result.credential)
      })
      .catch(error => {
        const errorMessage = error.message
        console.log({ errorMessage })
      })
  }

  const signOut = () => {
    return firebase.auth().signOut()
  }

  let unsubscribe = () => {}
  const authStateObserver = user => {
    if (user) {
      const query = firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('library')

      unsubscribe = query.onSnapshot(snapshot =>
        DOM_EVENTS.loadLibrary(snapshot)
      )
    } else {
      unsubscribe()
      DOM_EVENTS.clearLibrary()
      console.log('Signed out.')
    }
  }

  const initFirebaseAuth = () => {
    firebase.auth().onAuthStateChanged(authStateObserver)
  }

  return {
    signIn,
    signOut,
    initFirebaseAuth,
  }
})()
const { signIn, signOut, initFirebaseAuth } = firebaseAuth

class Library {
  constructor(library) {
    this.library = library
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
  const signInBtn = document.querySelector('#signIn')
  const signOutBtn = document.querySelector('#signOut')
  const addBookBtn = document.querySelector('#addBook')
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

  const loadLibrary = snapshot => {
    snapshot.docChanges().forEach(change => {
      if (['modified', 'removed'].includes(change.type)) {
        _addBooksToDom(myLibrary)
      } else {
        const document = change.doc.data()
        myLibrary.library.push({ id: change.doc.id, ...document })
        _addBooksToDom(myLibrary)
      }
    })
    console.log(myLibrary.library)
    signInBtn.style.display = 'none'
    signOutBtn.style.display = 'block'
    addBookBtn.style.display = 'block'
  }

  const clearLibrary = () => {
    libraryContainer.innerHTML = ''
    signOutBtn.style.display = 'none'
    signInBtn.style.display = 'block'
    addBookBtn.style.display = 'none'
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
}
