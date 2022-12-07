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
import Search from './screens/Search/Search';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './screens/Dashboard/Dashboard';
import ProductList from './screens/ProductList/ProductList';
import ProductCreateEdit from './screens/ProductCreateEdit/ProductCreateEdit';
import OrderList from './screens/OrderList/OrderList';
import UserList from './screens/UserList/UserList';
import UserEdit from './screens/UserEdit/UserEdit';
import AdvertisementList from './screens/AdvertisementList/AdvertisementList';
import AdvertisementCreateEdit from './screens/AdvertisementCreateEdit/AdvertisementCreateEdit';
import Product from './screens/ProductDetail/Product';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import ForwardPassword from './screens/ForwardPassword/ForwardPassword';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store)
  const { cart, userInfo } = state
  const location = useLocation()
  useEffect(() => {
    axios.defaults.baseURL = ip
  }, [])
  const signoutHandler = () => {
    contextDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
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

  useEffect(() => {
    if (userInfo) {
      const getCart = async () => {
        try {
          const { data } = await axios.get(`${ip}/api/cart`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          contextDispatch({ type: "GET_CART_SUCCESS", payload: { cart: data.cart } })
        } catch (err) {
          console.log(err);
        }
      }
      getCart()
    }
  }, [userInfo])

  return (
    <div className={
      sidebarIsOpen
        ? "d-flex flex-column site-container active-cont"
        : "d-flex flex-column site-container"
    }
    >
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <header className="fixed">
        <Navbar
          className={
            sidebarIsOpen
              ? "background nav-fixed active-nav-fixed"
              : "background nav-fixed"
          }
          expand="lg"
        >
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
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Bảng điều khiển</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Quản lý sản phẩm</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Quản lý đơn hàng</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Quản lý người dùng</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/advertisements">
                      <NavDropdown.Item>Quản lý bìa quảng cáo</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div
        className={
          sidebarIsOpen
            ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column fixed'
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
        <Container className='mt-70 mb-5' style={{ minHeight: "65vh" }}>
          <Routes>
            <Route path="/product/:slug" element={
              <>
                <Product />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/cart" element={
              <>
                <Cart />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/search" element={
              <>
                <Search />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forwardPassword/:method" element={<ForwardPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                  <MessengerCustomerChat
                    pageId="102925642158931"
                    appId="1167924590582344"
                  />
                </ProtectedRoute>
              }
            >

            </Route>
            <Route path="/shipping" element={
              <>
                <ShippingAddress />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/payment" element={
              <>
                <PaymentMethod />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/shippingmethod" element={
              <>
                <MethodShipping />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route path="/placeorder" element={
              <>
                <PlaceOrder />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <Order />
                  <MessengerCustomerChat
                    pageId="102925642158931"
                    appId="1167924590582344"
                  />
                </ProtectedRoute>
              }
            >

            </Route>
            <Route path="/orderHistory" element={
              <ProtectedRoute>
                <OrderHistory />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </ProtectedRoute>
            } />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderList />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductList />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductCreateEdit />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEdit />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/advertisements"
              element={
                <AdminRoute>
                  <AdvertisementList />
                </AdminRoute>
              }
            ></Route>
            <Route
              path="/admin/advertisement/:id"
              element={
                <AdminRoute>
                  <AdvertisementCreateEdit />
                </AdminRoute>
              }
            ></Route>
            <Route path="/" element={
              <>
                <Home />
                <MessengerCustomerChat
                  pageId="102925642158931"
                  appId="1167924590582344"
                />
              </>
            }>

            </Route>
          </Routes>
        </Container>
      </main>
      <footer>
        {/* <Footer></Footer> */}
      </footer>
    </div>
  );
}

export default App;
