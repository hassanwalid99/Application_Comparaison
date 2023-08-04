from django.urls import path
from . import views


urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('scene/', views.scene, name='scene'),
    path('configuration/', views.configuration, name='configuration'),
    path('uploadZipFile/', views.upload_zip_file, name='uploadZipFile'),
    path('delete_folder/', views.delete_folder_view, name='delete_folder'),
] 

