# Documentación del Proyecto

## 1. Alcances de la Herramienta

Este proyecto utiliza **unittest** como herramienta de pruebas unitarias para garantizar la calidad y el correcto funcionamiento de las funcionalidades desarrolladas. Unittest permite validar el comportamiento esperado de los diferentes módulos de la aplicación de manera aislada, detectando errores o desviaciones en las distintas etapas del desarrollo.

## 2. Descripción del Trabajo Realizado

# Proyecto
El proyecto realizado consiste en una tienda de ropa en linea en la que se abordaron una serie de requerimientos como el despliegue de productos en la pagina para su visualización, tambien se desarrollo un carrito de compras y un sistema de autenticación, entre otros requerimientos.

La metodologia de trabajo fue la asignacion de tareas en jira que se iban desarrollando por etapas hasta completarlas, de igual forma el flujo de trabajo consistio en la utilizacion de GitFlow para integrar el progreso obtenido. Un canal de comunicación utilizado fue Slack que integrado con GitHub y Jira nos permitia hacer un seguimiento de la aplicacion y a su vez se realizaban reuniones en linea para evaluar el progreso y asignar nuevas tareas.

# Jira
![image](https://github.com/user-attachments/assets/0983aa7a-9ba8-401d-98bf-4c7e49ed7e82)
# Slack
![image](https://github.com/user-attachments/assets/ca1f9ef4-88b4-4471-b62f-e1d63b2a5774)
# Ramas de GitFlow
![image](https://github.com/user-attachments/assets/0a555cd3-c4d6-4b0e-981e-b7ffbaab6e98)

# Especificar dependencias entre la herramienta y la aplicación
La infraestructura del proyecto consiste en un front-end desarrollado con React que se comunica con un servidor en el Back-end de la aplicación realizado con Node.js, de igual forma, para el almacenamiento de recursos y bases de datos se uilizaron servicios de aws como RDS o Buckets S3, las credenciales estan disponibles en el archivo .env para propocitos de la entrega aunque estas deberian ser privadas.

Las pruebas unitarias se desarrollan en un entorno independiente de la aplicación, estas consisten principalmente en probar los distintos resultados obtenidos de los endpoints del servidor en Node.js, no existen dependencias adicionales con entre la aplicacion y las pruebas excepto de que la aplicacion debe estar ejecutandose localmente para ser accedida desde los enlaces del localhost y ademas la instancia de RDS debe estar ejecutandose.

## 3. Pruebas

# Estrategia de pruebas utilizadas

Cada uno de los archivos que contienen las pruebas se encargan de realizar un proceso de testing de las funcionalidades mas importantes de los principales modulos de la aplicación, estos modulos probados son los de usuarios, compra y productos.

Pruebas del modulo de compra:

1. 

## 4. Dependencias entre la Herramienta y la Aplicación

La herramienta de pruebas unitarias **unittest** se utiliza para verificar las funcionalidades implementadas en los módulos de la aplicación. No existen dependencias externas adicionales, pero es necesario contar con un entorno donde Python esté correctamente instalado. Las dependencias específicas del proyecto se manejan a través de un archivo `requirements.txt` donde se incluyen las librerías adicionales utilizadas por la aplicación y las pruebas.

```bash
pip install -r requirements.txt
