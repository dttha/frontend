import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Checkout(props) {
    return <Row className="checkout-steps">
        <Col className={props.step1 ? 'active' : ''}>Đăng nhập</Col>
        <Col className={props.step2 ? 'active' : ''}>Địa chỉ nhận hàng</Col>
        <Col className={props.step3 ? 'active' : ''}>Phương thức thanh toán</Col>
        <Col className={props.step4 ? 'active' : ''}>Phương thức vận chuyển</Col>
        <Col className={props.step5 ? 'active' : ''}>Đặt hàng</Col>
    </Row>
}

