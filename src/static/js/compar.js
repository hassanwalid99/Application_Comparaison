document.addEventListener('DOMContentLoaded', function () {
    const sourceSelect = document.getElementById('source_select');
    const destinationSelect = document.getElementById('destination_select');

    sourceSelect.addEventListener('change', function () {
        const selectedSource = sourceSelect.value;
        destinationSelect.innerHTML = ''; // Réinitialiser la liste de destination

        if (selectedSource) {
            fetch(`/get_subfolders/?source=${selectedSource}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(folder => {
                        const option = document.createElement('option');
                        option.value = folder;
                        option.textContent = folder;
                        destinationSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error fetching subfolders:', error));
        }
    });
});
