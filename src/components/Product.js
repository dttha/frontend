import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom"
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../store';
import { ip } from '../configs/ip';


function Product(props) {
    const navigate = useNavigate()
    const { product } = props;
    const { state, dispatch: contextDispatch } = useContext(Store)
    const { cart } = state;

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
    return (
        <Card className="product">
            <Link to={`/product/${product.slug}`}>
                <img className="image-cover card-img-top" src={product.image} alt={product.name} />
            </Link>
            <Card.Body className="card-body">
                <Link className="product-name" to={`/product/${product.slug}`}>
                    <Card.Title>
                        {product.name}
                    </Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>{product.price}đ</Card.Text>
                {product.countInStock === 0 ? (<Button variant="light" disabled>Hết hàng</Button>)
                    :
                    (<Button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</Button>)
                }
            </Card.Body>
        </Card>
    )
}
export default Product