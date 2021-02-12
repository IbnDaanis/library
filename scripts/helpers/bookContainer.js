const bookContainer = book => {
  const element = stringToHTML(
    `<div class="book-item ${book.isRead && 'read'}" data-id="${book.id}">
      <h2>${book.title}</h2>
      <p>Author: ${book.author}</p>
      <p>Pages: ${book.pages}</p>
      <p>${book.isRead ? 'Read' : 'Not read'}</p>
      <button data-delete="true">X</button>
      <div class="is-read toggle-read">
        <label class="toggle">Book read?
        <input type="checkbox" data-is-read="true" data-id="${
          book.id
        }" class="is-read-checkbox" ${book.isRead && 'checked'}>
        <span class="toggle__fill"></span>
        </label>
      </div>
    </div>`
  )

  return element
}
