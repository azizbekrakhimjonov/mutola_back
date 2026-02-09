from django.urls import path
from . import views

urlpatterns = [
    path("news/", views.NewsListCreateView.as_view()),
    path("news/<str:pk>/", views.NewsDetailView.as_view()),
]
