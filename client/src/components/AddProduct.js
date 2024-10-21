import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Imagen: null,
    });

    const [message, setMessage] = useState('');

    // Handle input change for text fields (Nombre, Descripcion, Precio)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    // Handle image file change
    const handleImageChange = (e) => {
        setProductData({
            ...productData,
            Imagen: e.target.files[0], // Append the image file
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        console.log("handleSubmit started");
        e.preventDefault();

        const token = localStorage.getItem('token'); // Fetch token from localStorage
        if (!token) {
            setMessage('Error: No se encontró un token de autenticación');
            return;
        }
        console.log("Token fetched:", token);

        // Create a FormData object to send multipart form data
        const formData = new FormData();
        formData.append('Nombre', productData.Nombre);
        formData.append('Descripcion', productData.Descripcion);
        formData.append('Precio', productData.Precio);
        formData.append('Imagen', productData.Imagen); // Append image file

        console.log("FormData created");

        try {
            // Send a POST request to add the product
            const response = await axios.post('http://localhost:5000/AddProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Added 'Bearer' prefix for token
                },
            });
            console.log("Product added successfully");

            // Update the UI with a success message
            setMessage('Producto agregado con éxito');
            console.log('Server response:', response);
        } catch (error) {
            console.error('Error while adding product:', error);

            // Show error message on the UI
            setMessage('Error al agregar el producto');
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre del Producto</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Nombre"
                        value={productData.Nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="Descripcion"
                        value={productData.Descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Precio"
                        value={productData.Precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Imagen del Producto</label>
                    <input
                        type="file"
                        className="form-control"
                        name="Imagen"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Producto</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default AddProduct;
