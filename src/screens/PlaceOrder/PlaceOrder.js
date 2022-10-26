import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Checkout from '../../components/Checkout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../../store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { ip } from '../../configs/ip';
import { reducer } from './reducer';

export default function PlaceOrder() {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    })

    const { state, dispatch: contextDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    cart.itemsPrice = cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    cart.shippingPrice = 0
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST ' })
            const { data } = await axios.post(
                `${ip}/api/orders`,
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    shippingMethod: cart.shippingMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    }
                }
            )
            contextDispatch({ type: 'CART_CLEAR' })
            dispatch({ type: 'CREATE_SUCCESS' })
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' })
            toast.error(getError(err))
        }
    };
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/shippingMethod')
    }

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);
    return (
        <div>
            <Checkout step1 step2 step3 step4 step5></Checkout>
            <Helmet>
                <title>Xem trước đơn hàng</title>
            </Helmet>
            <h1 className="my-3">Xem trước đơn đặt hàng</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body id="card">
                            <div>
                                <Card.Title>Địa chỉ nhận hàng</Card.Title>
                                <Card.Text>
                                    <strong>Họ và tên:</strong> {cart.shippingAddress.fullName} <br />
                                    <strong>Địa chỉ:</strong> {cart.shippingAddress.address},
                                    {cart.shippingAddress.wards}, {cart.shippingAddress.district},
                                    {cart.shippingAddress.city}
                                </Card.Text>
                            </div>
                            <Link to="/shipping">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body id="card">
                            <div>
                                <Card.Title>Phương thức thanh toán</Card.Title>
                                <Card.Text>
                                    <strong>Phương thức:</strong> {cart.paymentMethod}
                                </Card.Text>
                            </div>
                            <Link to="/payment">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body id="card">
                            <div>
                                <Card.Title>Phương thức vận chuyển</Card.Title>
                                <Card.Text>
                                    <strong>Phương thức:</strong> {cart.shippingMethod}
                                </Card.Text>
                            </div>
                            <Link to="/shippingmethod">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body id="card">
                            <div style={{ minWidth: 750 }}>
                                <Card.Title>Sản phẩm</Card.Title>
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <img
                                                        src={item.image} alt={item.name}
                                                        className="img-fluid rounded img-thumbnail"
                                                    ></img>{' '}
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}><span>{item.quantity}</span></Col>
                                                <Col md={3}>{item.price}đ</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                            <Link to="/cart">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body id="card-sum-order">
                            <Card.Title>Tổng tiền đơn đặt hàng</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Sản phẩm</Col>
                                        <Col>{cart.itemsPrice}đ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Phí ship</Col>
                                        <Col>{cart.shippingPrice}đ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Tổng tiền </strong>
                                        </Col>
                                        <Col>
                                            <strong>{cart.totalPrice}đ</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            Đặt hàng
                                        </Button>
                                        <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button variant="primary" onClick={backHandler}>
                                                Quay lại
                                            </Button>
                                        </div>
                                    </div>
                                    {loading && <Loading></Loading>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
