import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../store';
import Checkout from '../../components/Checkout';
import data from '../../local.json'
import { isValidPhoneNumber } from '../../helper/validate';
import { toast } from 'react-toastify';

export default function ShippingAddress() {
    const [listDistrict, setListDistrict] = useState([])
    const [listWard, setListWard] = useState([])

    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const {
        userInfo,
        cart: { shippingAddress },
    } = state
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || 'Hà Nội');
    const [district, setDistrict] = useState(shippingAddress.district || '');
    const [wards, setWards] = useState(shippingAddress.wards || '');

    useEffect(() => {
        const findCity = data.find((i) => {
            return i.name === city
        })
        if (findCity) {
            setListDistrict(findCity.districts)
            setDistrict(findCity.districts[0].name)
        }
    }, [city])

    useEffect(() => {
        setListWard([])

        if (city) {
            const findCity = data.find((i) => {
                return i.name === city
            })
            if (findCity) {
                const currentDistrict = listDistrict.find((i) => i.name === district)
                if (currentDistrict) {
                    setListWard(currentDistrict.wards)
                    setWards(currentDistrict.wards[0].name)
                }
            }
        }
    }, [district, city, listDistrict])

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=shippingAddress')
        }
    }, [userInfo, navigate]);
    const submitHandler = (e) => {
        e.preventDefault();
        if (!isValidPhoneNumber(phone)) {
            toast.error("Vui lòng nhập đúng định dạng số điện thoại")
            return
        }
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
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/')
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
                    {phone && !isValidPhoneNumber(phone) &&
                        <div style={{ color: 'red', fontSize: 13 }}>
                            Số điện thoại không hợp lệ
                        </div>
                    }
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Thành phố</Form.Label>
                    <Form.Select
                        value={city}
                        onChange={(e) => {
                            console.log("🚀 ~ file: ShippingAddress.js ~ line 118 ~ ShippingAddress ~ e", e)
                            return setCity(e.target.value)
                        }}
                        required
                    >
                        {data.map((i) => <option key={i.name} value={i.name}>{i.name}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Quận/ Huyện</Form.Label>
                    <Form.Select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                    >
                        {listDistrict.map((i) => <option key={i.name} value={i.name}>{i.name}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Phường/ Xã</Form.Label>
                    <Form.Select
                        value={wards}
                        onChange={(e) => setWards(e.target.value)}
                        required
                    >
                        {listWard.map((i) => <option key={i.name} value={i.name}>{i.name}</option>)}
                    </Form.Select>
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
                    <Button variant="light" onClick={backHandler}>
                        Quay lại
                    </Button>
                    <Button style={{ marginLeft: 10 }} variant="primary" type="submit">
                        Tiếp tục
                    </Button>
                </div>
            </Form>
        </div>
    </div>;
}


