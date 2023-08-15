from django.shortcuts import render
from django.http import JsonResponse
import os
from datetime import datetime
import zipfile
import json
from pathlib import Path
import shutil
import subprocess
from django.views.decorators.http import require_POST
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from .models import Folder
from tinydb import TinyDB, Query
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse



def accueil(request):
    return render(request, 'accueil.html')

def scene(request):
    directory_path = "C:/Users/AT83190/Desktop/application/scene"
    folders = [folder for folder in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, folder))]
    folders.sort()
    return render(request, 'scene.html', {'folders': folders})

def configuration(request):
    return render(request, 'configuration.html')

def generation(request):  
    db = TinyDB('configurations.json')
    table_names = db.tables()

    table_versions = []

    for table_name in table_names:
        table = db.table(table_name)
        versions = table.all()
        for version in versions:
            version_name = f"{table_name}.{version.doc_id}"
            table_versions.append(version_name)
    
    directory_path = "C:/Users/AT83190/Desktop/application/scene"
    folders = [folder for folder in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, folder))]
    

    return render(request, 'generation.html', {'table_versions': table_versions, 'folders': folders})


def comparaison(request):
    if request.method == 'GET':
        source_path = os.path.join(".", "rendus")
        if os.path.exists(source_path):
            folders = [f for f in os.listdir(source_path) if os.path.isdir(os.path.join(source_path, f))]
            return render(request, 'comparaison.html', {'folders': folders})
    return render(request, 'comparaison.html', {'folders': []}) 


