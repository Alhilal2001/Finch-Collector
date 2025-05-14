from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from unittest.mock import patch, MagicMock

class AuthTestCase(APITestCase):
    def setUp(self):
        self.mock_user = MagicMock(spec=User)
        self.mock_user.configure_mock(**{
            'id': 1,
            'username': 'testuser',
            'email': 'test@test.com',
            'is_authenticated': True,
            'is_active': True,
            'is_anonymous': False,
            '__str__': lambda self: 'testuser'
        })

        self.verification_url = reverse('token_refresh')
        self.mock_access_token = "mock_access_token_12345"
        self.mock_refresh_token = "mock_refresh_token_67890"
        
    # Token verification tests
    @patch('django.contrib.auth.models.User.objects')
    @patch('rest_framework_simplejwt.tokens.RefreshToken.for_user')
    @patch('rest_framework_simplejwt.authentication.JWTAuthentication.get_validated_token')
    @patch('rest_framework_simplejwt.authentication.JWTAuthentication.get_user')
    def test_user_verification_success(self, mock_get_user, mock_get_validated_token, mock_token_for_user, mock_user_objects):
        """Test user verification with a mocked valid access token."""
        mock_get_validated_token.return_value = MagicMock()
        mock_get_user.return_value = self.mock_user
        mock_user_objects.get.return_value = self.mock_user

        mock_token = MagicMock()
        mock_token.access_token = self.mock_access_token
        mock_token.__str__.return_value = self.mock_refresh_token
        mock_token_for_user.return_value = mock_token

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.mock_access_token}')
        response = self.client.get(self.verification_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_user_verification_no_token(self):
        """Test user verification without authentication."""
        response = self.client.get(self.verification_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_verification_invalid_token(self):
        """Test user verification with invalid token."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(self.verification_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    # Registration tests 
    @patch('main_app.views.User.objects.create_user')
    @patch('rest_framework_simplejwt.tokens.RefreshToken.for_user')
    @patch('main_app.views.User.objects.get')
    def test_user_registration(self, mock_user_get, mock_token_for_user, mock_create_user):
        """Test user registration with mocked user creation."""
        url = reverse('signup')
        data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'newpassword123'
        }

        new_mock_user = MagicMock(spec=User)
        new_mock_user.configure_mock(**{
            'id': 2,
            'username': data['username'],
            'email': data['email'],
            'is_authenticated': True,
            'is_active': True,
            'is_anonymous': False,
            '__str__': lambda self: data['username']
        })

        mock_create_user.return_value = new_mock_user
        mock_user_get.return_value = new_mock_user

        mock_token = MagicMock()
        mock_token.access_token = self.mock_access_token
        mock_token.__str__.return_value = self.mock_refresh_token
        mock_token_for_user.return_value = mock_token

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'newuser') 

        # Login tests
    @patch('main_app.views.authenticate')
    @patch('rest_framework_simplejwt.tokens.RefreshToken.for_user')
    def test_user_login(self, mock_token_for_user, mock_authenticate):
        """Test user login with mocked authentication."""
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'securepassword123'
        }

        mock_authenticate.return_value = self.mock_user

        mock_token = MagicMock()
        mock_token.access_token = self.mock_access_token
        mock_token.__str__.return_value = self.mock_refresh_token
        mock_token_for_user.return_value = mock_token

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    @patch('main_app.views.authenticate')
    def test_user_login_invalid_credentials(self, mock_authenticate):
        """Test user login with mocked failed authentication."""
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }

        mock_authenticate.return_value = None

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid credentials')