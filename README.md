# Documentación del Proyecto

# Guía de Instalación

### 1. Ejecutar el programa y las pruebas

Una vez que la base de datos esté activa, puedes proceder a ejecutar el programa y las pruebas unitarias utilizando los siguientes comandos en la terminal:

- `make run` ejecuta el programa
- `make Compra_test` ejecuta las pruebas del modulo de compra

Desde la carpeta test puedes ejecutar `npm test` para las pruebas de ProductController

# 1. Alcances de la Herramienta

Este proyecto utiliza **unittest** como herramienta de pruebas unitarias para garantizar la calidad y el correcto funcionamiento de las funcionalidades desarrolladas. Unittest permite validar el comportamiento esperado de los diferentes módulos de la aplicación de manera aislada, detectando errores o desviaciones en las distintas etapas del desarrollo.

Este proyecto también utiliza **Jest** como herramienta de pruebas unitarias para garantizar la calidad y el correcto funcionamiento de las funcionalidades desarrolladas. Jest permite validar el comportamiento esperado de los diferentes módulos de la aplicación de manera aislada, detectando errores o desviaciones en las distintas etapas del desarrollo.

# 2. Descripción del Trabajo Realizado

## Proyecto
El proyecto realizado consiste en una tienda de ropa en línea en la que se abordaron una serie de requerimientos como el despliegue de productos en la página para su visualización, también se desarrolló un carrito de compras y un sistema de autenticación, entre otros requerimientos.

La metodología de trabajo fue la asignación de tareas en jira que se iban desarrollando por etapas hasta completarlas, de igual forma el flujo de trabajo consistió en la utilización de GitFlow para integrar el progreso obtenido. Un canal de comunicación utilizado fue Slack que integrado con GitHub y Jira nos permitió hacer un seguimiento de la aplicación y a su vez se realizaban reuniones en línea para evaluar el progreso y asignar nuevas tareas.

