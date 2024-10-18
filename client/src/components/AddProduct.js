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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setProductData({
            ...productData,
            Imagen: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // O sessionStorage

        const formData = new FormData();
        formData.append('Nombre', productData.Nombre);
        formData.append('Descripcion', productData.Descripcion);
        formData.append('Precio', productData.Precio);
        formData.append('Imagen', productData.Imagen);

        try {
            const response = await axios.post('http://localhost:5000/AgregarProducto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });
            setMessage('Producto agregado con éxito');
            console.log('Respuesta del servidor:', response);
        } catch (error) {
            setMessage('Error al agregar el producto');
            console.error('Error al enviar el formulario:', error);
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
