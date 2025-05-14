from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Finch, Feeding, Toy, Photo
from .serializers import FinchSerializer, FeedingSerializer, ToySerializer, PhotoSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.db import IntegrityError

# Define the home view
class Home(APIView):
  def get(self, request):
    content = {'message': 'Welcome to the finch-collector api home route!'}
    return Response(content)
  
class FinchsIndex(APIView):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = FinchSerializer

  def get(self, request):
    try:
      queryset = Finch.objects.filter(user=request.user)
      serializer = self.serializer_class(queryset, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
  def post(self, request, *args, **kwargs):
    try:
      serializer = self.serializer_class(data=request.data)
      if serializer.is_valid():
        serializer.save(user_id = request.user.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
      print(serializer.errors)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as err:
      print(err)
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
class VerifyUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    try:
      user = User.objects.get(username=request.user.username)
      try:
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh),'access': str(refresh.access_token),'user': UserSerializer(user).data}, status=status.HTTP_200_OK)
      except Exception as token_error:
        return Response({"detail": "Failed to generate token.", "error": str(token_error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as err:
      return Response({"detail": "Unexpected error occurred.", "error": str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
class FinchDetail(APIView):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = FinchSerializer
  lookup_field = 'id'

  def get(self, request, finch_id):
    try:
      finch = get_object_or_404(Finch, id=finch_id)
      feedings = Feeding.objects.filter(finch=finch_id)
      toysFinchHas = Toy.objects.filter(finch=finch_id)
      toysFinchDoesntHave = Toy.objects.exclude(id__in=finch.toys.all().values_list('id'))
      return Response({
          "finch": FinchSerializer(finch).data,
          "feedings": FeedingSerializer(feedings, many=True).data,
          "toysFinchHas": ToySerializer(toysFinchHas, many=True).data,
          "toysFinchDoesntHave": ToySerializer(toysFinchDoesntHave, many=True).data
      }, status=status.HTTP_200_OK)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
  def put(self, request, finch_id):
    try:
        finch = get_object_or_404(Finch, id=finch_id)
        serializer = self.serializer_class(finch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  def delete(self, request, finch_id):
    try:
        finch = get_object_or_404(Finch, id=finch_id)
        finch.delete()
        return Response({'success': True}, status=status.HTTP_200_OK)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class FeedingsIndex(APIView):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = FeedingSerializer

  def get(self, request, finch_id):
    try:
      queryset = Feeding.objects.filter(finch=finch_id)
      return Response(self.serializer_class(queryset, many=True).data, status=status.HTTP_200_OK)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
  def post(self, request, finch_id):
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      serializer.save()
      queryset = Feeding.objects.filter(finch=finch_id)
      feedings = FeedingSerializer(queryset, many=True)
      return Response(feedings.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  

class ToyIndex(generics.ListCreateAPIView):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = ToySerializer
  queryset = Toy.objects.all()

class ToyDetail(APIView):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = ToySerializer
  lookup_field = 'id'
  
  def get(self, request, toy_id):
    try:
      toy = get_object_or_404(Toy, id=toy_id)
      return Response(self.serializer_class(toy).data, status=status.HTTP_200_OK)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  def put(self, request, toy_id):
    try:
      toy = get_object_or_404(Toy, id=toy_id)
      serializer = self.serializer_class(toy, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  def delete(self, request, toy_id):
    try:
      toy = Toy.objects.get(id=toy_id)
      toy.delete()
      return Response({'success': True}, status=status.HTTP_200_OK)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class AddToyToFinch(APIView):
  permission_classes = [permissions.IsAuthenticated]
  def post(self, request, finch_id, toy_id):
    try:
      finch = get_object_or_404(Finch, id=finch_id)
      toy = get_object_or_404(Toy, id=toy_id)
      finch.toys.add(toy)
      toys_finch_does_have = Toy.objects.filter(finch=finch_id)
      toys_finch_doesnt_have = Toy.objects.exclude(id__in = finch.toys.all().values_list('id'))
      return Response({
        "toysFinchHas": ToySerializer(toys_finch_does_have, many=True).data,
        "toysFinchDoesntHave": ToySerializer(toys_finch_doesnt_have, many=True).data
        }, status=status.HTTP_200_OK)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RemoveToyFromFinch(APIView):
  permission_classes = [permissions.IsAuthenticated]
  def post(self, request, finch_id, toy_id):
    try:
      finch = get_object_or_404(Finch, id=finch_id)
      toy = get_object_or_404(Toy, id=toy_id)
      finch.toys.remove(toy)
      toys_finch_does_have = Toy.objects.filter(finch=finch_id)
      toys_finch_doesnt_have = Toy.objects.exclude(id__in = finch.toys.all().values_list('id'))
      print(toys_finch_does_have)
      return Response({
        "toysFinchHas": ToySerializer(toys_finch_does_have, many=True).data,
        "toysFinchDoesntHave": ToySerializer(toys_finch_doesnt_have, many=True).data
        }, status=status.HTTP_200_OK)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class PhotoDetail(APIView):
  serializer_class = PhotoSerializer
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, finch_id):
    try:
      serializer = self.serializer_class(data=request.data)
      print("testing add photo endpoint", request.data)
      if serializer.is_valid():
        existing_photo = Photo.objects.filter(finch=finch_id).first()
        if existing_photo:
          existing_photo.delete()
        finch = get_object_or_404(Finch, id=finch_id)
        serializer.save(finch=finch)
        return Response(FinchSerializer(finch).data, status=status.HTTP_200_OK)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as err:
        return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class CreateUserView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def create(self, request, *args, **kwargs):
    try:
      response = super().create(request, *args, **kwargs)
      user = User.objects.get(username=response.data['username'])
      refresh = RefreshToken.for_user(user)
      content = {'refresh': str(refresh), 'access': str(refresh.access_token), 'user': response.data }
      return Response(content, status=status.HTTP_200_OK)
    except (ValidationError, IntegrityError) as err:
      return Response({ 'error': str(err)}, status=status.status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):

  def post(self, request):
    try:
      username = request.data.get('username')
      password = request.data.get('password')
      user = authenticate(username=username, password=password)
      if user:
        refresh = RefreshToken.for_user(user)
        content = {'refresh': str(refresh), 'access': str(refresh.access_token),'user': UserSerializer(user).data}
        return Response(content, status=status.HTTP_200_OK)
      return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as err:
      return Response({'error': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)