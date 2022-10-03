import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect } from 'react';
import { Store } from './store';
import Home from './screens/Home/Home';
import Product from './screens/ProductDetail.js/Product';
import Cart from './screens/Cart/Cart';
import SignIn from './screens/SignIn/SignIn';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ShippingAddress from './screens/ShippingAddress/ShippingAddress';
import Signup from './screens/Signup.js/Signup';
import PaymentMethod from './screens/PaymentMethod/PaymentMethod';
import MethodShipping from './screens/MethodShipping/MethodShipping';
import PlaceOrder from './screens/PlaceOrder/PlaceOrder';
import Footer from './components/Footer';
import axios from 'axios';
import { ip } from './configs/ip';
import Order from './screens/Order/Order';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store)
  const { cart, userInfo } = state
  useEffect(() => {
    axios.defaults.baseURL = ip
  }, [])
  const signoutHandler = () => {
    contextDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    localStorage.removeItem('shippingMethod')
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1}></ToastContainer>
        <header>
          <Navbar className="background">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand className="font-color">mọt sách</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link style={{ color: '#fff' }} to='/cart' className="nav-link">
                  Giỏ hàng
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg='danger'>
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Hồ sơ cá nhân</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Lịch sử mua hàng</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Đăng xuất
                    </Link>
                  </NavDropdown>
                ) : (
                    <Link className="nav-link" style={{ color: '#fff' }} to="/signin">
                    Đăng nhập
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3 mb-5' style={{ minHeight: "65vh" }}>
            <Routes>
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentMethod />} />
              <Route path="/shippingmethod" element={<MethodShipping />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <Footer></Footer>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
