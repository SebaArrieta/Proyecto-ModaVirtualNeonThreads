import unittest
import requests

BASE_URL = 'http://localhost:5000' 

class TestUserAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        url = f"{BASE_URL}/SignUp"
        data = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123",
            "ConfirmarContraseña": "Password123",
            "Direccion": "Calle 123",
            "Ciudad": "Santiago",
            "Zip": "12345"
        }

        response = requests.post(url, json=data)
        print(response.json()) #response.json para obtener el response completo

        url = f"{BASE_URL}/Login"
        data = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        response = requests.post(url, json=data)
        print(response.json())

        cls.CorreoUserCreated = data['Correo']
        cls.PasswordUserCreated = data['Contraseña']
        cls.LoginToken = response.json()['token']
        cls.LoginTipo = response.json()['tipo']
    
    @classmethod
    def tearDownClass(cls):
        url = f"{BASE_URL}/deleteUser"
        headers = {"Authorization": f"{cls.LoginToken}", "tipo": f"{cls.LoginTipo}"}
        print(headers)
        
        response = requests.post(url, json={}, headers=headers)

        print(response.json())

        del cls.CorreoUserCreated
        del cls.PasswordUserCreated
        del cls.LoginToken
        del cls.LoginTipo

    def test_signup(self):
        url = f"{BASE_URL}/SignUp"
        data = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123",
            "Direccion": "Calle 123",
            "Ciudad": "Santiago",
            "Zip": "12345"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json())  # Verifica que la respuesta contenga el ID del nuevo usuario

    def test_login(self):
        url = f"{BASE_URL}/Login"
        data = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())  # Verifica que la respuesta contenga un token JWT

    def test_get_payment_method_user(self):
        # Aquí debes obtener un token válido de JWT primero, usando el login
        login_url = f"{BASE_URL}/Login"
        login_data = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        login_response = requests.post(login_url, json=login_data)
        token = login_response.json().get("token")
        
        url = f"{BASE_URL}/getPaymentMethodUser"
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # Verifica que el método de pago se devuelve como lista

    def test_post_payment_method_user(self):
        # Obtener token
        login_url = f"{BASE_URL}/Login"
        login_data = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        login_response = requests.post(login_url, json=login_data)
        token = login_response.json().get("token")

        url = f"{BASE_URL}/PostPaymentMethodUser"
        headers = {"Authorization": f"Bearer {token}"}
        data = {
            "Nombre_Titular": "Sebastián Arrieta",
            "Numero_Tarjeta": "4111111111111111",
            "CVV": "123",
            "Fecha_Vencimiento": "12/25"
        }
        response = requests.post(url, json=data, headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_delete_payment_method_user(self):
        # Obtener token
        login_url = f"{BASE_URL}/Login"
        login_data = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        login_response = requests.post(login_url, json=login_data)
        token = login_response.json().get("token")

        url = f"{BASE_URL}/DeletePaymentMethodUser"
        headers = {"Authorization": f"Bearer {token}"}
        data = {"id": 1}  # Aquí debes usar un ID real de un método de pago

        response = requests.post(url, json=data, headers=headers)
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()