import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom"
import Rating from './Rating';


function Product(props) {
    const { product } = props;
    return (
        <Card className="product">
            <Link to={`/product/${product.slug}`}>
                <img className="image-cover card-img-top" src={product.image} alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>
                        {product.name}
                    </Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>{product.price}đ</Card.Text>
                <Button>Thêm vào giỏ hàng</Button>
            </Card.Body>
        </Card>
    )
}
export default Product