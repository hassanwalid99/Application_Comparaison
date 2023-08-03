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

def accueil(request):
    return render(request, 'accueil.html')

def scene(request):
    directory_path = "C:/Users/AT83190/Desktop/application/scene"
    folders = [folder for folder in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, folder))]
    folders.sort()
    return render(request, 'scene.html', {'folders': folders})

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

        zip_file = request.FILES['zip_file']
        
        try:
            # Ouvrir le fichier .zip
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                # Vérifier si un fichier avec l'extension .pbrt existe dans le zip
                for file_name in zip_ref.namelist():
                    if file_name.lower().endswith('.pbrt'):
                        zip_file_name = zip_file.name 
                        zip_file_name_without_extension = zip_file_name[:-4]
                        if os.path.exists(os.path.join(directory_path, zip_file_name_without_extension)):
                            return JsonResponse({'success': False, 'error': 'Un dossier avec le nom existe déjà dans le répertoire cible'})
                        else:
                            zip_ref.extractall(directory_path)
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

