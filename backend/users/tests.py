
# Create your tests here.

'''from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import Citizen

class UserTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email="test@gmail.com",
            password='12345'
        )

    def test_login_success(self):
        login = self.client.login(
            username='testuser',
            password='12345'
        )
        self.assertTrue(login)

class APITest(APITestCase):

    def test_login_api(self):
        url = reverse('login')

        User.objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="123456"
        )

        response = self.client.post(url, {
            "username": "testuser",
            "email":"test@gmail.com",
            "password": "123456"
        })
        response = self.client.post(url, {
            "login": "testuser",   # 👈 this is the key fix
            "password": "123456"
        })
        print(response.data)

        self.assertEqual(response.status_code, 200)

    def test_invalid_login_api(self):
        url = reverse('login')

        response = self.client.post(url, {
            "username": "wrong",
            "password": "wrong"
        })

        self.assertNotEqual(response.status_code, 200)'''
   

