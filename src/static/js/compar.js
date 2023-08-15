document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add_selection');
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


    const initialSelectionGroup = document.querySelector('.selection-group');
    createSelection(initialSelectionGroup);
    
    
});
