import axios from "axios";
import { useEffect, useReducer } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useParams } from "react-router-dom"
import logger from "use-reducer-logger";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCh_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function Product() {
    const params = useParams();
    const { slug } = params;
    const [state, dispatch] = useReducer(logger(reducer), {
        product: [],
        loading: true,
        error: '',
    })
    const { loading, error, product } = state;
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
        }
        fetchData()
    }, [slug])
    return (
        loading ? (<div>Loading...</div>)
            : error ? (<div>{error}</div>)
                :
                (<div>
                    <Row>
                        <Col md={6}>
                            <img className="img-large" src={product.image} alt={product.name}></img>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Giá: {product.price}đ
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Tác giả: {product.author}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    NXB: {product.publisher}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Năm XB: {product.yearPublish}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Trọng lượng (gr): {product.weight}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Kích thước bao bì: {product.size}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Số trang: {product.numberOfPages}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Giá:</Col>
                                                <Col>{product.price}đ</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Trạng thái:</Col>
                                                <Col>
                                                    {product.countInStock > 0 ?
                                                        <Badge bg="success">Còn hàng</Badge>
                                                        :
                                                        <Badge bg="danger">Hết hàng</Badge>
                                                    }</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <div className="d-grid">
                                                    <Button variant="primary">
                                                        Thêm vào giỏ hàng
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
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