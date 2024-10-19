import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [Datos, setDatos] = useState({
        Nombre: "",
        Apellido: "",
        Correo: "",
        Contraseña: "",
        ConfirmarContraseña: "",
        Direccion: "",
        Zip: "",
        Ciudad: ""
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const completeForm = (e) => {
        const { name, value } = e.target;
        setDatos(prevDatos => ({
            ...prevDatos,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        setLoading(true)

        try {
            const response = await axios.post('http://localhost:5000/SignUp', Datos);
            console.log("Respuesta del servidor:", response);

            if(Datos.Correo.match(/(?<=@)[\w.-]+/)[0] === "neon.com"){
                setLoadingMessage("Comprobando la existencia de la dirección de correo en las bases de datos...")
            }

            const timeoutId = setTimeout(() => {
                navigate(`/Login`);
            }, 3000);

            return () => clearTimeout(timeoutId);
            
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            if (error.response) {
                setErrors(error.response.data);
            } 
            setLoading(false)
        }
    };

    const hideError = async () => {
        setErrors({})
    }

    return (
        <div className="container">
            {loading ? (
                <Loading message = {loadingMessage}/>
            ) : (
            <div className="row justify-content-center" style={{ marginTop: '10%' }}>
                <form className="col-md-7" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputNombre">Nombre</label>
                            <input
                                type="text"
                                className={`form-control ${errors.Nombre ? 'is-invalid' : ''}`}
                                id="inputNombre"
                                name="Nombre"
                                value={Datos.Nombre}
                                onChange={completeForm}
                            />
                            {errors.Nombre && <div className="invalid-feedback">{errors.Nombre}</div>}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputApellido">Apellido</label>
                            <input
                                type="text"
                                className={`form-control ${errors.Apellido ? 'is-invalid' : ''}`}
                                id="inputApellido"
                                name="Apellido"
                                value={Datos.Apellido}
                                onChange={completeForm}
                            />
                            {errors.Apellido && <div className="invalid-feedback">{errors.Apellido}</div>}
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="inputEmail">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.Correo ? 'is-invalid' : ''}`}
                            id="inputEmail"
                            name="Correo"
                            value={Datos.Correo}
                            onChange={completeForm}
                        />
                        {errors.Correo && <div className="invalid-feedback">{errors.Correo}</div>}
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputContraseña">Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errors.Contraseña ? 'is-invalid' : ''}`}
                                id="inputContraseña"
                                name="Contraseña"
                                value={Datos.Contraseña}
                                onChange={completeForm}
                            />
                            {errors.Contraseña && <div className="invalid-feedback">{errors.Contraseña}</div>}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputConfirmarContraseña">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className={`form-control ${errors.ConfirmarContraseña ? 'is-invalid' : ''}`}
                                id="inputConfirmarContraseña"
                                name="ConfirmarContraseña"
                                value={Datos.ConfirmarContraseña}
                                onChange={completeForm}
                            />
                            {errors.ConfirmarContraseña && <div className="invalid-feedback">{errors.ConfirmarContraseña}</div>}
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="inputDireccion">Dirección</label>
                        <input
                            type="text"
                            className={`form-control ${errors.Direccion ? 'is-invalid' : ''}`}
                            id="inputDireccion"
                            name="Direccion"
                            value={Datos.Direccion}
                            onChange={completeForm}
                        />
                        {errors.Direccion && <div className="invalid-feedback">{errors.Direccion}</div>}
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputCiudad">Ciudad</label>
                            <input
                                type="text"
                                className={`form-control ${errors.Ciudad ? 'is-invalid' : ''}`}
                                id="inputCiudad"
                                name="Ciudad"
                                value={Datos.Ciudad}
                                onChange={completeForm}
                            />
                            {errors.Ciudad && <div className="invalid-feedback">{errors.Ciudad}</div>}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputZip">Zip</label>
                            <input
                                type="text"
                                className={`form-control ${errors.Zip ? 'is-invalid' : ''}`}
                                id="inputZip"
                                name="Zip"
                                value={Datos.Zip}
                                onChange={completeForm}
                            />
                            {errors.Zip && <div className="invalid-feedback">{errors.Zip}</div>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
            </div>
            )}
        </div>
    );
};

export default SignUp;
