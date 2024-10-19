import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const Payments = () => {
    const location = useLocation();
    const [items, setItems] = useState([])

    const [user, setUser] = useState({});
    const [card, setCard] = useState({
        Nombre_Titular: '',
        Numero_Tarjeta: '',
        Fecha_Vencimiento: '',
        CVV: ''
    });

    const [selectedCard, setSelectedCard] = useState(null);

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showPayForm, setShowPayForm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [AddSuccess, setAddSuccess] = useState(false);

    const [error, setError] = useState({});

    const completeForm = (e) => {
        const { name, value } = e.target;
        setCard(prevDatos => ({
            ...prevDatos,
            [name]: value
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        axios.get('http://localhost:5000/GetCart',{
            headers: {
                Authorization: `${token}`,
                tipo: `${tipo}`
            }
        })
        .then(response => {
            setItems(response.data);
            console.log(response.data);
        })
        .catch(error => {
            setError(error.response?.data?.error || 'An error occurred');
            console.log(error);
        });


        axios.get('http://localhost:5000/getUser', {
            headers: {
                'Authorization': `${token}`,
                'tipo': `${tipo}`
            }
        })
        .then(response => {
            setUser(response.data[0]);
        })
        .catch(err => {
            setError(err.response?.data?.error || 'An error occurred');
            console.log(err);
        });

        axios.get('http://localhost:5000/getPaymentMethodUser', {
            headers: {
                'Authorization': `${token}`,
                'tipo': `${tipo}`
            }
        })
        .then(response => {
            setPaymentMethods(response.data);
            if(response.data.length > 0){
                setSelectedCard(response.data[0].id)
            }
        })
        .catch(err => {
            setError(err.response?.data?.error || 'An error occurred');
            console.log(err);
        });
    }, []);

    const calculateTotalPrice = () => {
        return items.reduce((total, item) => {
            return total + (item.Precio * item.Cantidad);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        try {
            const response = await axios.post('http://localhost:5000/PostPaymentMethodUser', card, {
                headers: {
                    'Authorization': `${token}`,
                    'tipo': `${tipo}`
                }
            });
            
            setLoading(false);
            setShowPayForm(false)
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data || "Ocurrio un error");
            setLoading(false);
            console.log(error)
        }
    };

    const handleRealizarCompra = async () =>{
        setError({});
        setLoading(true);

        if(selectedCard === null){
            setLoading(false)
            return setError("Metodo de pago no seleccionado")
        }

        const token = localStorage.getItem('token');
        const tipo = localStorage.getItem('tipo');

        try {
            const response = await axios.post('http://localhost:5000/MakeCompra', {}, {
                headers: {
                    'Authorization': `${token}`,
                    'tipo': `${tipo}`
                }
            });
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data || "Ocurrio un error");
            setLoading(false);
            console.log(error)
        }
    }

    const hideError = async () => {
        setError({})
    }

    const makePaymentForm = (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="Nombre_Titular" className="form-label">Nombre del titular</label>
                <input
                    type="text"
                    id="Nombre_Titular"
                    name="Nombre_Titular"
                    className={`form-control ${error.Nombre_Titular ? 'is-invalid' : ''}`}
                    value={card.Nombre_Titular}
                    onChange={completeForm}
                />
                {error.Nombre_Titular && <div className="invalid-feedback">{error.Nombre_Titular}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="Numero_Tarjeta" className="form-label">Número de Tarjeta</label>
                <input
                    type="text"
                    id="Numero_Tarjeta"
                    name="Numero_Tarjeta"
                    className={`form-control ${error.Numero_Tarjeta ? 'is-invalid' : ''}`}
                    value={card.Numero_Tarjeta}
                    onChange={completeForm}
                    placeholder="1111111111111111"
                />
                {error.Numero_Tarjeta && <div className="invalid-feedback">{error.Numero_Tarjeta}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="Fecha_Vencimiento" className="form-label">Fecha de Vencimiento</label>
                <input
                    type="text"
                    id="Fecha_Vencimiento"
                    name="Fecha_Vencimiento"
                    className={`form-control ${error.Fecha_Vencimiento ? 'is-invalid' : ''}`}
                    value={card.Fecha_Vencimiento}
                    onChange={completeForm}
                    placeholder="MM/YY"
                />
                {error.Fecha_Vencimiento && <div className="invalid-feedback">{error.Fecha_Vencimiento}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="CVV" className="form-label">CVV</label>
                <input
                    type="password"
                    id="CVV"
                    name="CVV"
                    className={`form-control ${error.CVV ? 'is-invalid' : ''}`}
                    value={card.CVV}
                    onChange={completeForm}
                />
                {error.CVV && <div className="invalid-feedback">{error.CVV}</div>}
            </div>

            <button type="submit" className="btn btn-primary mx-2">Guardar Método de Pago</button>
            <button onClick={() => {setShowPayForm(false)}} className="btn btn-danger">Cancelar</button>
            {AddSuccess && <div style={{ width: '200px', textAlign: 'center' }} className="alert alert-info fs-6 mt-1" role="alert">Metodo de pago añadido</div>}
        </form>
    );

    return (
        <div className="container py-5">
            {typeof error === 'string' && <ErrorMessage message={error} onClose={hideError}/>}
            {loading && <Loading message={loadingMessage} />}
            <div className='row justify-content-center'>
                <h1 className="my-4 text-center">Resumen de la orden</h1>
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

                <div className="d-flex justify-content-end">
                    <h4>Total: {calculateTotalPrice()} $</h4>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-md-6 text-center'>
                    <h1 className="my-4">Dirección de Envío</h1>
                    <div className='bg-light p-4 rounded shadow-sm'>
                        <p className="mb-2"><strong>Dirección:</strong> {user.Direccion}</p>
                        <p><strong>Código Postal:</strong> {user.ZIP}</p>
                    </div>
                </div>
            </div>
            <div className='row justify-content-center'>
                <h1 className="my-4 text-center">Elegir un método de pago</h1>
                <div className="row">
                    {paymentMethods.map(item => (
                        <div className="col-md-4 mb-4" key={item.id}>
                            <div className="card h-100">
                                <div className={`card-header ${item.id === selectedCard ? "bg-primary text-white" : ''}`}>
                                    {item.Nombre_Titular}
                                </div>
                                <div className="card-body">
                                    <p className="card-text">**** **** **** {item.Numero_Tarjeta}</p>
                                    {item.id === selectedCard ? 
                                    (<p><strong>Tarjeta Seleccionada</strong></p>) : 
                                    (<a 
                                        href="#" 
                                        className="btn btn-primary" 
                                        onClick={(e) => { 
                                          e.preventDefault(); // Call preventDefault as a function
                                          setSelectedCard(item.id); 
                                        }}
                                      >
                                        Seleccionar
                                      </a>)}
                                </div>
                            </div>
                        </div>
                    ))}

                        <div className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <a onClick={() => {setShowPayForm(true)}} className="btn btn-primary">Añadir un nuevo metodo de pago</a>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {showPayForm && makePaymentForm}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center align-items-center my-3">
                <button onClick={handleRealizarCompra} type="submit" className="btn btn-success btn-lg my-2" style={{ padding: '15px 30px' }}>
                    Realizar Compra
                </button>
            </div>
        </div>
    );
}

export default Payments;
