import unittest
import requests

BASE_URL = 'http://localhost:5000' 

class TestUserAPI(unittest.TestCase):
    
    @classmethod
    def tearDown(self):
        if hasattr(self, "LoginToken") and hasattr(self, "LoginTipo"):
            url = f"{BASE_URL}/deleteUser"
            headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
            
            response = requests.post(url, json={}, headers=headers)

            # Delete class-level attributes
            del self.LoginToken
            del self.LoginTipo

    def test_Register(self):
        url = f"{BASE_URL}/SignUp"
        data1 = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123",
            "ConfirmarContraseña": "Password123",
            "Direccion": "Calle 123",
            "Zip": "12345",
            "Ciudad": "Santiago"
        }

        response1 = requests.post(url, json=data1)

        url = f"{BASE_URL}/Login"
        data2 = {
            "Correo": "sebastian@example.com",
            "Contraseña": "Password123"
        }
        response2 = requests.post(url, json=data2)

        TestUserAPI.LoginToken = response2.json()['token']
        TestUserAPI.LoginTipo = response2.json()['tipo']

        url = f"{BASE_URL}/getUser"
        headers = {"Authorization": f"{response2.json()['token']}", "tipo": f"{response2.json()['tipo']}"}
        response3 = requests.get(url, headers=headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertTrue(response2.json()['tipo'] == 1 or response2.json()['tipo'] == 0)
        self.assertIn("token", response2.json())
        self.assertEqual(response3.status_code, 200)
        self.assertEqual(response3.json()[0]["Nombre"], data1["Nombre"])
        self.assertEqual(response3.json()[0]["Apellido"], data1["Apellido"])
        self.assertEqual(response3.json()[0]["Correo"], data1["Correo"])
        self.assertNotEqual(response3.json()[0]["Contraseña"], data1["Contraseña"])
        self.assertEqual(response3.json()[0]["Direccion"], data1["Direccion"])
        self.assertEqual(response3.json()[0]["ZIP"], data1["Zip"])
        self.assertEqual(response3.json()[0]["Ciudad"], data1["Ciudad"])

    def test_SignUp_NoPassword(self):
        url = f"{BASE_URL}/SignUp"
        data1 = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@example.com",
            "Contraseña": "",
            "ConfirmarContraseña": "",
            "Direccion": "Calle 123",
            "Zip": "12345",
            "Ciudad": "Santiago"
        }

        response1 = requests.post(url, json=data1)

        self.assertEqual(response1.status_code, 401)
        self.assertEqual(response1.json()['Contraseña'], 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número')
    
    def test_SignUp_ShortPassword(self):
        url = f"{BASE_URL}/SignUp"
        data1 = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@example.com",
            "Contraseña": "Pas1",
            "ConfirmarContraseña": "Pas1",
            "Direccion": "Calle 123",
            "Zip": "12345",
            "Ciudad": "Santiago"
        }

        response1 = requests.post(url, json=data1)

        self.assertEqual(response1.status_code, 401)
        self.assertEqual(response1.json()['Contraseña'], 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número')

    def test_SignUp_RepeatedEmail(self):
        url = f"{BASE_URL}/SignUp"
        data1 = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@mail.com",
            "Contraseña": "Password123",
            "ConfirmarContraseña": "Password123",
            "Direccion": "Calle 123",
            "Zip": "12345",
            "Ciudad": "Santiago"
        }

        response1 = requests.post(url, json=data1)
        response2 = requests.post(url, json=data1)

        url = f"{BASE_URL}/Login"
        data2 = {
            "Correo": "sebastian@mail.com",
            "Contraseña": "Password123"
        }
        response3 = requests.post(url, json=data2)

        self.assertTrue(response3.json()['tipo'] == 1 or response3.json()['tipo'] == 0)
        self.assertIn("token", response3.json())

        TestUserAPI.LoginToken = response3.json()['token']
        TestUserAPI.LoginTipo = response3.json()['tipo']

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 401)
        self.assertEqual(response2.json()['Correo'], 'Correo ya existe')


    def test_SignUp_NoEmail(self):
        url = f"{BASE_URL}/SignUp"
        data1 = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "",
            "Contraseña": "Password123",
            "ConfirmarContraseña": "Password123",
            "Direccion": "Calle 123",
            "Zip": "12345",
            "Ciudad": "Santiago"
        }

        response1 = requests.post(url, json=data1)

        self.assertEqual(response1.status_code, 401)
        self.assertEqual(response1.json()['Correo'], 'Email obligatorio')


class TestUserPaymentAPI(unittest.TestCase):
    @classmethod
    def setUp(self):
        #Crear usuario
        url = f"{BASE_URL}/SignUp"
        data_signUp = {
            "Nombre": "Sebastián",
            "Apellido": "Arrieta",
            "Correo": "sebastian@neon.com",
            "Contraseña": "Password123",
            "ConfirmarContraseña": "Password123",
            "Direccion": "Calle 123",
            "Ciudad": "Santiago",
            "Zip": "12345"
        }

        response_signUp = requests.post(url, json=data_signUp)

        url = f"{BASE_URL}/Login"
        data_login = {
            "Correo": "sebastian@neon.com",
            "Contraseña": "Password123"
        }
        response_login = requests.post(url, json=data_login)

        self.CorreoUserCreated = data_signUp['Correo']
        self.PasswordUserCreated = data_signUp['Contraseña']
        self.LoginToken = response_login.json()['token']
        self.LoginTipo = response_login.json()['tipo']
    
    @classmethod
    def tearDown(self):
        url = f"{BASE_URL}/deleteUser"
        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}

        response = requests.post(url, json={}, headers=headers)

        # Delete class-level attributes
        del self.LoginToken
        del self.LoginTipo

    def test_get_payment_method_user(self):
        # Aquí debes obtener un token válido de JWT primero, usando el login
        url = f"{BASE_URL}/getPaymentMethodUser"
        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}

        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # Verifica que el método de pago se devuelve como lista

    def test_post_delete_payment_method_user(self):
        # Obtener token
        url = f"{BASE_URL}/PostPaymentMethodUser"
        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        data = {
            "Nombre_Titular": "Sebastián Arrieta",
            "Numero_Tarjeta": "4111111111111111",
            "CVV": "123",
            "Fecha_Vencimiento": "12/25"
        }
        response1 = requests.post(url, json=data, headers=headers)
        self.assertEqual(response1.status_code, 200)

        url = f"{BASE_URL}/DeletePaymentMethodUser"
        data = {"id": response1.json()['insertId']}  # Aquí debes usar un ID real de un método de pago

        response2 = requests.post(url, json=data, headers=headers)
        self.assertEqual(response2.status_code, 200)

        

if __name__ == "__main__":
    unittest.main()