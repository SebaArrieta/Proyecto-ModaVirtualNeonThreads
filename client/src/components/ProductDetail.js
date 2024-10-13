import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    
    const item = location.state['item'];
    
    const [Stock, setStock] = useState(null)

    const [Select, setSelect] = useState(null)

    const [Error, setError] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:5000/GetStock',{
            params: {ProductosId: item["id"]}
        })
        .then(response => {
            setStock(response.data)
            setSelect(response.data[0])
        })
        .catch(error => {
            setError(error.response.data.error)
            console.log(error)
        });
    }, [])

    const handleSizeChange = (e) => {
        const selectedItemId = e.target.value;
        const selectedItem = Stock.find(item => item.id === parseInt(selectedItemId)); 
        setSelect(selectedItem);
    };

    return (
        <div className="container py-5">
            <ErrorMessage message={Error}/>
            <div className='row'>
                <div className='row g-4 col-md-4'>
                    <img src={`data:image/jpeg;base64,${item["Imagen"]}`} className="rounded img-fluid mx-auto" alt="Product 1"/>
                </div>
                <div className='row g-4 col-md-6 ms-auto py-5 h-75'>
                    <p className="fs-2 fw-bold">{item["Nombre"]}</p>

                    <div className = "mt-auto">
                        <p className="fs-4 mt-1">Precio: {item["Precio"]}$</p>
                        <p className="fs-4 mt-1">Stock: {Select ? Select["Stock"] : 0}</p>
                        <select className="fs-4 mt-1" value={Select ? Select.id : ''} onChange={handleSizeChange}>
                            {Stock ? Stock.map((item) => (
                                item.Stock > 0 && (
                                    <option key={item.id} value={item.id}>
                                        {item.Tamaño}
                                    </option>
                                )
                            )): null}
                        </select>
                    </div>

                    <div className = "mt-5">
                        <button className="fs-4 col-md-6">Agregar al carrito</button>
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