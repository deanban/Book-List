//book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: handle ui tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
            <a href="#" class="btn btn-danger btn-sm delete">X</a>
        </td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
    const alert = document.querySelector(".alert-danger");
    alert && alert.remove();
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    //insert the div before the form
    container.insertBefore(div, form);
    //vanish in 5 secs
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}
//store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, i) => {
      if (book.isbn === isbn) {
        books.splice(i, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//event: add book
// It seems that document.querySelector("#book-form")
// is returning null because it executes before the DOM fully loads.
//using window.onload it seems to be fixed

document.querySelector("#book-form").addEventListener("submit", e => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);
    // console.log(book);

    //add book to UI
    UI.addBookToList(book);
    //add book to store
    Store.addBook(book);

    //clear fields
    UI.clearFields();
    UI.showAlert("Success", "success");
  }
});

//event: remove book
//use event propagation
document.querySelector("#book-list").addEventListener("click", e => {
  const bookToDelete = e.target;

  //remove book from UI
  UI.deleteBook(bookToDelete);

  //remove book from Store
  Store.removeBook(bookToDelete.parentElement.previousElementSibling.innerText);
  UI.showAlert("Book Removed", "success");
});
