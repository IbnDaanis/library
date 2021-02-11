const bookContainer = book => {
  stringToHTML(
    `<div class="book-item" data-id="KKDY8O0ECE0HP">
      <h2>The One</h2>
      <p>Author: The One</p>
      <p>Pages: 234</p>
      <p>Not read</p>
      <button>X</button>
      <div class="is-read toggle-read">
        <label class="toggle">Book read?
        <input type="checkbox" id="thisIsReadKKDY8O0ECE0HP" class="is-read-checkbox">
        <span class="toggle__fill"></span>
        </label>
      </div>
  </div>`
  )
}
