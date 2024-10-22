import unittest
import requests

BASE_URL = 'http://localhost:5000' 

class TestCompra(unittest.TestCase):

    CorreoUserCreated = ""
    PasswordUserCreated = ""
    LoginToken = ""
    LoginTipo = ""
    idProducto = 1
    idStock = 1

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

        #Crear Producto
        url = f"{BASE_URL}/AddProductTest"
        data_product = {
            "Nombre": "Producto Test",
            "Precio": 1000,
            "Descripcion": "Descripción del producto de prueba",
            "Imagen": "imagen_url",
            "Categoria": "Test",
            "Color": "Rojo",
            "stock": [
                {"Stock": 10, "Tamaño": "M"}
            ]
        }

        headers = {"Authorization": f"{response_login.json()['token']}", "tipo": f"{response_login.json()['tipo']}"}
        response_product = requests.post(url, json=data_product, headers=headers)
        # Guardar el ID del producto para usarlo en las pruebas

        self.CorreoUserCreated = data_signUp['Correo']
        self.PasswordUserCreated = data_signUp['Contraseña']
        self.LoginToken = response_login.json()['token']
        self.LoginTipo = response_login.json()['tipo']
        self.idProducto = response_product.json()["Producto"]["insertId"];
        self.idStock = response_product.json()["Stock"][0]["insertId"];
    
    @classmethod
    def tearDown(self):
        url = f"{BASE_URL}/deleteUser"
        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        response = requests.post(url, json={}, headers=headers)

        url = f"{BASE_URL}/DeleteProductTest"
        response = requests.post(url, json={'id': self.idProducto}, headers=headers)

        del self.CorreoUserCreated
        del self.PasswordUserCreated
        del self.LoginToken
        del self.LoginTipo
        del self.idProducto
        del self.idStock

    def test_AddCartNewProduct(self):
        url = f"{BASE_URL}/AddCart"
        data = {
            "StockID": self.idStock,
            "Cantidad": 1,
        }

        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        response = requests.post(url, json=data, headers=headers)
        
        #response_deleted = requests.post(f"{BASE_URL}/DeleteCart", json={"CarritoID": response.json()["results"]["insertId"]}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], 'Producto añadido al carrito')
        #self.assertEqual(response_deleted.status_code, 200)
    
    def test_AddCart0Quantity(self):
        url = f"{BASE_URL}/AddCart"
        data = {
            "StockID": self.idStock,
            "Cantidad": 0,
        }

        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        response = requests.post(url, json=data, headers=headers)

        #response_deleted = requests.post(f"{BASE_URL}/DeleteCart", json={"CarritoID": response.json()["results"]["insertId"]}, headers=headers)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()["message"], 'Cantidad del producto es 0')
        #self.assertEqual(response_deleted.status_code, 200)

    def test_UpdateCartNewProduct(self):
        url = f"{BASE_URL}/AddCart"
        data = {
            "StockID": self.idStock,
            "Cantidad": 1,
        }

        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        for i in range(0, 3):
            requests.post(url, json=data, headers=headers)
        
        response = requests.get(f"{BASE_URL}/GetCart", json=data, headers=headers)
        #response_deleted = requests.post(f"{BASE_URL}/DeleteCart", json={"CarritoID": response.json()[0]["CarritoID"]}, headers=headers)

        self.assertEqual(response.json()[0]['Cantidad'], 3)
        #self.assertEqual(response_deleted.status_code, 200)
    
    def test_AddCartModifyProduct(self):
        url = f"{BASE_URL}/AddCart"
        data = {
            "StockID": self.idStock,
            "Cantidad": 3,
        }

        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        response1 = requests.post(url, json=data, headers=headers)

        #se modifica la cantidad
        url = f"{BASE_URL}/ModifyQuantity"
        data = {
            "CarritoID": response1.json()["results"]["insertId"],
            "Cantidad": 7,
        }

        response2 = requests.post(url, json=data, headers=headers)
        response3 = requests.get(f"{BASE_URL}/GetCart", json=data, headers=headers)
        
        #response_deleted = requests.post(f"{BASE_URL}/DeleteCart", json={"CarritoID": response3.json()[0]["CarritoID"]}, headers=headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response1.json()["message"], 'Producto añadido al carrito')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.json()[0]['Cantidad'], 7)
        #self.assertEqual(response_deleted.status_code, 200)

    def test_PurchaseProduct(self):
        url = f"{BASE_URL}/AddCart"
        data = {
            "StockID": self.idStock,
            "Cantidad": 1,
        }

        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        response1 = requests.post(url, json=data, headers=headers)
        
        #Realizar Compra
        url = f"{BASE_URL}/MakeCompra"
        response2 = requests.post(url, json=data, headers=headers)

        #verificar registro en la tabla de compras
        url = f"{BASE_URL}/GetCompra"
        data = {
            "Codigo": response2.json()["Codigo_Compra"],
        }
        response2 = requests.get(url, json=data, headers=headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response1.json()["message"], 'Producto añadido al carrito')
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response2.status_code, 200)
    
    def test_PurchaseProductNoCart(self):
        headers = {"Authorization": f"{self.LoginToken}", "tipo": f"{self.LoginTipo}"}
        
        #Realizar Compra
        url = f"{BASE_URL}/MakeCompra"
        response2 = requests.post(url, json={}, headers=headers)
        self.assertEqual(response2.status_code, 500)
        self.assertEqual(response2.json()["message"], "No existen productos en el carrito")

if __name__ == "__main__":
    unittest.main()