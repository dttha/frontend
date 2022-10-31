import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { Store } from '../../store';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { ip } from '../../configs/ip';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import { reducer } from './reducer';

export default function Order() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();
    const [
        {
            loading,
            error,
            order,
            successPay,
            loadingPay,
            loadingDeliver,
            successDeliver,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
    });
    console.log("🚀 ~ file: Order.js ~ line 37 ~ Order ~ order", order)

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice },
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    }
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `${ip}/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                toast.success('Đơn hàng đã thanh toán.');
            } catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                toast.error(getError(err));
            }
        });
    }
    function onError(err) {
        toast.error(getError(err));
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${ip}/api/orders/${orderId}`, {
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
            successPay ||
            successDeliver ||
            (order._id && order._id !== orderId)
        ) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get(`${ip}/api/keys/paypal`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            }
            loadPaypalScript()
        }
    }, [
        order,
        userInfo,
        orderId,
        navigate,
        paypalDispatch,
        successPay,
        successDeliver,
    ]);

    async function deliverOrderHandler() {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(
                `${ip}/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            toast.success('Đơn hàng đã được vận chuyển');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/placeorder')
    }

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
                                    <ListGroup variant="flush" style={{ minWidth: 750 }}>
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
                                <Card.Body id="card-sum-order">
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
                                        {order.paymentMethod === "Paypal" && !order.isPaid && (
                                            <ListGroup.Item>
                                                {isPending ? (
                                                    <Loading />
                                                ) : (
                                                    <div>
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onError={onError}
                                                        ></PayPalButtons>
                                                    </div>
                                                )}
                                                {loadingPay && <Loading></Loading>}
                                            </ListGroup.Item>
                                        )}
                                        {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                            <ListGroup.Item>
                                                {loadingDeliver && <Loading></Loading>}
                                                <div className="d-grid">
                                                    <Button type="button" onClick={deliverOrderHandler}>
                                                        Giao đơn hàng
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                        <div className="mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button variant="primary" onClick={backHandler}>
                                                Quay lại
                                            </Button>
                                        </div>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
}

