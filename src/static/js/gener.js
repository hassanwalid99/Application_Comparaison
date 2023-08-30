document.addEventListener("DOMContentLoaded", function () {
    
    const generationForm = document.getElementById("generation-form");
    const versionCheckboxes = generationForm.querySelectorAll('.version-checkbox');
    const folderCheckboxes = generationForm.querySelectorAll('.folder-checkbox'); 

    const exeInput = document.getElementById("exe_input");
    const selectedExe = document.getElementById("selected_exe");
    
    exeInput.addEventListener("change", function () {
        const fullPath = exeInput.value;
        const startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        const filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            selectedExe.value = filename.substring(1);
        } else {
            selectedExe.value = filename;
        }
    });

    function showProgressBar() {
        const popup = document.getElementById('progress-popup');
        popup.style.display = 'block';
    }
    
    function hideProgressBar() {
        const popup = document.getElementById('progress-popup');
        popup.style.display = 'none';
    } 
    
    const folderItems = document.querySelectorAll(".folder-item");
    const imageBubble = document.getElementById("image-bubble");

    folderItems.forEach(folderItem => {
        folderItem.addEventListener("mouseover", function() {
            const folderName = folderItem.dataset.folder;
            fetchAndDisplayImage(folderName, folderItem);
        });
    });

    function fetchAndDisplayImage(folderName, folderItem) {
        fetch('/get_image/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ folderName: folderName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayImageInBubble(data.imageURL, folderItem);
            }
        })
        .catch(error => console.error('Erreur', error));
    }

    function displayImageInBubble(imageURL, folderItem) {
        imageBubble.innerHTML = `<img src="${imageURL}" alt="Image du dossier" class="centered-image">`;

        folderItem.addEventListener("mouseout", function() {
            hideImage();
        });

        imageBubble.style.display = "block";
    }

    function hideImage() {
        imageBubble.innerHTML = ''; // Effacer le contenu de la bulle
        imageBubble.style.display = "none";
    }

    generationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showProgressBar(); // Afficher la fenêtre contextuelle
        
        const selectedVersions = Array.from(versionCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        const selectedFolders = Array.from(folderCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        
        
        //console.log("Selected Versions:", selectedVersions);
        //console.log("Selected Folders:", selectedFolders);

        const formData = new FormData();
        selectedVersions.forEach(version => {
            formData.append('selected_versions[]', version);  // Note the "[]" in the name     
        });

        selectedFolders.forEach(folder => {
            formData.append('selected_folders[]', folder);  // Note the "[]" in the name     
        });

        if (exeInput.files.length > 0) {
            formData.append('selected_exe', exeInput.files[0]);  // Append the File object
        }

        fetch('/get_parameters/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Parameters of selected versions:", data);
            hideProgressBar();           
        });
    });

    // Function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});