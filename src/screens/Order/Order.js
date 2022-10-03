import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { Store } from '../../store';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
export default function Order() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();
    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    })

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!userInfo) {
            return navigate('/login');
        }
        if (
            !order._id ||
            (order._id && order._id !== orderId)
        ) {
            fetchOrder();
        }
    }, [order, userInfo, orderId, navigate])

    return loading ? (
        <Loading></Loading>
    ) : error ?
        (<Message variant="danger">{error}</Message>)
        : (
            <div>
                <Helmet>
                    <title>Đơn hàng {orderId}</title>
                </Helmet>
                <h1 className="my-3">Đơn hàng {orderId}</h1>
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Địa chỉ nhận hàng</Card.Title>
                                <Card.Text>
                                    <strong>Họ và tên:</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Số điện thoại:</strong> {order.shippingAddress.phone} <br />
                                    <strong>Địa chỉ: </strong> {order.shippingAddress.address},
                                    {order.shippingAddress.wards}, {order.shippingAddress.district}
                                    ,{order.shippingAddress.city}
                                </Card.Text>
                                {order.isDelivered ? (
                                    <Message variant="success">
                                        Được giao lúc {order.deliveredAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger">Chưa giao hàng.</Message>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Thanh toán</Card.Title>
                                <Card.Text>
                                    <strong>Phương thức:</strong> {order.paymentMethod}
                                </Card.Text>
                                {order.isPaid ? (
                                    <Message variant="success">
                                        Thanh toán lúc {order.paidAt}
                                    </Message>
                                ) : (
                                    <Message variant="danger">Chưa thanh toán.</Message>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Sản phẩm</Card.Title>
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item) => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="img-fluid rounded img-thumbnail"
                                                    ></img>{' '}
                                                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}>
                                                    <span>{item.quantity}</span>
                                                </Col>
                                                <Col md={3}>{item.price}đ</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Tổng tiền đơn đặt hàng</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Sản phẩm</Col>
                                            <Col>{order.itemsPrice}đ</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Phí ship</Col>
                                            <Col>{order.shippingPrice}đ</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <strong> Tổng tiền</strong>
                                            </Col>
                                            <Col>
                                                <strong>{order.totalPrice}đ</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
}

