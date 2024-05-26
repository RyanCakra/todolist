document.addEventListener('DOMContentLoaded', function () {
  // Fungsi untuk memperbarui waktu
  function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentTime = now.toLocaleString('en-US', options);
    document.getElementById('current-time').textContent = currentTime;
  }

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

  // list array data
  let categories = [
    {
      title: 'Personal Priority',
      img: '/assets/img/personal.png',
    },
    {
      title: 'Sport',
      img: '/assets/img/sport.png',
    },
    {
      title: 'Health',
      img: '/assets/img/health.png',
    },
    {
      title: 'Movie',
      img: '/assets/img/movie.png',
    },
    {
      title: 'Books',
      img: '/assets/img/diary.png',
    },
  ];

  let tasks = [];

  let priorities = ['low', 'medium', 'high'];

  let date = new Date();

  let selectedCategory = categories[0];

  const categoriesContainer = document.querySelector('.categories');
  const categoryTitle = document.querySelector('.category-title');
  const totalCategoryTasks = document.querySelector('.category-tasks');
  const categoryImg = document.querySelector('#category-img');
  const totalTasks = document.querySelector('.totalTasks');

  //fungsi untuk mengkalkulasi total task
  const calculateTotal = () => {
    const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase());

    totalCategoryTasks.innerHTML = `${categoryTasks.length} Tasks`;
    totalTasks.innerHTML = tasks.length;
  };

  //fungsi untuk merender category
  const renderCategories = () => {
    categoriesContainer.innerHTML = '';
    categories.forEach((category) => {
      // mencari dan mendapatkan tasks dari kategori sekarang
      const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === category.title.toLowerCase());

      // membuat div ke render kategori
      const div = document.createElement('div');
      div.classList.add('category');
      div.addEventListener('click', () => {
        wrapper.classList.add('show-category');
        selectedCategory = category;
        categoryTitle.innerHTML = category.title;
        categoryImg.src = `${category.img}`;
        calculateTotal();
        // render ulang task ketika category change
        renderTasks();
      });
      div.innerHTML = `<div class="left">
      <img src="${category.img}" alt="${category.title}" />
      <div class="content">
        <h1>${category.title}</h1>
        <p>${categoryTasks.length} Tasks</p>
      </div>
    </div>
    <div class="options">
      <div class="toogle-btn">
        <svg fill="#000000" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Glyph" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z" id="XMLID_294_"></path>
            <path d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z" id="XMLID_295_"></path>
            <path d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z" id="XMLID_297_"></path>
          </g>
        </svg>
      </div>
    </div>`;

      categoriesContainer.appendChild(div);
    });
  };

  const tasksContainer = document.querySelector('.tasks');

  const renderTasks = () => {
    tasksContainer.innerHTML = '';
    const categoryTasks = tasks.filter((task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase());

    // Jika tidak ada task untuk kategori yang dipilih
    if (categoryTasks.length === 0) {
      tasksContainer.innerHTML = `<p class="no-task">No tasks for this category</p>`;
    } else {
      categoryTasks.forEach((task) => {
        const div = document.createElement('div');
        div.classList.add('task-wrapper');

        const label = document.createElement('label');
        label.classList.add('task');
        label.setAttribute('for', task.id);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task.id;
        checkbox.checked = task.completed;

        // menambahkan fungsi complete ke dalam checkbox
        checkbox.addEventListener('change', () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          // mengubah true menjadi false ataupun sebaliknya
          tasks[index].completed = !tasks[index].completed;
          // mengupdate currentDateTime jika checkbox completed
          if (tasks[index].completed) {
            updateCurrentDateTime(task.id);
            renderListDone(task);
            categoryTasks.splice(categoryTasks.indexOf(task), 1);
          } else {
            delete tasks[index].completedAt;
            saveLocal();
          }

          // Render ulang tugas
          renderTasks();
          renderListDone();
        });

        div.innerHTML = `
                <div class="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                        />
                    </svg>
                </div>
            `;

        label.innerHTML = `
                <span class="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                </span>
                <p>${task.task} (<span id="priority">${task.priority}</span>)</p>
            `;

        // Menambahkan elemen deadline hanya jika tersedia
        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          const now = new Date();
          const deadlineText = document.createElement('p');
          deadlineText.textContent = `Deadline: ${deadlineDate.toLocaleDateString('en-US')}`;

          // Jika deadline sudah lewat, tambahkan teks "Overdue" dan ubah warna teks menjadi merah
          if (deadlineDate <= now) {
            deadlineText.style.color = 'red';
            deadlineText.appendChild(document.createTextNode(' (Overdue)'));
          }

          label.appendChild(deadlineText);
        }

        label.prepend(checkbox);
        div.prepend(label);
        tasksContainer.appendChild(div);

        // fungsi delete
        const deleteBtn = div.querySelector('.delete');
        deleteBtn.addEventListener('click', () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          // remove the clicked tasks
          tasks.splice(index, 1);
          saveLocal();
          renderTasks();
          renderListDone();
        });
      });

      renderCategories();
      calculateTotal();
    }
  };

  const renderListDone = () => {
    const listDoneContainer = document.querySelector('.lists-done');
    listDoneContainer.innerHTML = '';
    // Filter completed tasks
    const completedTasks = tasks.filter((task) => task.completed);

    // Jika tidak ada tugas yang selesai, tampilkan pesan
    if (completedTasks.length === 0) {
      const noTaskDoneMessage = document.createElement('p');
      noTaskDoneMessage.classList.add('no-task-done');
      noTaskDoneMessage.textContent = 'There are no completed tasks at the time.';
      listDoneContainer.appendChild(noTaskDoneMessage);
    } else {
      completedTasks.forEach((task) => {
        const article = document.createElement('article');
        article.classList.add('list-done');

        // Periksa apakah tugas overdue namun tetap completed
        const deadlineDate = task.deadline ? new Date(task.deadline) : null;
        const completedAtDate = task.completedAt ? new Date(task.completedAt) : null;
        let isOverdueCompleted = false;
        if (deadlineDate && completedAtDate && completedAtDate > deadlineDate) {
          article.classList.add('overdue-completed');
          isOverdueCompleted = true;
        }

        // Menampilkan nama tugas
        const taskName = document.createElement('p');
        taskName.textContent = task.task;
        article.appendChild(taskName);

        // Menampilkan tanggal deadline
        const deadline = document.createElement('p');
        deadline.textContent = `Deadline: ${task.deadline || 'No deadline'}`;

        // Menambahkan teks "Overdue" jika tugas overdue namun tetap completed
        if (isOverdueCompleted) {
          deadline.innerHTML += '<span class="overdue-task">(Overdue)</span>';
        }

        article.appendChild(deadline);

        if (task.completedAt) {
          const completionDate = new Date(task.completedAt).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          const completedAt = document.createElement('p');
          completedAt.textContent = `Completed at: ${completionDate}`;
          article.appendChild(completedAt);
        }

        // Append completed task to listdone container
        listDoneContainer.appendChild(article);
      });
    }
  };

  // menyimpan dan mengambil task dari localstorage
  const saveLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('currentDateTime', date.toString());
  };

  const getLocal = () => {
    const localTasks = JSON.parse(localStorage.getItem('tasks'));
    const localDate = localStorage.getItem('currentDateTime');

    // jika task ditemukan
    if (localTasks) {
      tasks = localTasks;
    }

    // jika currentDateTime ditemukan
    if (localDate) {
      date = new Date(localDate);
    }
  };

  // Memperbarui currentDateTime
  const updateCurrentDateTime = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completedAt = new Date();
    }
    saveLocal();
  };

  //merender semua kategori di select
  const categorySelect = document.querySelector('#category-select');

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.title.toLowerCase();
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });

  //merender semua priority di select
  const prioritySelect = document.querySelector('#priority-select');
  priorities.forEach((priority) => {
    const option = document.createElement('option');
    option.value = priority.toLowerCase();
    option.textContent = priority;
    prioritySelect.appendChild(option);
  });

  //menambahkan fungsi add ke new tasks
  const cancelBtn = document.querySelector('.cancel-btn');
  const addBtn = document.querySelector('.add-btn');
  const taskInput = document.querySelector('#task-input');
  const deadlineInput = document.querySelector('#deadline-input');

  cancelBtn.addEventListener('click', toggleAddTaskForm);

  addBtn.addEventListener('click', () => {
    const task = taskInput.value;
    const deadline = deadlineInput.value;
    const category = categorySelect.value;
    const priority = prioritySelect.value;

    if (task === '') {
      alert('Please input your task!');
    } else if (deadline === '') {
      alert('Please fill your date!');
    } else if (category === '') {
      alert('Please select a category!');
    } else if (priority === '') {
      alert('Please select a priority!');
    } else {
      const newTask = {
        id: tasks.length + 1,
        task,
        category,
        priority,
        completed: false,
        deadline,
      };
      tasks.push(newTask);
      taskInput.value = '';
      categorySelect.value = '';
      prioritySelect.value = '';
      deadlineInput.value = '';

      toggleAddTaskForm();
      renderTasks();
    }
  });

  // ini semua adalah task yang sudah masuk
  getLocal();
  calculateTotal();
  renderTasks();
  renderListDone();
  updateTime();
  setInterval(updateTime, 1000);
});
