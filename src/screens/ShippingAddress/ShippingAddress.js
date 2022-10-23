import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import Checkout from '../../components/Checkout';

export default function ShippingAddress() {
    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const {
        userInfo,
        cart: { shippingAddress },
    } = state
    console.log("🚀 ~ file: ShippingAddress.js ~ line 16 ~ ShippingAddress ~ state", state)
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [district, setDistrict] = useState(shippingAddress.district || '');
    const [wards, setWards] = useState(shippingAddress.wards || '');
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=shippingAddress')
        }
    }, [userInfo, navigate]);
    const submitHandler = (e) => {
        e.preventDefault();
        contextDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                phone,
                city,
                district,
                wards,
                address
            }
        })
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                phone,
                city,
                district,
                wards,
                address
            })
        )
        navigate('/payment')
    }
    return <div>
        <Helmet>
            <title>Địa chỉ nhận hàng</title>
        </Helmet>
        <Checkout step1 step2></Checkout>
        <div className="container small-container">
            <h1 className="my-3">Địa chỉ nhận hàng</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Thành phố</Form.Label>
                    <Form.Control
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Quận/ Huyện</Form.Label>
                    <Form.Control
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Phường/ Xã</Form.Label>
                    <Form.Control
                        value={wards}
                        onChange={(e) => setWards(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Địa chỉ cụ thể</Form.Label>
                    <Form.Control
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button variant="primary" type="submit">
                        Tiếp tục
                    </Button>
                </div>
            </Form>

        </div>
    </div>;
}


