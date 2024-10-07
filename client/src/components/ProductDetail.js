import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    
    const item = location.state['item'];
    console.log(item)

    const handleComprar = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // O sessionStorage

        try {
            const response = await axios.get('http://localhost:5000/Comprar', {
                headers: {
                  Authorization: `${token}`,
                }
            });
            console.log("Respuesta del servidor:", response);
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }
    };

    return (
        <div className="container py-5">
            <div className='row'>
                <div className='row g-4 col-md-4'>
                    <img src={`data:image/jpeg;base64,${item["Imagen"]}`} className="rounded img-fluid mx-auto" alt="Product 1"/>
                </div>
                <div className='row g-4 col-md-6 ms-auto py-5 h-75'>
                    <p className="fs-2 fw-bold">{item["Nombre"]}</p>

                    <div className = "mt-auto">
                        <p className="fs-4 mt-1">Precio: {item["Precio"]}$</p>
                        <p className="fs-4 mt-1">Stock: 0</p>
                    </div>

                    <div className = "mt-auto">
                        <button className="fs-4 col-md-6">Agregar al carrito</button>
                        <button className="fs-4 col-md-6" onClick={handleComprar}>Comprar</button>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='row g-4 col-md-12'>
                    <p>{item["Descripcion"]}</p>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;