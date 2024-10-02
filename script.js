const exerciseInput = document.getElementById('exercise-input');
const categorySelect = document.getElementById('category-select');
const daySelect = document.getElementById('day-select');
const addExerciseButton = document.getElementById('add-exercise');
const workoutDays = document.querySelectorAll('.exercise-list');

// Load exercises from local storage
document.addEventListener('DOMContentLoaded', loadExercises);

// Add event listener to add exercise
addExerciseButton.addEventListener('click', addExercise);



function addExercise() {
    const exerciseText = exerciseInput.value;
    const category = categorySelect.value;
    const day = daySelect.value;

    if (exerciseText.trim() === '') return;

    const exerciseItem = createExerciseItem(exerciseText, category);

    // Ensure you are appending to the correct list based on the day
    const listId = day.toLowerCase() + '-list';
    const exerciseList = document.getElementById(listId);

    if (exerciseList) {
        exerciseList.appendChild(exerciseItem);
        saveExercise(exerciseText, category, day);
    } else {
        console.error(`Exercise list not found for day: ${day}`);
    }

    exerciseInput.value = '';
}

function createExerciseItem(text, category) {
    const li = document.createElement('li');
    li.classList.add('exercise-item');
    li.setAttribute('draggable', true);
    li.textContent = `${text} - ${category}`;

    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ text, category }));
    });

    li.addEventListener('click', () => {
        li.remove();
        removeExercise(text, category);
    });

    return li;
}

function dropExercise(event) {
    event.preventDefault();
    const { text, category } = JSON.parse(event.dataTransfer.getData('text/plain'));
    const day = event.target.closest('.day').getAttribute('data-day');
    const exerciseItem = createExerciseItem(text, category);
    const exerciseList = event.target.querySelector('.exercise-list');

    if (exerciseList) {
        exerciseList.appendChild(exerciseItem);
        removeExercise(text, category);
        saveExercise(text, category, day);
    } else {
        console.error('Exercise list not found for drop target.');
    }
}

function saveExercise(text, category, day) {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    exercises.push({ text, category, day });
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function removeExercise(text, category) {
    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    exercises = exercises.filter(exercise => exercise.text !== text || exercise.category !== category);
    localStorage.setItem('exercises', JSON.stringify(exercises));
}

function loadExercises() {
    const exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    exercises.forEach(({ text, category, day }) => {
        const exerciseItem = createExerciseItem(text, category);
        const listId = day.toLowerCase() + '-list';
        const exerciseList = document.getElementById(listId);

        if (exerciseList) {
            exerciseList.appendChild(exerciseItem);
        }
    });
}