@require_POST
def delete_folder_view(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        folder_name = request.POST.get('folderName')
        directory_path = "C:/Users/AT83190/Desktop/application/scene"

        try:
            folder_path = os.path.join(directory_path, folder_name)
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
                return JsonResponse({'success': True, 'message': 'Le dossier a été supprimé avec succès.'})
            else:
                return JsonResponse({'success': False, 'error': 'Le dossier n\'existe pas.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Requête non valide.'})

@require_POST
def upload_zip_file(request):
    directory_path = "C:/Users/AT83190/Desktop/application/scene"
    if request.method == 'POST' and request.FILES.get('zip_file'):
        new_name = request.POST.get('Name')
        image_file = request.FILES['image_file']
        original_filename, file_extension = os.path.splitext(image_file.name)

        zip_file = request.FILES['zip_file']
        ancien_nom = zip_file.name
                      
        try:
            # Ouvrir le fichier .zip
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                # Vérifier si un fichier avec l'extension .pbrt existe dans le zip
                for file_name in zip_ref.namelist():
                    if file_name.lower().endswith('scene.pbrt'):
                        if os.path.exists(os.path.join(directory_path, new_name)):
                            return JsonResponse({'success': False, 'error': 'Un dossier avec le nom existe déjà dans le répertoire cible'})
                        else:
                            dossier_tempo = os.path.join(directory_path, "tempo")
                            os.makedirs(dossier_tempo)                           
                            zip_ref.extractall(dossier_tempo)
                            os.rename(os.path.join(dossier_tempo , ancien_nom[:-4]) , os.path.join(directory_path , new_name) )
                            os.rmdir(dossier_tempo)  
                            
                                                                  
                            with open(os.path.join(directory_path , new_name, image_file.name), 'wb') as destination_file:
                                shutil.copyfileobj(image_file, destination_file)
                            os.rename(os.path.join(directory_path , new_name, image_file.name) , os.path.join(directory_path , new_name, new_name+file_extension))
      
                            message = "Le type de fichier .pbrt est présent dans le dossier .zip."
                            return JsonResponse({'success': True, 'message': message})


            # Aucun fichier .pbrt trouvé dans le zip
            message = "Le type de fichier .pbrt n'est pas présent dans le dossier .zip."
            return JsonResponse({'success': False,'error': message})

        except zipfile.BadZipFile:
            message = "Le fichier téléchargé n'est pas un fichier .zip valide."
            return JsonResponse({'success': False,'error': message}, status=400)
        except Exception as e:
            message = "Une erreur s'est produite lors de la vérification du fichier .zip."
            return JsonResponse({'success': False,'error': message}, status=500)

    # Réponse JSON en cas d'erreur ou si le formulaire n'est pas correctement rempli
    return JsonResponse({'success': False,'error': 'Une erreur s\'est produite lors de la vérification du fichier .zip.'}, status=400)

@csrf_exempt
def save_configuration(request):
    if request.method == 'POST':
        data = request.POST
        name_config = data.get('name_config')
        
        # Vérifier si le nom de configuration existe déjà dans la base de données
        db = TinyDB('configurations.json')
        if db.table(name_config):
            return JsonResponse({'error': 'Erreur : la configuration existe.'}, status=400)
        
        table = db.table(name_config) 

        # Enregistrement des paramètres dans la base de données TinyDB
        doc_id = table.insert({ 'config': data.dict()})
        version_data = table.get(doc_id = int (doc_id))
        
        chemin_dossier = os.path.join(".", "rendus", name_config + "." + str(doc_id))
        os.makedirs(chemin_dossier, exist_ok=True)

        return JsonResponse({'message': 'Configuration enregistrée avec succès!'})
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    
@csrf_exempt
def save_version(request):
    if request.method == 'POST':
        data = request.POST
        name_select = data.get('name_select')
        
        db = TinyDB('configurations.json')       
        table = db.table(name_select)   
        
        # Enregistrement des paramètres dans la base de données TinyDB
        doc_id = table.insert({ 'config': data.dict()})
        version_data = table.get(doc_id = int (doc_id))
        
        chemin_dossier = os.path.join(".", "rendus", name_select + "." + str(doc_id))
        os.makedirs(chemin_dossier, exist_ok=True)
        
        return JsonResponse({'message': 'Configuration enregistrée avec succès!'})
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
        
def get_table_names(request):
    db = TinyDB('configurations.json')
    table_names_set = db.tables()
    table_names_list = list(table_names_set)  # Convertir l'ensemble en liste
    
    return JsonResponse({'table_names': table_names_list})

@require_POST
def get_parameters(request):
    selected_versions = request.POST.getlist('selected_versions[]')
    selected_folders = request.POST.getlist('selected_folders[]')
    selected_exe = request.FILES['selected_exe']
    maintenant = datetime.now()
    date = maintenant.strftime("%Y-%m-%d_%H-%M-%S")
    db = TinyDB('configurations.json')
    parameters = {}
    
    for version_name in selected_versions:
        table_name, version_number = version_name.split('.')
        table = db.table(table_name)
        version_data = table.get(doc_id=int(version_number))
        if version_data:
            params_list = json.loads(version_data['config']['parameters'])
            parameters[version_name] = params_list
            
            tempo = os.path.join(".", "rendus", version_name, "tempo")
            os.makedirs(tempo, exist_ok=True)
            os.makedirs(os.path.join(".", "rendus", version_name, date ) , exist_ok=True)
            
            
            for folder_name in selected_folders:
                folder_path = os.path.join('C:/Users/AT83190/Desktop/application/scene', folder_name)
                nouveau = shutil.copytree(folder_path, os.path.join(tempo, folder_name))
                scene_file_path = os.path.join(tempo, folder_name, 'scene.pbrt')
                output = os.path.join(".", "rendus", version_name, date, folder_name +'.png' )                
                with open(scene_file_path, 'r') as f:
                    scene_content = f.read()
                    
                integrator_line = f'Integrator "{table_name}"\n'
                scene_content = scene_content.replace('%%PARAMS%%', integrator_line, 1)

                for param in params_list:
                    param_text = f"{param['Type']} : {param['Parametre']} : {param['Valeur']}"
                    if param['Type'] == "string":
                        scene_content = scene_content.replace('\n', f"\n\t\"{param['Type']} {param['Parametre']}\" [ \"{param['Valeur']}\" ]\n", 1)  # Add param on new line
                    else:
                        scene_content = scene_content.replace('\n', f"\n\t\"{param['Type']} {param['Parametre']}\" [ {param['Valeur']} ]\n", 1)  # Add param on new line
                output_for_scene = output.replace('\\', '/')
                scene_content = scene_content.replace('%%OUTPUT%%', f'"{output_for_scene}"' )
                with open(scene_file_path, 'w') as f:
                    f.write(scene_content)
                
                exe_file_path = os.path.join(tempo, selected_exe.name)
                with open(exe_file_path, 'wb') as exe_file:
                    for chunk in selected_exe.chunks():
                        exe_file.write(chunk)
                
                commande = [exe_file_path, scene_file_path]
                subprocess.run(commande, shell=True)               
            shutil.rmtree(tempo)
                
    return JsonResponse({'success': True})

def get_subfolders(request):
    source_folder = request.GET.get('source')
    subfolders = []

    if source_folder:
        source_path = os.path.join(".", "rendus", source_folder)
        if os.path.exists(source_path):
            subfolders = [f for f in os.listdir(source_path) if os.path.isdir(os.path.join(source_path, f))]

    return JsonResponse(subfolders, safe=False)

def display_images(request, source_folder, destination_folder):
    # ... Votre code existant ...
    image_urls = [os.path.join("/", "rendus", source_folder, destination_folder, image) for image in image_files]

    # Générer le contenu HTML avec les images
    image_html = ''
    for image_url in image_urls:
        image_html += f'<img src="{image_url}" alt="Image">'

    return HttpResponse(image_html)