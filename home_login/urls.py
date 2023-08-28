from django.urls import path
from .views import SignUpView
from .import views

urlpatterns = [
    path('singup/', SignUpView.as_view(), name='signup'),
    path('slider/', views.Index.as_view(), name='slider'),
    path('artist/', views.Artists, name='artist'),
    path('product/', views.Home.as_view(), name='product'),
]
