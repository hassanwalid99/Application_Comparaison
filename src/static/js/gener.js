// gener.js

document.addEventListener("DOMContentLoaded", function () {
    const generationForm = document.getElementById("generation-form");
    const versionCheckboxes = generationForm.querySelectorAll('.version-checkbox');
    const folderCheckboxes = generationForm.querySelectorAll('.folder-checkbox');

    generationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const selectedVersions = Array.from(versionCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        const selectedFolders = Array.from(folderCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

        console.log("Selected Versions:", selectedVersions);
        console.log("Selected Folders:", selectedFolders);

        const formData = new FormData();
        selectedVersions.forEach(version => {
            formData.append('selected_versions[]', version);  // Note the "[]" in the name     
        });

        selectedFolders.forEach(folder => {
            formData.append('selected_folders[]', folder);  // Note the "[]" in the name     
        });

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
