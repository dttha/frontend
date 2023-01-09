import React, { useEffect, useReducer } from "react"
import axios from 'axios'
import logger from 'use-reducer-logger'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Product from "../../components/Product"
import { Helmet } from "react-helmet-async"
import Slider from "../../components/Carousel"
import Loading from "../../components/Loading"
import Message from "../../components/Message"
import { initialState, reducer } from "./reducer"
import { ip } from "../../configs/ip"

export default function Home() {
    const [state, dispatch] = useReducer(logger(reducer), initialState)
    const { loading, error, products, advertisements } = state;
    useEffect(() => {
        fetchData()
        fetchDataAdvertisement()
    }, [])
    const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' })
        try {
            const result = await axios.get(`${ip}/api/products`)
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
        } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: err.message })
        }
    }
    const fetchDataAdvertisement = async () => {
        dispatch({ type: 'FETCH_ADVERTISEMENT_REQUEST' })
        try {
            const result = await axios.get(`${ip}/api/advertisements`)
            dispatch({ type: 'FETCH_ADVERTISEMENT_SUCCESS', payload: result.data })
        } catch (err) {
            dispatch({ type: 'FETCH_ADVERTISEMENT_FAIL', payload: err.message })
        }
    }
    return <div>
        <Helmet>
            <title>Book store</title>
        </Helmet>
        <Slider advertisements={advertisements}></Slider>
        <div className="trend">Sách mới</div>
        <div className="products">
            {loading ? (
                <Loading />
            ) : error ? (
                <Message variant="danger">{error}</Message>
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


