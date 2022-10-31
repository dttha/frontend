import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Checkout from '../../components/Checkout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function MethodShipping() {
    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const {
        cart: { shippingAddress, shippingMethod }
    } = state;
    const [shippingMethodName, setShippingMethod] = useState(
        shippingMethod || 'Nhanh'
    )
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])
    const submitHandler = (e) => {
        e.preventDefault();
        const price = shippingMethodName === "Nhanh" ? 30000 : 20000
        contextDispatch({ type: 'SAVE_SHIPPING_METHOD', payload: { shippingMethodName, shippingPrice: shippingMethodName === "Nhanh" ? 30000 : 20000 } })
        localStorage.setItem('shippingMethod', shippingMethodName)
        localStorage.setItem('shippingPrice', price)
        navigate('/placeorder');
    }
    const backHandler = (e) => {
        e.preventDefault();
        navigate('/payment')
    }
    return (
        <div>
            <Checkout step1 step2 step3 step4></Checkout>
            <div className="container small-container">
                <Helmet>
                    <title>Phương thức vận chuyển</title>
                </Helmet>
                <h1 className="my-3">Phương thức vận chuyển</h1>
                <Form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Nhanh"
                            label="Nhanh"
                            value="Nhanh"
                            checked={shippingMethodName === "Nhanh"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Giaohangtietkiem"
                            label="Giao hàng tiết kiệm"
                            value="Giao hàng tiết kiệm"
                            checked={shippingMethodName === "Giao hàng tiết kiệm"}
                            onChange={(e) => setShippingMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Tiếp tục</Button>
                    </div>
                </Form>
                <div className="mb-3">
                    <Button variant="primary" onClick={backHandler}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
}

