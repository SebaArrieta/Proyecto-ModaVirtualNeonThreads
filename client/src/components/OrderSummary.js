import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const Payments = () => {
    const [searchParams] = useSearchParams();

    const [codigo, setCodigo] = useState(null);
    const [items, setItems] = useState([])

    const [error, setError] = useState({});

    useEffect(() => {
        const codigoParam = searchParams.get('codigo') || "";

        if (codigoParam.length > 0) {
            setCodigo(codigoParam);
        }else{
            setError("No se encuentra el código de compra")
            return
        }

        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        axios.get('http://localhost:5000/GetCompra', {
            params: {
                Codigo: codigoParam
            },
            headers: {
                Authorization: `${token}`,
                tipo: `${tipo}`
            }
        })
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            setError(error.response?.data?.error || 'Ocurrio un Error');
        });
    }, [searchParams]);

    const calculateTotalPrice = () => {
        return items.reduce((total, item) => {
            return total + (item.Precio * item.Cantidad);
        }, 0);
    };

    const hideError = async () => {
        setError({})
    }

    return (
        <div className="container py-5">
            {typeof error === 'string' && <ErrorMessage message={error} onClose={hideError}/>}
            <div className='row justify-content-center'>
                <h1 className="my-4 text-center">Resumen de la Compra</h1>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Color</th>
                            <th>Tamaño</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.CarritoID}>
                                <td>{item.Nombre}</td>
                                <td>{item.Color}</td>
                                <td>{item.tamaño}</td>
                                <td>{item.Precio} $</td>
                                <td>{item.Stock}</td>
                                <td>{item.Cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='row justify-content-center'>
                    <h4>Precio Total: {calculateTotalPrice()} $</h4>
                    <h4>Codigo de la compra: {codigo}</h4>
                </div>


                <h1 className="text-center my-5 text-success">COMPRA REALIZADA CON ÉXITO</h1>

            </div>
        </div>
    );
}

export default Payments;
