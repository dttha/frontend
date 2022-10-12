import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../../store';
import { ip } from '../../configs/ip';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

export default function ProductList() {
    const [
        {
            loading,
            error,
            products,
            pages,
            loadingCreate,
            loadingDelete,
            successDelete,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${ip}/api/products/admin?page=${page} `, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) { }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [page, userInfo, successDelete]);

    const createHandler = async () => {
        if (window.confirm('Bạn muốn thêm sản phẩm?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    `${ip}/api/products`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                toast.success('Sản phẩm đã được thêm mới thành công');
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/product/${data.product._id}`);
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    };

    const deleteHandler = async (product) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`${ip}/api/products/${product._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Sản phẩm đã được xóa thành công');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };

    return (
        <div>
            <Row>
                <Col>
                    <h1>Quản lý sản phẩm</h1>
                </Col>
                <Col className="col text-end">
                    <div>
                        <Button type="button" onClick={createHandler}>
                            Thêm sản phẩm
                        </Button>
                    </div>
                </Col>
            </Row>

            {loadingCreate && <Loading></Loading>}
            {loadingDelete && <Loading></Loading>}
            {loading ? (
                <Loading></Loading>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                        <th>Tên</th>
                                        <th>Danh mục</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tác giả</th>
                                        <th>NXB</th>
                                        <th>Trọng lượng</th>
                                        <th>Số trang</th>
                                        <th>Kích thước</th>
                                        <th>Năm XB</th>
                                        <th>Mô tả</th>
                                        <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.countInStock}</td>
                                    <td>{product.author}</td>
                                    <td>{product.publisher}</td>
                                    <td>{product.weight}</td>
                                    <td>{product.numberOfPages}</td>
                                    <td>{product.size}</td>
                                    <td>{product.yearPublish}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => navigate(`/admin/product/${product._id}`)}
                                        >
                                            Sửa
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => deleteHandler(product)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}