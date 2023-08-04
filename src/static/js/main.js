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

    document.getElementById('image_file').addEventListener('change', function() {
        var fullPath = this.value;
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        document.getElementById('selected_image').value = filename;
    });
    
    const envoiebutton = document.getElementById("validatefolder");

    envoiebutton.addEventListener("click", function() {
    const inputNameScene  = document.getElementById('name_scene');    
    const scenename = inputNameScene.value;   
        uploadZipFile(scenename)
    });

    // Envoie le fichier .zip sélectionné au backend via une requête AJAX
    function uploadZipFile(scenename) {
        var formData = new FormData(document.getElementById('uploadForm'));

        formData.append("Name", scenename);
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
            if (!data.success) {
                alert('Erreur : ' + data.error);
            } else {
                window.location.reload();
            }
            console.log('Réponse du serveur :', data);
        })
        .catch(error => console.error('Erreur', error));
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






