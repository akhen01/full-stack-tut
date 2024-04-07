from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.CreateNoteView.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.deleteNoteView.as_view(), name="delete-note")
]