import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Checkout from '../../components/Checkout';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethod() {
    const navigate = useNavigate()
    const { state, dispatch: contextDispatch } = useContext(Store)
    const {
        cart: { shippingAddress, paymentMethod }
    } = state;
    const [paymentMethodName, setPaymentMethod] = useState(
        paymentMethod || 'Thẻ nội địa/Master'
    )
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])
    const submitHandler = (e) => {
        e.preventDefault();
        contextDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
        localStorage.setItem('paymentMethod', paymentMethodName)
        navigate('/shippingmethod');
    }
    return (
        <div>
            <Checkout step1 step2 step3></Checkout>
            <div className="container smaill-container">
                <Helmet>
                    <title>Phương thức thanh toán</title>
                </Helmet>
                <h1 className="my-3">Phương thức thanh toán</h1>
                <Form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Card"
                            label="Thẻ nội địa/Master"
                            value="Thẻ nội địa/Master"
                            checked={paymentMethodName === "Thẻ nội địa/Master"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Cash"
                            label="Thanh toán khi nhận hàng"
                            value="Thanh toán khi nhận hàng"
                            checked={paymentMethodName === "Thanh toán khi nhận hàng"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Đồng ý</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

