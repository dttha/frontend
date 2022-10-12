import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logger from "use-reducer-logger";
import Rating from "../../components/Rating";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import { Store } from "../../store";
import { getError } from "../utils";
import Form from 'react-bootstrap/Form';
import { reducer } from "./reducer";
import { ip } from "../../configs/ip";
import { toast } from "react-toastify";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function Product() {
    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate()
    const params = useParams();
    const { slug } = params;
    const [{ loading, error, product, loadingCreateReview }, dispatch] =
        useReducer(reducer, {
            product: [],
            loading: true,
            error: '',
        });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get(`${ip}/api/products/slug/${slug}`)
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        fetchData()
    }, [slug]);

    const { state, dispatch: contextDispatch } = useContext(Store)
    const { cart, userInfo } = state;
    const addToCart = async () => {
        const existItem = cart.cartItems.find(item => item._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`${ip}/api/products/${product._id}`)
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

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please enter comment and rating');
            return;
        }
        try {
            const { data } = await axios.post(
                `${ip}/api/products/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            dispatch({
                type: 'CREATE_SUCCESS',
            });
            toast.success('Review submitted successfully');
            product.reviews.unshift(data.review);
            product.numReviews = data.numReviews;
            product.rating = data.rating;
            dispatch({ type: 'REFRESH_PRODUCT', payload: product });
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            });
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'CREATE_FAIL' });
        }
    };
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
                                    <ListGroup variant="flush" style={{ width: '100%' }}>
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
                                                    <Button onClick={() => addToCart(product)} variant="primary">
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
                    <div className="my-3">
                        <h2 ref={reviewsRef}>Reviews</h2>
                        <div className="mb-3">
                            {product.reviews.length === 0 && (
                                <Message>There is no review</Message>
                            )}
                        </div>
                        <ListGroup>
                            {product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating rating={review.rating} caption=" "></Rating>
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="my-3">
                            {userInfo ? (
                                <form onSubmit={submitHandler}>
                                    <h2>Write a customer review</h2>
                                    <Form.Group className="mb-3" controlId="rating">
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Select
                                            aria-label="Rating"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="1">1- Poor</option>
                                            <option value="2">2- Fair</option>
                                            <option value="3">3- Good</option>
                                            <option value="4">4- Very good</option>
                                            <option value="5">5- Excelent</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <FloatingLabel
                                        controlId="floatingTextarea"
                                        label="Comments"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Leave a comment here"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </FloatingLabel>

                                    <div className="mb-3">
                                        <Button disabled={loadingCreateReview} type="submit">
                                            Submit
                                        </Button>
                                        {loadingCreateReview && <Loading></Loading>}
                                    </div>
                                </form>
                            ) : (
                                <Message>
                                    Please{' '}
                                    <Link to={`/signin?redirect=/product/${product.slug}`}>
                                        Sign In
                                    </Link>{' '}
                                    to write a review
                                </Message>
                            )}
                        </div>
                    </div>
                </div>)
    )
}

export default Product;