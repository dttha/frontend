import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Checkout from '../../components/Checkout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Store } from '../../store';
import { Link, useNavigate } from 'react-router-dom';


export default function PlaceOrder() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

    const placeOrderHandler = async () => { };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);
    return (
        <div>
            <Checkout step1 step2 step3 step4></Checkout>
            <Helmet>
                <title>Xem trước đơn hàng</title>
            </Helmet>
            <h1 className="my-3">Xem trước đơn đặt hàng</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Địa chỉ nhận hàng</Card.Title>
                            <Card.Text>
                                <strong>Họ và tên:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Địa chỉ:</strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.wards}, {cart.shippingAddress.district},
                                {cart.shippingAddress.city}
                            </Card.Text>
                            <Link to="/shipping">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Phương thức thanh toán</Card.Title>
                            <Card.Text>
                                <strong>Phương thức:</strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Phương thức vận chuyển</Card.Title>
                            <Card.Text>
                                <strong>Phương thức:</strong> {cart.shippingMethod}
                            </Card.Text>
                            <Link to="/shippingmethod">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
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
                            <Link to="/cart">Chỉnh sửa</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Tổng tiền đơn đặt hàng</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Sản phẩm</Col>
                                        <Col>{cart.itemsPrice.toFixed(2)}đ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Phí ship</Col>
                                        <Col>{cart.shippingPrice.toFixed(2)}đ</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Tổng tiền </strong>
                                        </Col>
                                        <Col>
                                            <strong>{cart.totalPrice.toFixed(2)}đ</strong>
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
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
