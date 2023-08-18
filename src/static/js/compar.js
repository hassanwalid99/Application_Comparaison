document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add_selection');
    const viewAllImagesButton = document.getElementById('view-all-images');
    const selectionsContainer = document.getElementById('selections-container');

    const initialSelection = document.querySelector('.selection-group');
    const newSelectionGroup = initialSelection.cloneNode(true);
    createSelection(newSelectionGroup);

    function updateDestinationSelect(sourceSelect, destinationSelect) {
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
    }

    function createSelection(selectionGroup) {
        selectionsContainer.appendChild(selectionGroup);

        // Mettre à jour les éléments dans la nouvelle sélection
        const newSourceSelect = selectionGroup.querySelector('.source_select');
        const newDestinationSelect = selectionGroup.querySelector('.destination_select');

        // Réinitialiser la deuxième liste déroulante à chaque création
        newDestinationSelect.innerHTML = '<option value="" disabled selected>Choisir</option>';

        newSourceSelect.addEventListener('change', function () {
            updateDestinationSelect(newSourceSelect, newDestinationSelect);
        });
    }

    addButton.addEventListener('click', function () {
        const initialSelectionGroup = document.querySelector('.selection-group');
        const newSelectionGroup = initialSelectionGroup.cloneNode(true);
        createSelection(newSelectionGroup);
    });

    viewAllImagesButton.addEventListener('click', function () {
        const selectedPairs = [];
        const selectionGroups = document.querySelectorAll('.selection-group');

        selectionGroups.forEach(function (group) {
            const sourceSelect = group.querySelector('.source_select');
            const destinationSelect = group.querySelector('.destination_select');

            const selectedFolder = sourceSelect.value;
            const selectedSubfolder = destinationSelect.value;

            if (selectedFolder && selectedSubfolder) {
                selectedPairs.push({
                    folder: selectedFolder,
                    subfolder: selectedSubfolder
                });
            }
        });

        if (selectedPairs.length > 1) {
            const queryStringParts = selectedPairs.map(pair => `selected_folder=${pair.folder}&selected_subfolder=${pair.subfolder}`);
            const queryString = queryStringParts.join('&');
            const url = `/view_all_images/?${queryString}`;
            window.open(url, '_blank');
        }
    });

    const initialSelectionGroup = document.querySelector('.selection-group');
    createSelection(initialSelectionGroup);
});
