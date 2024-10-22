import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const [Auth, setAuth] = useState(false);
    const [Tipo, setTipo] = useState("")

    useEffect(() => {
      const token = localStorage.getItem('token');
      const tipo = localStorage.getItem('tipo')
      if(token){
        setAuth(true)
        setTipo(tipo)
      }
    }, [])

    
    const goToAddProduct = () => {
      navigate(`/AddProduct`);
    };

    const goToLogin = () => {
        navigate(`/Login`);
    };

    const goToSignUp = () => {
        navigate(`/SignUp`);
    };

    const goToCart = () => {
      navigate(`/Cart`);
  };

    const SignOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tipo');

      setAuth(false);
      setTipo("");
      navigate(`/`);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Neon Threads</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {Auth ? (
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a className="nav-link active" aria-current="page" onClick={() => goToCart()}>Carrito</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={() => SignOut()}>Salir</a>
                    </li>
                    {Tipo == 1 ? (
                      <>
                      <li className="nav-item">
                        <a className="nav-link">Admin</a>
                      </li>

                    <li className="nav-item">
                    <a className="nav-link active" aria-current="page" onClick={() => goToAddProduct()}>Añadir Producto</a>
                    </li>
                    </>
                    ): null}
                  </ul>
                ) : 
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                    <li className="nav-item">
                      <a className="nav-link active" aria-current="page" onClick={() => goToLogin()}>Ingresar</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={() => goToSignUp()}>Registrarse</a>
                    </li>
                  </ul>
                }
              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
    )
}

export default Navbar