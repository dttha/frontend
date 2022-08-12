import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from "./screens/Home";
import Product from "./screens/Product";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from 'react';
import { Store } from './store';

function App() {
  const { state } = useContext(Store)
  const { cart } = state
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar className="background">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand className="font-color">book store</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to='/cart' className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItems.length}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved.</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
