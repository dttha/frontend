import { useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../store";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Message from "../../components/Message";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Cart() {
    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const updateCart = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`)
        if (data.countInStock < quantity) {
            window.alert("Hết hàng")
            return
        }
        contextDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }
        })
    }
    const removeItem = (item) => {
        contextDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }
    const checkout = () => {
        navigate('/signin?redirect=/shipping')
    }
    return (
        <div>
            <Helmet>
                <title>Giỏ hàng</title>
            </Helmet>
            <h1>Giỏ hàng</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <Message>
                            Giỏ hàng rỗng. <Link to="/">Tiếp tục mua sắm</Link>
                        </Message>
                    ) :
                        (
                            <ListGroup>
                                {cartItems.map((item) => (
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
                                            <Col md={2}>
                                                <Button
                                                    variant="light"
                                                    onClick={() =>
                                                        updateCart(item, item.quantity - 1)
                                                    }
                                                    disabled={item.quantity === 1}
                                                >
                                                    <i className="fas fa-minus-circle"></i>
                                                </Button>{' '}
                                                <span>{item.quantity}</span>{' '}
                                                <Button
                                                    variant="light"
                                                    onClick={() =>
                                                        updateCart(item, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity === item.countInStock}
                                                >
                                                    <i className="fas fa-plus-circle"></i>
                                                </Button>
                                            </Col>
                                            <Col md={2}>{item.price}đ</Col>
                                            <Col md={2}>
                                                <Button
                                                    onClick={() => removeItem(item)}
                                                    variant="light"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )
                    }
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Tổng tiền: {' '}
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}đ
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkout}
                                            disabled={cartItems.length === 0}
                                        >
                                            Thanh toán
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}