const checkbox = document.getElementById('inputBookIsComplete');
const bookSubmit = document.getElementById('bookSubmit');
bookSubmit.setAttribute('class','btn btn-success');
const modalElement = document.getElementById('confirmToDelete');
function modalDisplay(bool){
	if(bool){
		modalElement.style.display = "block";
		document.body.style.overflow = "hidden";
	} 
	else {
		modalElement.style.display = "none";
		document.body.style.overflow = "visible";
	}
};

const book_id = document.getElementById('book_id');
const book_title = document.getElementById('book_title');
const book_author = document.getElementById('book_author');
const book_year = document.getElementById('book_year');
function setBookDetailInnerText (id, title, author, year){
	book_id.innerText = ':'+id;
	book_title.innerText = ':'+title;
	book_author.innerText = ':'+author;
	book_year.innerText = ':'+year;
}

const modalElementContent = document.querySelector('.modal-content');
const closeModalBtn = document.getElementById('closeModal');
const trashButton = document.createElement('button');
trashButton.classList.add('trash-button');
trashButton.innerText="Ya, saya ingin menghapus buku";
trashButton.classList.add('btn');
trashButton.classList.add('btn-danger');
modalElementContent.append(trashButton);
checkbox.addEventListener('change', function() {
	
	if(this.checked) { 
		this.value=true;
		bookSubmit.innerHTML="Masukkan Buku ke rak <span>Sudah selesai dibaca</span>";
	}
	else
	{ 
		this.value=false;
		bookSubmit.innerHTML="Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
		bookSubmit.classList.add('btn');
		bookSubmit.classList.add('btn-success');
	}
});

document.addEventListener('DOMContentLoaded', function () {
	const submitForm = document.getElementById('inputBook');
	submitForm.addEventListener('submit', function (event) {
		event.preventDefault();
		addBook();
	});
	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

function addBook() {
	const title = document.getElementById('inputBookTitle').value;
	const author = document.getElementById('inputBookAuthor').value;
	const year = document.getElementById('inputBookYear').value;
	const isComplete = JSON.parse(document.getElementById('inputBookIsComplete').value);
	const generatedID = generateId();
	const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
	books.push(bookObject);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function generateId() {
	return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete
	}
}

const books = [];
const RENDER_EVENT = 'render-book';
document.addEventListener(RENDER_EVENT, function(){
	const uncompletedBookList = document.getElementById('incompleteBookshelfList');
	uncompletedBookList.innerHTML = '';
	const completedBookList = document.getElementById('completeBookshelfList');
	completedBookList.innerHTML = '';
	for (const bookItem of books) {
		const bookElement = makeBook(bookItem);
		if (bookItem.isComplete) {
			completedBookList.append(bookElement);
			}else{
			uncompletedBookList.append(bookElement);
		}
	}
});

function makeBook(bookObject) {
	const editButton1 = document.createElement('button');
	const editButton2 = document.createElement('button');
	const editButton3 = document.createElement('button');
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;
    textTitle.classList.add('bookTitle');
	textTitle.classList.add('book-info');
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;
    textAuthor.classList.add('author');
	textAuthor.classList.add('book-info');
    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
    textYear.classList.add('year');
	textYear.classList.add('book-info');
	editButton1.classList.add('edit-title');
	editButton2.classList.add('edit-author');
	editButton3.classList.add('edit-year');
	editButton1.style.display = 'none';
	editButton2.style.display = 'none';
	editButton3.style.display = 'none';
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle,editButton1, textAuthor, editButton2, textYear, editButton3);
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
    const confirmTrashButton = document.createElement('button');
    confirmTrashButton.classList.add('confirm-trash-button', 'btn', 'btn-danger');
    confirmTrashButton.innerText = "Hapus Buku";
    confirmTrashButton.onclick = () => {
        modalDisplay(true);
        setBookDetailInnerText(bookObject.id, bookObject.title, bookObject.author, bookObject.year);
	};
	
    closeModalBtn.onclick = () => modalDisplay(false);
    window.onclick = event => {
        if (event.target == modalElement) {
            modalDisplay(false);
		}
	};
	
    trashButton.onclick = () => { 
		removeBook(bookObject.id); 
		modalDisplay(false); 
	};
	
    const markButton = document.createElement('button');
    markButton.classList.add('mark-button', 'btn', 'btn-success');
	textTitle.onmouseover = () => {
		editButton1.style.display = 'inline';
		editButton1.style.position = 'relative'; 
		editButton1.style.paddingTop = '10px';
		editButton1.style.left = '10px';
		textTitle.appendChild(editButton1); 
	};
	
	textTitle.onmouseout = () => editButton1.style.display = 'none';
	
	textAuthor.onmouseover = () => {
		editButton2.style.display = 'inline';
		editButton2.style.position = 'relative';
		editButton2.style.paddingTop = '10px';
		editButton2.style.left = '10px';
		textAuthor.appendChild(editButton2);
	};
	
	textAuthor.onmouseout = () => editButton2.style.display = 'none';
	
	textYear.onmouseover = () => {
		editButton3.style.display = 'inline';
		editButton3.style.position = 'relative';
		editButton3.style.paddingTop = '10px';
		editButton3.style.left = '10px';
		textYear.appendChild(editButton3);
	};
	
	textYear.onmouseout = () => editButton3.style.display = 'none';
	
	editButton1.addEventListener('click', () => {
		const newTitle = prompt('Masukkan judul:');
		if (newTitle !== null && newTitle.trim() !== '') {
			bookObject.title = newTitle.trim();
			saveData();
			document.dispatchEvent(new Event(RENDER_EVENT));
		}
	});
	
	editButton2.addEventListener('click', () => {
		const newAuthor = prompt('Masukkan penulis:');
		if (newAuthor !== null && newAuthor.trim() !== '') {
			bookObject.author = newAuthor.trim();
			saveData();
			document.dispatchEvent(new Event(RENDER_EVENT));
		}
	});
	
	editButton3.addEventListener('click', () => {
		const newTahun = prompt('Masukkan tahun:');
		if (newTahun !== null && newTahun.trim() !== '') {
			bookObject.year = newTahun.trim();
			saveData();
			document.dispatchEvent(new Event(RENDER_EVENT));
		}
	});
	
    if (bookObject.isComplete) {
        markButton.innerText = "Tandai sebagai belum dibaca";
        markButton.addEventListener('click', () => {
            addBookAsUncompleted(bookObject.id);
            highlightElement(document.getElementById(`book-${bookObject.id}`));
		});
		} else {
        markButton.innerText = "Tandai sebagai telah dibaca";
        markButton.addEventListener('click', () => {
            addBookAsCompleted(bookObject.id);
            highlightElement(document.getElementById(`book-${bookObject.id}`));
		});
	}
	
    container.append(textContainer, confirmTrashButton, markButton);
    return container;
}

function highlightElement(element) {
	element.classList.add('highlight');
	setTimeout(function() {
		element.classList.remove('highlight');
	}, 1000);
}

function addBookAsCompleted (bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget == null) return;
	bookTarget.isComplete = true;
	saveData();
	document.dispatchEvent(new Event(RENDER_EVENT));
}
function addBookAsUncompleted (bookId) {
	const bookTarget = findBook(bookId);
	if (bookTarget == null) return;
	bookTarget.isComplete = false;
	saveData();
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
	for (const bookItem of books) {
		if (bookItem.id === bookId) {
			return bookItem;
		}
	}
	return null;
}

