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

    });
});
