function showTabContent(tabIndex) {
    localStorage.setItem('activeTabIndex', tabIndex);
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


function addRow(tabl) {
    var table = document.getElementById(tabl);
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<input type="text" placeholder="Type">';
    cell2.innerHTML = '<input type="text" placeholder="Parametre">';
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
            'Parametre': inputs[1].value,
            'Valeur': inputs[2].value
        };
        parameters.push(param);
    });

    if (!nameConfig || parameters.some(param => !param.Type || !param.Parametre || !param.Valeur)) {
        alert('Veuillez remplir tous les champs.');
        return; // Ne pas envoyer les données si les champs sont vides
    }

    // Création de l'objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('name_config', nameConfig);
    formData.append('parameters', JSON.stringify(parameters));

    fetch('/save_configuration/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            location.reload(); 
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi des données:', error);
    });
}
  
function sendDataToBackend2() {
    const selectedConfig = document.getElementById('name_select').value;
    const rows = document.querySelectorAll('#config-table2 tbody tr');
    const parameters = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const param = {
            'Type': inputs[0].value,
            'Parametre': inputs[1].value,
            'Valeur': inputs[2].value
        };
        parameters.push(param);
    }); 
    
    if (!nameConfig || parameters.some(param => !param.Type || !param.Parametre || !param.Valeur)) {
        alert('Veuillez remplir tous les champs.');
        return; // Ne pas envoyer les données si les champs sont vides
    }
    // Création de l'objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('name_select', selectedConfig);
    formData.append('parameters', JSON.stringify(parameters));

    fetch('/save_version/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            location.reload(); 
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi des données:', error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const activeTabIndex = localStorage.getItem('activeTabIndex');
    if (activeTabIndex !== null) {
        showTabContent(activeTabIndex);
    }
    displayTableNames(); 
});

function displayTableNames() {
    fetch('/get_table_names/')
        .then(response => response.json())
        .then(data => {
            if (data.table_names) {
                const tableNamesList = data.table_names;
                const selectElement = document.getElementById('name_select');
                
                // Ajouter les options au <select>
                tableNamesList.forEach(tableName => {
                    const option = document.createElement('option');
                    option.value = tableName;
                    option.textContent = tableName;
                    selectElement.appendChild(option);
                });
                console.log(tableNamesList);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des noms de table:', error);
        });
}
