import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import { Store } from '../../store';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function OrderHistory() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(
                    `${ip}/api/orders/mine`,
                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        };
        fetchData();
    }, [userInfo]);

    return (
        <div>
            <Helmet>
                <title>Lịch sử mua hàng</title>
            </Helmet>
            <h1>Lịch sử mua hàng</h1>
            {loading ? (
                <Loading></Loading>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th>Vận chuyển</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Chưa thanh toán'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'Chưa giao hàng'}
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`);
                                        }}
                                    >
                                        Chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
        </div>
    );
}
