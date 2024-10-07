import React, { useState } from 'react';
import { object, string, date } from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [Datos, setDatos] = useState({
        Nombre: "",
        Apellido: "",
        Email: "",
        Contraseña: "",
        ConfirmarContraseña: "",
        Direccion: "",
        Zip: "",
        Ciudad: ""
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    let FormSchema = object({
        Nombre: string().required("Nombre es obligatorio"),
        Apellido: string().required("Apellido es obligatorio"),
        Email: string().email("Email no es válido").required("Email es obligatorio"),
        Contraseña: string()
            .min(5, "La contraseña debe contener al menos 5 caracteres")
            .required("Contraseña es obligatoria")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/,
                "La contraseña debe tener al menos una letra mayúscula, una minúscula y un número"
            ),
        ConfirmarContraseña: string().matches(Datos.Contraseña, "Las contraseñas no coinciden"),
        Direccion: string().required("Dirección es obligatoria"),
        Ciudad: string().required("Ciudad es obligatoria"),
        Zip: string().required("Código postal es obligatorio"),
        createdOn: date().default(() => new Date()),
    });

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

        try {
            await FormSchema.validate(Datos, { abortEarly: false });
            try {
                const response = await axios.post('http://localhost:5000/SignUp', Datos);
                console.log("Respuesta del servidor:", response.data);
                navigate(`/Login`);
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
            }
        } catch (validationErrors) {
            const formattedErrors = validationErrors.inner.reduce((acc, error) => {
                acc[error.path] = error.message; 
                return acc;
            }, {});
            setErrors(formattedErrors);
        }
    };

    return (
        <div className="container">
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
                            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                            id="inputEmail"
                            name="Email"
                            value={Datos.Email}
                            onChange={completeForm}
                        />
                        {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
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
        </div>
    );
};

export default SignUp;
