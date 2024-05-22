const wrapper = document.querySelector('.wrapper');
const backBtn = document.querySelector('.back-btn');
const menuBtn = document.querySelector('.menu-btn');

const toggleScreen = () => {
  wrapper.classList.toggle('show-category');
};

menuBtn.addEventListener('click', toggleScreen);
backBtn.addEventListener('click', toggleScreen);

const addTaskBtn = document.querySelector('.add-task-btn');
const addTaskForm = document.querySelector('.add-task');
const blackBackDrop = document.querySelector('.black-backdrop');

const toggleAddTaskForm = () => {
  addTaskForm.classList.toggle('active');
  blackBackDrop.classList.toggle('active');
  addTaskBtn.classList.toggle('active');
};

addTaskBtn.addEventListener('click', toggleAddTaskForm);
blackBackDrop.addEventListener('click', toggleAddTaskForm);

let categories = [
  {
    title: '',
    img: '',
  },
];

let tasks = [
  {
    id: 1,
    task: '',
    category: '',
    completed: '',
  },
];
