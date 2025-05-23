import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();

    const [Error, setError] = useState(null);
    const [CartItems, setCartItems] = useState([]);

    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipo');

    useEffect(() => {
        axios.get('http://localhost:5000/GetCart',{
            headers: {
              Authorization: `${token}`,
              tipo: `${tipo}`
            }
        })
        .then(response => {
            setCartItems(response.data);
            console.log(response.data);
        })
        .catch(error => {
            setError(error.response?.data?.error || 'An error occurred');
            console.log(error);
        });
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        axios.post('http://localhost:5000/ModifyQuantity', {
            Cantidad: parseInt(newQuantity),
            CarritoID: parseInt(id)
        },{
            headers: {
              Authorization: `${token}`,
              tipo: `${tipo}`
            }
        }).then(response => {
            const updatedCartItems = CartItems.map(item => 
                item.CarritoID === id ? { ...item, Cantidad: newQuantity } : item
            );
            setCartItems(updatedCartItems);
        })
        .catch(error => {
            setError(error.response?.data?.error || 'Ocurrio un error');
            console.log(error);
        });
    };

    const handleRemoveItem = (id) => {
        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        axios.post('http://localhost:5000/DeleteCart', {
            CarritoID: parseInt(id)
        },{
            headers: {
              Authorization: `${token}`,
              tipo: `${tipo}`
            }
        })
        .then(() => {
            const updatedCartItems = CartItems.filter(item => item.CarritoID !== id);
            setCartItems(updatedCartItems);
        })
        .catch(error => {
            setError(error.response?.data?.error || 'No se pudo eliminar el producto del carrito');
            console.log(error);
        });
    };

    // Function to calculate total price
    const calculateTotalPrice = () => {
        return CartItems.reduce((total, item) => {
            return total + (item.Precio * item.Cantidad);
        }, 0);
    };

    const goToPayments = (item) => {
        navigate(`/Payments`, { state: { item } });
    };

    return (
        <div className="container-fluid py-5">
            <ErrorMessage message={Error}/>
            <div className="container">
                <h1 className="my-4">Carrito de Compras</h1>
                
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Color</th>
                            <th>Tamaño</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Cantidad</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CartItems.map(item => (
                            <tr key={item.CarritoID}>
                                <td>{item.Nombre}</td>
                                <td>{item.Color}</td>
                                <td>{item.tamaño}</td>
                                <td>{item.Precio} $</td>
                                <td>{item.Stock}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.Cantidad}
                                        min="1"
                                        max={item.Stock}
                                        onChange={(e) => handleQuantityChange(item.CarritoID, e.target.value)}
                                        className="form-control"
                                        style={{ width: '80px', textAlign: 'center' }}/>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleRemoveItem(item.CarritoID)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="d-flex justify-content-end">
                    <h4>Total: {calculateTotalPrice()} $</h4>
                </div>

                <button onClick={() => goToPayments(CartItems)} className="mt-4 btn btn-primary" id="pago">
                    Proceder al Pago
                </button>
            </div>
        </div>
    );
};

export default Cart;
