function showTabContent(tabIndex) {
    // Masquer tous les contenus d'onglets
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Afficher le contenu de l'onglet sélectionné
    const selectedTabContent = document.getElementById('tab-content-' + tabIndex);
    selectedTabContent.classList.add('active');

    // Mettre à jour les onglets sélectionnés
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('selected');
    });
    const selectedTab = document.querySelector('.tab:nth-child(' + tabIndex + ')');
    selectedTab.classList.add('selected');
}

function addRow() {
    var table = document.getElementById("config-table");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<input type="text" placeholder="Type">';
    cell2.innerHTML = '<input type="text" placeholder="Paramètre">';
    cell3.innerHTML = '<input type="text" placeholder="Valeur">';
}

function sendDataToBackend() {
    const nameConfig = document.getElementById('name_config').value;
    const rows = document.querySelectorAll('#config-table tbody tr');
    const parameters = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const param = {
            'Type': inputs[0].value,
            'Paramètre': inputs[1].value,
            'Valeur': inputs[2].value
        };
        parameters.push(param);
    });

    // Création de l'objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('name_config', nameConfig);
    formData.append('parameters', JSON.stringify(parameters));

    // Envoi de la requête POST via AJAX
    fetch('/save_configuration/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi des données:', error);
    });
}
  