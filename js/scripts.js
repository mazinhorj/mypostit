console.log('MazinhoBigDaddy na área!!!');

//seletores

const notesContainer = document.querySelector('#notes_container');
const semNotas = document.querySelector('#sem_notas');
const noteInput = document.querySelector('#note_content');
const addNoteBtn = document.querySelector('.add_note');
const searchInput = document.querySelector('#search_input');
const exportBtn = document.querySelector('#export_notes')



//funcs

const showNotes = () => {
  const notes = getNotes();

  cleanNotes();

  notes.forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed, note.color);
    notesContainer.appendChild(noteElement);
  });
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

const colorBase = "#2e2e2e";

const addNote = () => {

  const notes = getNotes();

  // toggleHide();

  // constroi o obj nota
  const noteObj = {
    id: genId(),
    content: noteInput.value,
    fixed: false,
    color: "",
  };

  // chama a função passando os parâmetros
  const noteElement = createNote(noteObj.id, noteObj.content, noteObj.color);

  // atribui um elemento filho (de acordo com o que foi construído na função) ao elemento pai notesContainer
  notesContainer.appendChild(noteElement);


  notes.push(noteObj);

  saveNotes(notes);

  noteInput.value = "";
};

// gerar um número aleatório para servir como id
const genId = () => {
  return Math.floor(Math.random() * 5000);
};

const createNote = (id, content, fixed, color) => {
  //cria a div da nota
  const element = document.createElement('div');
  element.classList.add('note');
  element.style.backgroundColor = color;
  //console.log(color);


  //console.log(color);

  // cria a textarea que vai o conteudo da nota
  const textarea = document.createElement('textarea');
  textarea.value = content
  textarea.placeholder = "Adicione uma nota";
  element.appendChild(textarea);

  //cria btn pin
  const pinIcon = document.createElement('i');
  pinIcon.classList.add(...['bi', 'bi-pin']);
  pinIcon.setAttribute('aria-label', 'Fixar');
  element.appendChild(pinIcon);

  //cria btn delete
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add(...['bi', 'bi-x-lg']);
  deleteIcon.setAttribute('aria-label', 'Excluir');
  element.appendChild(deleteIcon);

  //cria btn clone
  const duplicateIcon = document.createElement('i');
  duplicateIcon.classList.add(...['bi', 'bi-file-earmark-plus']);
  duplicateIcon.setAttribute('aria-label', 'Clonar');
  element.appendChild(duplicateIcon);

  //cria btn color
  const colorIcon = document.createElement('input');
  colorIcon.setAttribute('type', 'color');
  colorIcon.setAttribute('aria-label', 'Trocar cor');
  element.appendChild(colorIcon);

  // se a nota tiver a classe fixed como true, adicone a classe correspondente
  if (fixed) {
    element.classList.add('fixed');
  }

  // evento do elemento
  element.querySelector('textarea').addEventListener('keyup', (e) => {
    const noteContent = e.target.value;
    updateNote(id, noteContent);
  })


  element.querySelector('.bi-pin').addEventListener('click', () => {
    toggleFixNote(id)
  });

  element.querySelector('.bi-x-lg').addEventListener('click', () => {
    deleteNote(id, element);
  });

  element.querySelector('.bi-file-earmark-plus').addEventListener('click', () => {
    copyNote(id);
  });

  element.querySelector('input').addEventListener('change', () => {
    const newColor = element.querySelector('input').value;
    changeColor(id, element, newColor);
  });

  semNotas.classList.add('esconde');
  return element;
};


// adiciona/retira a classe fixed
const toggleFixNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.fixed = !targetNote.fixed;
  saveNotes(notes);
  showNotes();
};

const toggleHide = () => {
  if (getNotes().length > 0) {
    semNotas.classList.toggle('esconde');
    return;
  }
};


// muda a cor da nota não fixada
const changeColor = (id, element, newColor) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  element.style.backgroundColor = newColor;
  targetNote.color = newColor;
  saveNotes(notes);
};



// local strorage

// traz as notas armazenadas
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const orderedNotes = notes.sort((a, b) => a.fixed > b.fixed ? -1 : 1)
  return orderedNotes;
};

// salva local
const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes))
};

const deleteNote = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);
  saveNotes(notes);
  notesContainer.removeChild(element)
};

const copyNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  const noteObj = {
    id: genId(),
    content: targetNote.content,
    fixed: false,
    color: colorBase,
  };
  const noteElement = createNote(noteObj.id, noteObj.content, noteObj.fixed, noteObj.color);
  notesContainer.appendChild(noteElement);
  notes.push(noteObj);
  saveNotes(notes);
};

const updateNote = (id, newContent) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.content = newContent;
  saveNotes(notes);
};

const searchNotes = (search) => {
  const searchResults = getNotes().filter((note) => note.content.includes(search)
  );
  if (search !== "") {
    cleanNotes();
    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });
    return;
  };
  cleanNotes();
  showNotes();
};

const exportData = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ].map((e) => e.join(",")).join("\n");
  const element = document.createElement('a');
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
  element.target = "_blank";
  element.download = "postits.csv";
  element.click();
}



//eventos
addNoteBtn.addEventListener('click', () => addNote());

searchInput.addEventListener('keyup', (e) => {
  const search = e.target.value;
  searchNotes(search);
});

noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addNote();
});

exportBtn.addEventListener('click', () => {
  exportData();
})




// iniciar
// toggleHide();
showNotes();

