import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import { Store } from '../../store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { reducer } from './reducer';

export default function UserList() {
    const navigate = useNavigate();
    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
        });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${ip}/api/users`, {
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

    const deleteHandler = async (user) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`${ip}/api/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('Xóa người dùng thành công');
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (error) {
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
                <title>Người dùng</title>
            </Helmet>
            <h1>Người dùng</h1>
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
                            <th>Họ và Tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Đúng' : 'Không'}</td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => navigate(`/admin/user/${user._id}`)}
                                    >
                                        Sửa
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => deleteHandler(user)}
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