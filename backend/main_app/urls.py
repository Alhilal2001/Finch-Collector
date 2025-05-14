from django.urls import path
from . import views


urlpatterns = [
  path('', views.Home.as_view(), name='home'),
  path('finchs/', views.FinchsIndex.as_view(), name='finch-index'),
  path('finchs/<int:finch_id>/', views.FinchDetail.as_view(), name='finch-detail'),
  path('finchs/<int:finch_id>/feedings/', views.FeedingsIndex.as_view(), name='feeding-create'),
  path('toys/', views.ToyIndex.as_view(), name='toy-index'),
  path('toys/<int:toy_id>/', views.ToyDetail.as_view(), name='toy-detail'),
  path('finchs/<int:finch_id>/associate-toy/<int:toy_id>/', views.AddToyToFinch.as_view(), name='associate-toy'),
  path('finchs/<int:finch_id>/remove-toy/<int:toy_id>/', views.RemoveToyFromFinch.as_view(), name='remove-toy'),
  path('finchs/<int:finch_id>/add-photo/', views.PhotoDetail.as_view(), name='add-photo'),
  path('users/signup/', views.CreateUserView.as_view(), name='signup'),
  path('users/login/', views.LoginView.as_view(), name='login'),
  path('users/token/refresh/', views.VerifyUserView.as_view(), name='token_refresh'),
]