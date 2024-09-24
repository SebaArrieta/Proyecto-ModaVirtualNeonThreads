import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [Products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/GetProduct')
        .then(response => {
            setProducts(response.data)
        })
        .catch(error => {
            console.log(error)
        });
    }, [])

    const sideMenu = (
        <div className="col-md-3 p-4 d-flex flex-column" style={{ backgroundColor: 'white' }}>
            <div className="bg-light p-4" style={{ backgroundColor: 'white' }}>
                <h4>Filter Products</h4>
                <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <select className="form-select">
                        <option value="electronics">Poleras</option>
                        <option value="fashion">Polerones</option>
                        <option value="books">Pantalones</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Color</label>
                    <select className="form-select">
                        <option value="0-50">Negro</option>
                        <option value="51-100">Rojo</option>
                        <option value="101-200">blanco</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const goToProduct = (item) => {
        navigate(`/product`, { state: { item } });
    };

    return (
        <div className="container-fluid py-5">
            <div className = "row">
                {sideMenu}
                <div className="row g-4 col-md-9">
                <h2 className="text-center mb-4">Productos</h2>
                {/* Product Card 1 */}
                {Products.map((item, index) => (
                    <div onClick={() => goToProduct(item)} className="col-sm-6 col-md-4 col-lg-3" href="#" style={{ textDecoration: 'none', color: 'black'}}>
                        <div className="card h-100">
                            <img src={`data:image/jpeg;base64,${item["Imagen"]}`} className="card-img-top" alt="Product 1"/>
                            <div className="card-body">
                                <h5 className="card-title">{item["Nombre"]}</h5>
                                <p className="card-text">${item["Precio"]}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            
        </div>
    )
}

export default Home;