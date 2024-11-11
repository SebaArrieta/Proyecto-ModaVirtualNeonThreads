import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Categoria: '',
        Color: '',
        Tamaño: '',
        Stock: '',        
        Imagen: null,
    });

    const category_options = [
        { value: 'Poleras', label: 'Poleras' },
        { value: 'Polerones', label: 'Polerones' },
        { value: 'Pantalones', label: 'Pantalones' }
    ];

    const color_options = [
        { value: 'Negro', label: 'Negro' },
        { value: 'Rojo', label: 'Rojo' },
        { value: 'Blanco', label: 'Blanco' }
    ];

    const size_options = [
        { value: 'L', label: 'L' },
        { value: 'M', label: 'M' },
        { value: 'S', label: 'S' }
    ];

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

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Error: No se encontró un token de autenticación');
            return;
        }

        const formData = new FormData();
        formData.append('Nombre', productData.Nombre);
        formData.append('Descripcion', productData.Descripcion);
        formData.append('Precio', productData.Precio);
        formData.append('Imagen', productData.Imagen);
        formData.append('Categoria', productData.Categoria); 
        formData.append('Color', productData.Color);
        formData.append('Tamaño', productData.Tamaño);
        formData.append('Stock', productData.Stock);


        try {
            const response = await axios.post('http://localhost:5000/AddProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setMessage('Producto agregado con éxito');
        } catch (error) {
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
                <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                        className="form-control"
                        name="Categoria"
                        value={productData.Categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {category_options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Color</label>
                    <select
                        className="form-control"
                        name="Color"
                        value={productData.Color}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un color</option>
                        {color_options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tamaño</label>
                    <select
                        className="form-control"
                        name="Tamaño"
                        value={productData.Tamaño}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un tamaño</option>
                        {size_options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Stock"
                        value={productData.Stock}
                        onChange={handleChange}
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
