import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { getError } from '../utils';
import Rating from '../../components/Rating';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import Product from '../../components/Product';
import { reducer } from './reducer';

const prices = [
    {
        name: '1000đ - 500000đ',
        value: '1000-500000',
    },
    {
        name: '510000đ - 2000000đ',
        value: '510000-2000000',
    },
    {
        name: '2010000đ - 10000000đ',
        value: '2010000-10000000',
    },
];

export const ratings = [
    {
        name: '4stars & up',
        rating: 4,
    },

    {
        name: '3stars & up',
        rating: 3,
    },

    {
        name: '2stars & up',
        rating: 2,
    },

    {
        name: '1stars & up',
        rating: 1,
    },
];

export default function Search() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search); // /search?category=Shirts
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    console.log({ loading, error, products, pages, countProducts });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `${ip}/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [category, error, order, page, price, query, rating]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${ip}/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    };
    return (
        <div>
            <Helmet>
                <title>Tìm kiếm sách</title>
            </Helmet>
            <Row>
                <Col md={3}>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-12px' }}>
                        <i className="fas fa-book-open" style={{ marginRight: 8, color: 'cyan', marginBottom: '4px' }}></i>
                        <h5>Thể loại</h5>
                    </div>
                    <div>
                        <ul id="search-ul">
                            <li id="search-li">
                                <Link
                                    id="link-category"
                                    className={'all' === category ? '' : ''}
                                    to={getFilterUrl({ category: 'all' })}
                                >
                                    Tất cả
                                </Link>
                            </li>
                            {categories && categories.map((c) => (
                                <li id="search-li" key={c}>
                                    <Link
                                        id="link-category"
                                        className={c === category ? 'text-bold' : ''}
                                        to={getFilterUrl({ category: c })}
                                    >
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-12px' }}>
                            <i className="fas fa-dollar-sign" style={{ marginRight: 8, color: 'orange', marginBottom: 5 }}></i>
                            <h5>Giá</h5>
                        </div>
                        <ul id="search-ul">
                            <li id="search-li">
                                <Link
                                    id="link-category"
                                    className={'all' === price ? '' : ''}
                                    to={getFilterUrl({ price: 'all' })}
                                >
                                    Tất cả
                                </Link>
                            </li>
                            {prices && prices.map((p) => (
                                <li id="search-li" key={p.value}>
                                    <Link
                                        id="link-category"
                                        to={getFilterUrl({ price: p.value })}
                                        className={p.value === price ? 'text-bold' : ''}
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-12px' }}>
                            <i className="fas fa-comments" style={{ marginRight: 8, color: 'blue', marginBottom: 6 }}></i>
                            <h5>Trung bình đánh giá</h5>
                        </div>
                        <ul id="search-ul">
                            {ratings && ratings.map((r) => (
                                <li id="search-li" key={r.name}>
                                    <Link
                                        style={{ textDecoration: "none" }}
                                        to={getFilterUrl({ rating: r.rating })}
                                        className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                                    >
                                        <Rating caption={' trở lên'} rating={r.rating}></Rating>
                                    </Link>
                                </li>
                            ))}
                            <li id="search-li">
                                <Link
                                    id="link-category"
                                    to={getFilterUrl({ rating: 'all' })}
                                    className={rating === 'all' ? 'text-bold' : ''}
                                >
                                    <Rating caption={' trở lên'} rating={0}></Rating>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (
                        <Loading></Loading>
                    ) : error ? (
                        <Message variant="danger">{error}</Message>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={6}>
                                    <div>
                                        {countProducts === 0 ? 'No' : countProducts} Kết quả
                                        {query !== 'all' && ' : ' + query}
                                        {category !== 'all' && ' : ' + category}
                                        {price !== 'all' && ' : Price ' + price}
                                                {rating !== 'all' && ' : ' + rating + ' Đánh giá trở lên'}
                                        {query !== 'all' ||
                                            category !== 'all' ||
                                            rating !== 'all' ||
                                            price !== 'all' ? (
                                            <Button
                                                variant="light"
                                                onClick={() => navigate('/search')}
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </Button>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    Sắp xếp theo{' '}
                                    <select
                                        value={order}
                                        onChange={(e) => {
                                            navigate(getFilterUrl({ order: e.target.value }));
                                        }}
                                    >
                                        <option value="newest">Gần đây nhất</option>
                                        <option value="lowest">Giá: Thấp đến cao</option>
                                        <option value="highest">Giá: Cao xuống thấp</option>
                                                <option value="toprated">Trung bình đánh giá</option>
                                    </select>
                                </Col>
                            </Row>
                                    {products && products.length === 0 && (
                                <Message>Không tìm thấy kết quả</Message>
                            )}

                            <Row>
                                        {products && products.map((product) => (
                                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>

                            <div>
                                        {pages && [...Array(pages).keys()].map((x) => (
                                    <LinkContainer
                                        key={x + 1}
                                        className="mx-1"
                                        to={getFilterUrl({ page: x + 1 })}
                                    >
                                        <Button
                                            className={Number(page) === x + 1 ? 'text-bold' : ''}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </LinkContainer>
                                ))}
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}