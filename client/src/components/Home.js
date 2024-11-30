import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [Products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        categoria: '',
        color: ''
    });

    // Fetch products from the API with filters applied
    const fetchProducts = useCallback(() => {
        const { categoria, color } = filters;
        console.log("Fetching products with filters:", { categoria, color });  // Log the filters being sent
        axios
            .get('http://localhost:5000/GetProduct', {
                params: {
                    categoria,
                    color
                }
            })
            .then(response => {
                console.log("Products fetched:", response.data);  // Log the fetched data
                setProducts(response.data);
            })
            .catch(error => {
                console.log("Error fetching products:", error);  // Log any error in fetching
            });
    }, [filters]); // Include filters as dependency for fetch

    // Fetch products when the component mounts and when filters change
    useEffect(() => {
        console.log("Filters have changed:", filters);  // Log when filters are updated
        fetchProducts();
    }, [filters,fetchProducts]); // Call fetchProducts when filters change

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(`Filter changed - ${name}: ${value}`);  // Log the change in filters
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const sideMenu = (
        <div className="col-md-3 p-4 d-flex flex-column" style={{ backgroundColor: 'white' }}>
            <div className="bg-light p-4" style={{ backgroundColor: 'white' }}>
                <h4 className = "text-white bg-dark">Filtrar Productos</h4>
                <div className="mb-3">
                    <label className="form-label">Categoria</label>
                    <select
                        className="form-select"
                        name="categoria"
                        onChange={handleFilterChange}
                        value={filters.categoria}
                    >
                        <option value="">Todas</option>
                        <option value="Polera">Poleras</option>
                        <option value="Polerones">Polerones</option>
                        <option value="Pantalones">Pantalones</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Color</label>
                    <select
                        className="form-select"
                        name="color"
                        onChange={handleFilterChange}
                        value={filters.color}
                    >
                        <option value="">Todos</option>
                        <option value="Negro">Negro</option>
                        <option value="Rojo">Rojo</option>
                        <option value="Blanco">Blanco</option>
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
            <div className="row">
                {sideMenu}
                <div className="row g-4 col-md-9">
                    <h2 className="text-center mb-4">Productos</h2>
                    {Products.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => goToProduct(item)}
                            className="col-sm-6 col-md-4 col-lg-3"
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            <div className="card h-100">
                                <img src={`data:image/jpeg;base64,${item.Imagen}`} className="card-img-top" alt={item.Nombre} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.Nombre}</h5>
                                    <p className="card-text">${item.Precio}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
