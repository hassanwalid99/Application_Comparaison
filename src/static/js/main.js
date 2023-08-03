document.addEventListener("DOMContentLoaded", function() {
    const deleteFolderButtons = document.querySelectorAll(".delete-button");

    deleteFolderButtons.forEach(button => {
        button.addEventListener("click", function() {
            const folderName = button.dataset.folder;
            deleteFolder(folderName);
        });
    });

    function deleteFolder(folderName) {
        if (confirm('Voulez-vous vraiment supprimer ce dossier ?')) {
            const folderElement = document.querySelector(`[data-folder="${folderName}"]`);
            folderElement.parentNode.removeChild(folderElement);

            fetch('/delete_folder/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: 'folderName=' + encodeURIComponent(folderName),
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    alert('Une erreur s\'est produite lors de la suppression du dossier : ' + data.error);
                    document.querySelector('.folder-list').innerHTML += `
                        <div class="folder-item" data-folder="${folderName}">
                            <span class="delete-button" data-folder="${folderName}">X</span>
                            ${folderName}
                        </div>`;
                }
                console.log('Réponse du serveur :', data);
            })
            .catch(error => console.error('Erreur lors de la suppression :', error));
        }
    }
 
    document.getElementById('zip_file').addEventListener('change', function() {
        var fullPath = this.value;
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        document.getElementById('selected_folder').value = filename;
    });

    const envoiebutton = document.getElementById("validatefolder");

    envoiebutton.addEventListener("click", function() {
        uploadZipFile()
    });

    // Envoie le fichier .zip sélectionné au backend via une requête AJAX
    function uploadZipFile() {
        var formData = new FormData(document.getElementById('uploadForm'));
        console.log("data:", formData);
        fetch('/uploadZipFile/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: formData,
        })
        
        .then(response => response.json())
        .then(data => {
            // ...
        })
        .catch(error => console.error('Erreur', error));
    }


    function addFolder(folderName, folderPath) {
    const formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("folderPath", folderPath); // Ajouter le chemin complet du dossier à la requête

    fetch('/add_folder/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        // ...
    })
    .catch(error => console.error('Erreur lors de l\'ajout du dossier :', error));
    }

    

    function refreshFolderList(folders) {
        const folderListElement = document.getElementById("folder-list");
        folderListElement.innerHTML = "";

        folders.forEach((folder) => {
            const folderItemElement = document.createElement("div");
            folderItemElement.classList.add("folder-item");
            folderItemElement.setAttribute("data-folder", folder);

            const deleteButtonElement = document.createElement("span");
            deleteButtonElement.classList.add("delete-button");
            deleteButtonElement.setAttribute("data-folder", folder);
            deleteButtonElement.textContent = "X";

            folderItemElement.appendChild(deleteButtonElement);
            folderItemElement.appendChild(document.createTextNode(folder));

            folderListElement.appendChild(folderItemElement);
        });
    }

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






