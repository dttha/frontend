import { Link, Route, Routes } from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from 'react';
import { Store } from './store';
import Home from './screens/Home/Home';
import Product from './screens/ProductDetail.js/Product';
import Cart from './screens/Cart/Cart';
import SignIn from './screens/SignIn/SignIn';
import { toast, ToastContainer } from 'react-toastify';
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
import { useLocation } from 'react-router-dom';
import logo from '../src/assets/images/logo.png'
import OrderHistory from './screens/OrderHistory/OrderHistory';
import Profile from './screens/Profile/Profile';
import Button from 'react-bootstrap/Button';
import { getError } from './screens/utils';
import SearchBox from './components/SearchBox';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store)
  const { cart, userInfo } = state
  const location = useLocation()
  console.log("🚀 ~ file: App.js ~ line 29 ~ App ~ location", location)
  useEffect(() => {
    axios.defaults.baseURL = ip
  }, [])
  const signoutHandler = () => {
    contextDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    localStorage.removeItem('shippingMethod')
    window.location.href = '/signin';
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${ip}/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className={
      sidebarIsOpen
        ? "d-flex flex-column site-container active-cont"
        : "d-flex flex-column site-container"
    }
    >
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <header>
        <Navbar className="background" expand="lg">
          <Container>
            <Button
              id="btn-category"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className="fas fa-bars"></i>
            </Button>

            <LinkContainer to="/">
              <Navbar.Brand className="font-color">mọt sách</Navbar.Brand>
              {/* <img alt="logo" src={logo} className="logo" width="175" height="51" /> */}
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="me-auto w-100 justify-content-end">
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
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div
        className={
          sidebarIsOpen
            ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
            : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }
      >
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Danh mục sách</strong>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link className="nav-link-category">{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </div>
      <main>
        <Container className='mt-3 mb-5' style={{ minHeight: "65vh" }}>
          <Routes>
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shipping" element={<ShippingAddress />} />
            <Route path="/payment" element={<PaymentMethod />} />
            <Route path="/shippingmethod" element={<MethodShipping />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/orderHistory" element={<OrderHistory />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default App;
