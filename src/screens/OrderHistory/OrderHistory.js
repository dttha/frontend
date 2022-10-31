import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import { Store } from '../../store';
import { getError } from '../utils';
import { reducer } from './reducer';

export default function OrderHistory() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })
    const deleteOrderHandler = async (order) => {
        if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`${ip}/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Đơn hàng đã bị hủy.');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                toast.error(getError(error));
                dispatch({
                    type: 'DELETE_FAIL',
                });
            }
        }
    };
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
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
        fetchData();
        }
    }, [userInfo, successDelete]);

    return (
        <div>
            <Helmet>
                <title>Lịch sử mua hàng</title>
            </Helmet>
            <h1>Lịch sử mua hàng</h1>
            {loadingDelete && <Loading></Loading>}
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
                                        variant="primary"
                                        style={{ marginRight: 10 }}
                                        onClick={() => {
                                            navigate(`/order/${order._id}`);
                                        }}
                                    >
                                        Chi tiết
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        onClick={() => deleteOrderHandler(order)}
                                        disabled={order.isPaid === true}
                                    >
                                        Hủy đơn
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
