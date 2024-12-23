import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ip } from "../../configs/ip";
import { isValidPhoneNumber } from "../../helper/validate";

export default function Signup() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { state, dispatch: contextDispatch } = useContext(Store)
    const { userInfo } = state
    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Mật khẩu không trùng khớp.')
            return;
        }
        try {
            const { data } = await axios.post(`${ip}/api/users/signup`, {
                name,
                phone,
                email,
                password,
            })
            contextDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
            console.log(data)
        } catch (err) {
            toast.error(getError(err))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <Container className="small-container">
            <Helmet>
                <title>Đăng ký</title>
            </Helmet>
            <h1 className="my-3">Đăng ký</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nhập họ và tên"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Nhập số điện thoại"
                    />
                    {phone && !isValidPhoneNumber(phone) &&
                        <div style={{ color: 'red', fontSize: 13 }}>
                            Số điện thoại không hợp lệ
                        </div>
                    }
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        placeholder="Nhập lại mật khẩu"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Đăng ký</Button>
                </div>
                <div className="mb-3">
                    Bạn đã có tài khoản?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Đăng nhập</Link>
                </div>
            </Form>
        </Container>
    )
}