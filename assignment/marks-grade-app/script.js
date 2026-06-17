const form = document.getElementById('marksForm');
const marksInput = document.getElementById('marks');
const clientError = document.getElementById('clientError');

function showClientError(message) {
    clientError.textContent = message;
    clientError.classList.remove('hidden');
}

function hideClientError() {
    clientError.textContent = '';
    clientError.classList.add('hidden');
}

form.addEventListener('submit', (event) => {
    const rawValue = marksInput.value.trim();

    if (rawValue === '') {
        event.preventDefault();
        showClientError('Please enter your marks before submitting.');
        return;
    }

    const numericValue = Number(rawValue);

    if (Number.isNaN(numericValue)) {
        event.preventDefault();
        showClientError('Marks must be a valid number.');
        return;
    }

    if (numericValue < 0 || numericValue > 100) {
        event.preventDefault();
        showClientError('Marks must be between 0 and 100.');
        return;
    }

    hideClientError();
});

marksInput.addEventListener('input', () => {
    hideClientError();
});
