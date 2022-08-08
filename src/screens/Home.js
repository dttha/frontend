import React, { useEffect, useReducer } from "react"
import axios from 'axios'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from "../components/Product"

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCh_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default function Home() {
    const [state, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: '',
    })
    const { loading, error, products } = state;
    // const [products, setProducts] = useState([])
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' })
        try {
            const result = await axios.get('api/products')
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
        } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: err.message })
        }
        // setProducts(result.data)
    }
    return <div>
        <h1>Sách được yêu thích</h1>
        <div className="products">
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                        <Row>
                            {products.map((product) => (
                                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                    <Product product={product}></Product>
                                </Col>
                            ))}
                        </Row>
                    )
            }
        </div>
    </div>
}


