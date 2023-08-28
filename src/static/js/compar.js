document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add_selection');
    const viewAllImagesButton = document.getElementById('view-all-images');
    const selectionsContainer = document.getElementById('selections-container');
    const selectedImagesList = document.querySelector('.selected-images-list');
    const selectedImagesNotDisplayedList = document.querySelector('.selected-images-not-displayed-list');

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

                    // Mettre à jour les listes d'images
                    updateSelectedImagesLists();
                })
                .catch(error => console.error('Error fetching subfolders:', error));
        }
    }

    function updateSelectedImagesLists() {
        selectedImagesList.innerHTML = ''; // Réinitialiser la liste
        selectedImagesNotDisplayedList.innerHTML = ''; // Réinitialiser la liste
    
        const selectionGroups = document.querySelectorAll('.selection-group');
        const selectedFolders = [];
        const selectedSubfolders = [];
    
        selectionGroups.forEach(function (group) {
            const sourceSelect = group.querySelector('.source_select');
            const destinationSelect = group.querySelector('.destination_select');
    
            const selectedFolder = sourceSelect.value;
            const selectedSubfolder = destinationSelect.value;
    
            if (selectedFolder && selectedSubfolder) {
                selectedFolders.push(selectedFolder);
                selectedSubfolders.push(selectedSubfolder);
            }
        });
    
        // Envoyer la liste des dossiers et sous-dossiers sélectionnés dans la requête AJAX
        const selectedFoldersQueryParam = selectedFolders.map(folder => `selected_folder=${folder}`).join('&');
        const selectedSubfoldersQueryParam = selectedSubfolders.map(subfolder => `selected_subfolder=${subfolder}`).join('&');
        
        fetch(`/check_image_presence/?${selectedFoldersQueryParam}&${selectedSubfoldersQueryParam}`)
            .then(response => response.json())
            .then(data => {
                data.images_to_display.forEach(imageName => {
                    // Créer un élément li pour afficher le nom de l'image
                    const li = document.createElement('li');
                    li.textContent = imageName;
    
                    selectedImagesList.appendChild(li);
                });
    
                data.images_not_displayed.forEach(imageName => {
                    // Créer un élément li pour afficher le nom de l'image non affichée
                    const li = document.createElement('li');
                    li.textContent = imageName;
                    const missingInfo = data.image_missing_info[imageName];  // Récupérer les dossiers manquants
                    if (missingInfo) {
                        li.title = `Dossiers où l'image manque : \n- ${missingInfo.join('\n- ')}`;
                    }
    
                    selectedImagesNotDisplayedList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching image presence:', error));
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

        newDestinationSelect.addEventListener('change', function () {
            updateSelectedImagesLists();
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
    createSelection(initialSelectionGroup);;
});