let books = JSON.parse(localStorage.getItem("books")) || [];

function save() {
  localStorage.setItem("books", JSON.stringify(books));
}

function addBook() {
  const nazev = nazevInput.value.trim();
  const autor = autorInput.value.trim();
  const rok = rokInput.value;

  if (!nazev || !autor || !rok) return alert("Vyplň všechna pole");

  books.push({ nazev, autor, rok: Number(rok) });
  save();
  clearForm();
  render(books);
}

function deleteBook(index) {
  books.splice(index, 1);
  save();
  render(books);
}

function clearForm() {
  nazevInput.value = "";
  autorInput.value = "";
  rokInput.value = "";
}

function render(list) {
  const ul = document.getElementById("list");
  ul.innerHTML = "";

  list.forEach((b, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="book-info">
        <strong>${b.nazev}</strong><br>
        ${b.autor} (${b.rok})
      </div>
      <button class="delete" onclick="deleteBook(${i})">✕</button>
    `;
    ul.appendChild(li);
  });
}

function searchBooks() {
  const text = search.value.toLowerCase();
  render(
    books.filter(b =>
      b.nazev.toLowerCase().includes(text) ||
      b.autor.toLowerCase().includes(text)
    )
  );
}

function sortBooks() {
  const type = sort.value;

  if (type === "nazev")
    books.sort((a,b) => a.nazev.localeCompare(b.nazev));

  if (type === "autor")
    books.sort((a,b) => a.autor.localeCompare(b.autor));

  if (type === "rok")
    books.sort((a,b) => a.rok - b.rok);

  save();
  render(books);
}

const nazevInput = document.getElementById("nazev");
const autorInput = document.getElementById("autor");
const rokInput = document.getElementById("rok");
const search = document.getElementById("search");
const sort = document.getElementById("sort");

render(books);
