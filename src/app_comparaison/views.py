from django.shortcuts import render
from django.http import JsonResponse
import os
import zipfile
from pathlib import Path
import shutil
from django.views.decorators.http import require_POST
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from .models import Folder
from tinydb import TinyDB, Query
from django.views.decorators.csrf import csrf_exempt



def accueil(request):
    return render(request, 'accueil.html')

def scene(request):
    directory_path = "C:/Users/AT83190/Desktop/application/scene"
    folders = [folder for folder in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, folder))]
    folders.sort()
    return render(request, 'scene.html', {'folders': folders})

def configuration(request):
    return render(request, 'configuration.html')

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
                    if file_name.lower().endswith('.pbrt'):
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
        table.insert({ 'config': data.dict()})

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
        table.insert({ 'config': data.dict()})

        return JsonResponse({'message': 'Configuration enregistrée avec succès!'})
    else:
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
    
    
def get_table_names(request):
    db = TinyDB('configurations.json')
    table_names_set = db.tables()
    table_names_list = list(table_names_set)  # Convertir l'ensemble en liste
    print(table_names_set)
    return JsonResponse({'table_names': table_names_list})