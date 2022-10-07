import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../../store';
import { ip } from '../../configs/ip';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;
    }
};

export default function Profile() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [phone, setPhone] = useState(userInfo.phone);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                `${ip}/api/users/profile`,
                {
                    name,
                    phone,
                    email,
                    password,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Chỉnh sửa thông tin cá nhân thành công');
        } catch (err) {
            dispatch({
                type: 'FETCH_FAIL',
            });
            toast.error(getError(err));
        }
    };

    return (
        <div className="container small-container">
            <Helmet>
                <title>Thông tin cá nhân</title>
            </Helmet>
            <h1 className="my-3">Thông tin cá nhân</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sửa</Button>
                </div>
            </form>
        </div>
    );
}