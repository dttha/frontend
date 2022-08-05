import React from "react"
import { Link } from "react-router-dom"
import data from "../data"

export default function Home() {
    return <div>
        <h1>Sách được yêu thích</h1>
        <div className="products">
            {data.products.map((product) => (
                <div className="product" key={product.slug}>
                    <Link to={`/product/${product.slug}`}>
                        <img className="image-cover" src={product.image} alt={product.name} />
                    </Link>
                    <div className="product-info">
                        <Link to={`/product/${product.slug}`}>
                            <p>
                                {product.name}
                            </p>
                        </Link>
                        <p>
                            <strong>{product.price}đ</strong>
                        </p>
                        <button>Thêm vào giỏ hàng</button>
                    </div>
                </div>)
            )}
        </div>
    </div>
}


