console.log('MazinhoBigDaddy na área!!!');

//seletores

const notesContainer = document.querySelector('#notes_container');
const noteInput = document.querySelector('#note_content');
const addNoteBtn = document.querySelector('.add_note');



//funcs

const showNotes = () => {
  const notes = getNotes();
  console.log(notes);
  
  cleanNotes();
  
  notes.forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteElement);
  });

};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};


const addNote = () => {

  const notes = getNotes();

  

  // constroi o obj nota
  const noteObj = {
    id: genId(),
    content: noteInput.value,
    fixed: false,
    color: "red",
  };

  // chama a função passando os parâmetros
  const noteElement = createNote(noteObj.id, noteObj.content);

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

  // cria a textarea que vai o conteudo da nota
  const textarea = document.createElement('textarea');
  textarea.value = content
  textarea.placeholder = "Adicione uma nota";
  element.appendChild(textarea);

  //cria btn pin
  const pinIcon = document.createElement('i');
  pinIcon.classList.add(...['bi', 'bi-pin']);
  pinIcon.setAttribute('aria-label', 'Fixar Nota');
  element.appendChild(pinIcon);

  //cria btn delete
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add(...['bi', 'bi-x-lg']);
  element.appendChild(deleteIcon);

  //cria btn clone
  const duplicateIcon = document.createElement('i');
  duplicateIcon.classList.add(...['bi', 'bi-file-earmark-plus']);
  element.appendChild(duplicateIcon);
  
  //cria btn color
  const colorIcon = document.createElement('input');
  colorIcon.setAttribute('type', 'color');
  element.appendChild(colorIcon);

  // se a nota tiver a classe fixed como true, adicone a classe correspondente
  if (fixed) {
    element.classList.add('fixed');
  }

  // evento do elemento
  element.querySelector('.bi-pin').addEventListener('click', () => {
    toggleFixNote(id)
  });

  element.querySelector('.bi-x-lg').addEventListener('click', () => {
    deleteNote(id, element);
  });
  

  // cor
  // const color = element.querySelector('input');
  // const newColor = color.value
  // color.addEventListener('click', () => {

  //   console.log(newColor);
  // });


  return element;
};


// adiciona/retira a classe fixed
const toggleFixNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];
  targetNote.fixed = !targetNote.fixed;
  saveNotes(notes);
  showNotes();
  console.log(notes);
};

// muda a cor da nota não fixada
const chanceColor = () => {

}

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




//eventos
addNoteBtn.addEventListener('click', () => addNote())


// iniciar
showNotes();