function removeBook(bookId) {
	const bookTarget = findBookIndex(bookId);
	if (bookTarget === -1) return;
	books.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
}

function findBookIndex(bookId) {
	for (const index in books) {
		if (books[index].id === bookId) {
			return index;
		}
	}
	return -1;
}

function saveData() {
	if (isStorageExist()) {
		
		books.forEach(book => {
			book.year = parseInt(book.year);
		});
		
		const parsed = JSON.stringify(books);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
function isStorageExist()  {
	if (typeof (Storage) === undefined) {
		alert('Browser kamu tidak mendukung local storage');
		return false;
	}
	return true;
}

document.addEventListener(SAVED_EVENT, function () {
	console.log(localStorage.getItem(STORAGE_KEY));
});
if (isStorageExist()) {
	loadDataFromStorage();
}
function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData) || [];
	data.forEach(book => {
        if (!isBookInArray(book)) {
			books.push(book);
		}
	});
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function isBookInArray(book) {
	return books.some(existingBook => existingBook.id === book.id);
}

const searchInput = document.getElementById('searchBook');
const defaultBackgroundColor = ''; 
searchInput.addEventListener('input', function() {
	const query = this.value.trim(); 
	if (query !== '') {
        highlightMatchingElements(query);
		} else {
        resetBackgroundColors(); 
	}
});

function scrollToTargetElement(targetElement) {
	if (targetElement) {
		let offset = 100;
		let elementPosition = targetElement.offsetTop - offset;
        window.scrollTo({
			top: elementPosition,
			behavior: "smooth"
		});
	}
}

const bookCats = ["all","bookTitle", "author", "year"];
const bookCatsID = ["Semua", "Judul Buku", "Penulis", "Tahun"]
const selectList = document.getElementById("filterSelect");
for (let i = 0; i < bookCats.length; i++) {
let option = document.createElement("option");
option.value = bookCats[i]; 
option.text = bookCatsID[i]; 
option.classList.add('dropdown-content');
selectList.appendChild(option); 
}

function highlightMatchingElements(query) {
let elements;
if(selectList.value == 'all'){
elements = document.querySelectorAll("[id^='book-'] .inner");
} else {
elements = document.querySelectorAll(`[id^='book-']>.inner>.${selectList.value}`);
}

for (let i = 0; i < elements.length; i++) {
let element = elements[i];
if (element.innerText.toLowerCase().includes(query.toLowerCase())) {
element.style.backgroundColor = '#00008B'; 
scrollToTargetElement(elements[0]);
} else {
element.style.backgroundColor = defaultBackgroundColor; 
}
}
}

function resetBackgroundColors() {
const elements = document.querySelectorAll("[id^='book-'] .inner");
elements.forEach(function(element) {
element.style.backgroundColor = defaultBackgroundColor; 
});
}		