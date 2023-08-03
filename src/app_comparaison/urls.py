from django.urls import path
from . import views


urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('scene/', views.scene, name='scene'),
    path('add_folder/', views.add_folder_view, name='add_folder'),
    path('uploadZipFile/', views.upload_zip_file, name='uploadZipFile'),
    path('delete_folder/', views.delete_folder_view, name='delete_folder'),
] 

