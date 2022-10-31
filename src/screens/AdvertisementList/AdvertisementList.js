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
import { reducer } from './reducer';

export default function AdvertisementList() {
    const [
        {
            loading,
            error,
            advertisements,
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
                const { data } = await axios.get(`${ip}/api/advertisements/admin?page=${page} `, {
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
        if (window.confirm('Bạn muốn thêm ảnh quảng cáo?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    `${ip}/api/advertisements`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                toast.success('Ảnh quảng cáo đã được thêm mới thành công');
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/advertisement/${data.advertisement._id}`);
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'CREATE_FAIL',
                });
            }
        }
    };

    const deleteHandler = async (advertisement) => {
        if (window.confirm('Bạn có chắc muốn xóa ảnh quảng cáo này?')) {
            try {
                await axios.delete(`${ip}/api/advertisements/${advertisement._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Ảnh quảng cáo đã được xóa thành công');
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
                    <h1>Quản lý ảnh quảng cáo</h1>
                </Col>
                <Col className="col text-end">
                    <div>
                        <Button type="button" onClick={createHandler}>
                            Thêm ảnh quảng cáo
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
                                <th>Ảnh</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advertisements.map((advertisement) => (
                                <tr key={advertisement._id}>
                                    <td>{advertisement._id}</td>
                                    <td>{advertisement.alt}</td>
                                    <td><img style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 5 }} src={advertisement.image} alt="" /></td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => navigate(`/admin/advertisement/${advertisement._id}`)}
                                        >
                                            Sửa
                                        </Button>
                                        &nbsp;
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => deleteHandler(advertisement)}
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
                                to={`/admin/advertisements?page=${x + 1}`}
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