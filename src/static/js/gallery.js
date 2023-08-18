// Chargement des données JSON depuis la balise script
const imageDataElement = document.getElementById('image-data');
const image_data = JSON.parse(imageDataElement.textContent);

function showMainTabContent(imageName) {
    // Hide previous sub tabs and image containers
    document.getElementById('sub-tabs').style.display = 'none';
    document.getElementById('image-containers').innerHTML = '';

    // Show the selected main tab content (sub tabs)
    document.getElementById('sub-tabs').style.display = 'flex';

    // Generate sub tabs for the selected image name
    const subTabs = Object.keys(image_data[imageName]);
    let subTabsHTML = '';
    for (const subTab of subTabs) {
        subTabsHTML += `<div class="sub-tab" onclick="showSubTabContent('${subTab}')">${subTab}</div>`;
    }
    document.getElementById('sub-tabs').innerHTML = subTabsHTML;

    // Show the first sub tab content by default
    if (subTabs.length > 0) {
        showSubTabContent(subTabs[0]);
    }
}

function showSubTabContent(subTabName) {
    // Hide previous image containers
    document.getElementById('image-containers').innerHTML = '';

    // Generate image containers for the selected sub tab
    const images = image_data[currentMainTab][subTabName];
    let imageContainersHTML = '';
    for (const imagePath of images) {
        imageContainersHTML += `<div class="image-container"><img src="${imagePath}" alt="${subTabName}"></div>`;
    }
    document.getElementById('image-containers').innerHTML = imageContainersHTML;
}

// ... Le reste de votre code JavaScript ...
