import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import formatMoney from '../../helper/format';
import { Store } from '../../store';
import { getError } from '../utils';
import { reducer } from './reducer';

export default function OrderList() {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${ip}/api/orders`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (order) => {
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`${ip}/api/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Đơn hàng đã xóa thành công');
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
            <Helmet>
                <title>Đơn hàng</title>
            </Helmet>
            <h1>Đơn hàng</h1>
            {loadingDelete && <Loading></Loading>}
            {loading ? (
                <Loading></Loading>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên người dùng</th>
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
                                <td>{order.user ? order.user.name : 'Người dùng đã bị xóa'}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{formatMoney(order.totalPrice)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Chưa thanh toán'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'Chưa vận chuyển'}
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`);
                                        }}
                                    >
                                        Chi tiết
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type="button"
                                        variant="danger"
                                        onClick={() => deleteHandler(order)}
                                    >
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}