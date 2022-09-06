import axios from "axios";
import { useEffect, useReducer, useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate, useParams } from "react-router-dom"
import logger from "use-reducer-logger";
import Rating from "../../components/Rating";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import { Store } from "../../store";
import { getError } from "../utils";
import { initialState, reducer } from "./reducer";



function Product() {
    const navigate = useNavigate()
    const params = useParams();
    const { slug } = params;
    const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), initialState)
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        fetchData()
    }, [slug]);

    const { state, dispatch: contextDispatch } = useContext(Store)
    const { cart } = state;
    const addToCart = async () => {
        const existItem = cart.cartItems.find(item => item.id === product.id);
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product.id}`)
        if (data.countInStock < quantity) {
            window.alert("Hết hàng")
            return
        }
        contextDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity }
        })
        navigate('/cart')
    }
    return (
        loading ? (<Loading />)
            : error ? (<Message variant="danger">{error}</Message>)
                :
                (<div>
                    <Row>
                        <Col md={3} className="mt-3">
                            <img className="img-large" src={product.image} alt={product.name}></img>
                        </Col>
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup className="mt-3">
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1>
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Giá: {product.price}đ
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Tác giả: {product.author}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    NXB: {product.publisher}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Năm XB: {product.yearPublish}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Trọng lượng (gr): {product.weight}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Kích thước bao bì: {product.size}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    Số trang: {product.numberOfPages}
                                </ListGroup>
                                <ListGroup className="mt-3">
                                    {product.description}
                                </ListGroup>
                            </ListGroup>
                        </Col>
                        <Col md={3} className="mt-3">
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup>
                                            <Row>
                                                <Col>Giá:</Col>
                                                <Col>{product.price}đ</Col>
                                            </Row>
                                        </ListGroup>
                                        <ListGroup className="mt-3">
                                            <Row>
                                                <Col>Trạng thái:</Col>
                                                <Col>
                                                    {product.countInStock > 0 ?
                                                        <Badge bg="success">Còn hàng</Badge>
                                                        :
                                                        <Badge bg="danger">Hết hàng</Badge>
                                                    }</Col>
                                            </Row>
                                        </ListGroup>
                                        {product.countInStock > 0 && (
                                            <ListGroup className="mt-3">
                                                <div className="d-grid">
                                                    <Button onClick={addToCart} variant="primary">
                                                        Thêm vào giỏ hàng
                                                    </Button>
                                                </div>
                                            </ListGroup>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>)
    )
}

export default Product;