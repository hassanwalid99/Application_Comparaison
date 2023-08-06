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