## Jira
![image](https://github.com/user-attachments/assets/0983aa7a-9ba8-401d-98bf-4c7e49ed7e82)
## Slack
![image](https://github.com/user-attachments/assets/ca1f9ef4-88b4-4471-b62f-e1d63b2a5774)
## Ramas de GitFlow
![image](https://github.com/user-attachments/assets/0a555cd3-c4d6-4b0e-981e-b7ffbaab6e98)

Ademas en etapas tempranas del proyecto realizamos diseños iniciales de como prodria verse la aplicacion y tambien realizamos diagramas que para modelar las bases de datos, todo esto con el proposito de tener una idea inicial sobre como iniciar el desarrollo

## Esquemas de diseño
![image](https://github.com/user-attachments/assets/5ac36f3d-d1dd-49f0-9646-6c98a896a357)
![image](https://github.com/user-attachments/assets/dc7e9666-1948-4564-8127-2014078ca677)

## Modelado de bases de datos
![image](https://github.com/user-attachments/assets/6286cd7f-f1c8-44e1-98a5-1b5e35f49106)

## Especificar dependencias entre la herramienta y la aplicación
La infraestructura del proyecto consiste en un front-end desarrollado con React que se comunica con un servidor en el Back-end de la aplicación realizado con Node.js, de igual forma, para el almacenamiento de recursos y bases de datos se utilizaron servicios de aws como RDS o Buckets S3.

Las pruebas unitarias se desarrollan en un entorno independiente de la aplicación, estas consisten principalmente en probar los distintos resultados obtenidos de los endpoints del servidor en Node.js, no existen dependencias adicionales entre la aplicación y las pruebas excepto de que la aplicación debe estar ejecutándose localmente para ser accedida desde los enlaces del localhost y además la instancia de RDS debe estar ejecutándose.

# 3. Pruebas

## Estrategia de pruebas utilizadas

Cada uno de los archivos que contienen las pruebas se encargan de realizar un proceso de testing de las funcionalidades más importantes de los principales módulos de la aplicación, estos módulos probados son los de usuarios, compra y productos, adicionalmente se iran realizando mas pruebas en las siguientes entregas.

Las condiciones de cada prueba, como el tener un usuario autenticado, se estructuran de manera automática antes de iniciar con el proceso y cuando este termina se eliminan todo nuevo registro en la base de datos a utilizar en las pruebas para dejar al sistema en el estado anterior al testing de las componentes.

## Procedimiento de ejecución de pruebas

Para la ejecución de las pruebas, se utilizaron extensiones de Visual Studio Code, las cuales proporcionan un entorno cómodo y eficiente, junto con una interfaz visual para la ejecución y visualización de los resultados. Estas herramientas permiten realizar las pruebas de manera rápida e intuitiva dentro del propio IDE.

Imagen de la interfaz de Visual Studio Code
![image](https://github.com/user-attachments/assets/f49f9428-f143-4597-b415-a30d5001b7b9)

Alternativamente, las pruebas también pueden ejecutarse desde la terminal utilizando el siguiente comando de Python

`python -m unittest test_example.py`

De igual modo, desde la carpeta test las pruebas que utilizen jest pueden ejecutarse con el comando

`npm test`

## Resultados: pruebas de Carrito de Compras

### Prueba 1.1: Añadir un nuevo producto al carrito

- **Descripción**: Añadir un nuevo producto al carrito virtual del usuario. Este producto será eliminado del carrito al finalizar la prueba.
- **Entradas**: Credenciales del usuario creado para las pruebas, ID del producto a agregar y cantidad a agregar.
- **Salida esperada**: Una respuesta con estatus 200 y un mensaje del tipo "Producto añadido al carrito".
- **Salida obtenida**: `test_AddCartNewProduct (Compra_test.TestCompra.test_AddCartNewProduct)` ... **OK**.

---

### Prueba 1.2: Añadir un producto con cantidad igual a 0

- **Descripción**: Añadir un nuevo producto al carrito virtual del usuario con una cantidad igual a 0.
- **Entradas**: Credenciales del usuario creado para las pruebas, ID del producto a agregar y cantidad igual a 0.
- **Salida esperada**: Una respuesta con estatus 500 y un mensaje del tipo "Cantidad del producto es 0".
- **Salida obtenida**: `test_AddCart0Quantity (Compra_test.TestCompra.test_AddCart0Quantity)` ... **FAIL**.
  - **Error**: AssertionError: 200 != 500.

---

### Prueba 1.3: Actualizar cantidad de producto en el carrito

- **Descripción**: Actualizar la cantidad de un producto ya añadido al carrito.
- **Entradas**: Credenciales del usuario creado para las pruebas, ID del producto a actualizar y cantidad igual a 1.
- **Salida esperada**: Una respuesta con estatus 200 y que la cantidad actualizada sea igual a 3.
- **Salida obtenida**: `test_UpdateCartNewProduct (Compra_test.TestCompra.test_UpdateCartNewProduct)` ... **OK**.

---

### Prueba 1.4: Modificar cantidad de producto en el carrito

- **Descripción**: Modificar la cantidad de un producto en el carrito virtual.
- **Entradas**: Credenciales del usuario creado para las pruebas, ID del producto a actualizar, pasando la cantidad de 3 a 7.
- **Salida esperada**: Una respuesta con estatus 200 en cada procedimiento realizado.
- **Salida obtenida**: `test_AddCartModifyProduct (Compra_test.TestCompra.test_AddCartModifyProduct)` ... **OK**.

---

### Prueba 1.5: Probar compra de un producto

- **Descripción**: Añadir un producto al carrito, luego realizar la compra y verificar que se haya añadido a la tabla de compras.
- **Entradas**: Credenciales del usuario creado para las pruebas, ID y cantidad del producto a agregar al carrito.
- **Salida esperada**: Una respuesta con estatus 200 y que la cantidad actualizada sea igual a 7.
- **Salida obtenida**: `test_PurchaseProduct (Compra_test.TestCompra.test_PurchaseProduct)` ... **OK**.

---

### Prueba 1.6: Registrar un usuario
- **Descripción**: Registrar un usuario y comparar los datos ingresados con los almacenados en la bd.
- **Entradas**: datos de un usuario.
- **Salida esperada**: Una respuesta que muestra que los datos ingresados son los mismos que los almacenados en la bd, una excepción a esto es que la contraseña no debe ser la misma porque esta debe estar encriptada.
- **Salida obtenida**: test_Register (User_test.TestUserAPI.test_Register) ... ok.
  - **Resultado**: los datos coinciden.

---

### Prueba 1.7: Registrar un usuario sin contraseña
- **Descripción**: Registrar un usuario sin ingresar una contraseña.
- **Entradas**: datos del usuario con la contraseña vacia.
- **Salida esperada**: 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número'.
- **Salida obtenida**: test_SignUp_NoPassword (User_test.TestUserAPI.test_SignUp_NoPassword) ... ok
  - **Resultado**: No se permitio el registro al no tener una contraseña
  
---

### Prueba 1.8: Registrar un usuario con una contraseña corta
- **Descripción**: Registrar un usuario con una contraseña de un largo menor a los 5 caracteres exigidos.
- **Entradas**: datos del usuario con la contraseña sin cumplir con los requerimientos.
- **Salida esperada**: 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número'.
- **Salida obtenida**: test_SignUp_NoPassword (User_test.TestUserAPI.test_SignUp_NoPassword) ... ok
  - **Resultado**: No se permitio el registro al tener una contraseña muy corta
  
---

### Prueba 1.9: Registrar un usuario con un email ya existente
- **Descripción**: Registrar un usuario con un email existente en la bd.
- **Entradas**: datos del usuario con un email repetido.
- **Salida esperada**: 'Correo ya existe'.
- **Salida obtenida**: test_SignUp_RepeatedEmail (User_test.TestUserAPI.test_SignUp_RepeatedEmail) ... ok
  - **Resultado**: No se permitio el registro debido a que ya existe dicho email
  
---

### Prueba 1.10: Registrar un usuario con un email vacio
- **Descripción**: Registrar un usuario sin email.
- **Entradas**: datos del usuario sin email.
- **Salida esperada**: 'Email obligatorio'.
- **Salida obtenida**: test_SignUp_NoEmail (User_test.TestUserAPI.test_SignUp_NoEmail) ... ok
  - **Resultado**: No se permitio el registro debido a que no ingreso el email
  
---

### Prueba 1.11: Obtener un metodo de pago
- **Descripción**: dado el usuario registrado se deben pbtener sus metodos de pago.
- **Entradas**: credenciales del usuario registrado.
- **Salida esperada**: Una lista con los metodos de pago.
- **Salida obtenida**: test_get_payment_method_user (User_test.TestUserPaymentAPI.test_get_payment_method_user) ... ok
  - **Resultado**: Se obtuvo una lista con los metodos de pago
  
---

### Prueba 1.12: Registrar y eliminar un metodo de pago
- **Descripción**: Registrar un nuevo metodo de pago y eliminarlo segun el id.
- **Entradas**: credenciales del usuario y el id del nuevo metodo de pago creado.
- **Salida esperada**: El id del nuevo metodo de pago y un status 200 en la eliminación.
- **Salida obtenida**: test_post_delete_payment_method_user (User_test.TestUserPaymentAPI.test_post_delete_payment_method_user) ... ok
  - **Resultado**: Se creo y elimino el nuevo metodo de pago.
  
---

# 4. Problemas encontrados y soluciones

Un problema recurrente fue el de encontrar una solución para diferenciar las cuentas de los modistas que tienen permisos de administrador de los usuarios normales, para esto se asumió que como en el contexto del problema este desarrollo va dirigido a una tienda, esta posee su propio dominio de correos electrónicos que se les otorga a los modistas, por lo que cada usuario cuyo correo termine en @neon.com podrá acceder a las funcionalidades extra de la página.

Otro problema encontrado fue el de procesar los pagos, para propósitos de esta entrega solo se realizó una simulación de cómo se verían estos en el que el usuario debe ingresar un método de pago y luego la página se encarga de validar el formato de los datos y generar un código de compra.
