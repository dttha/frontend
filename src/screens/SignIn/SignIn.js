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

export default function SignIn() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { state, dispatch: contextDispatch } = useContext(Store)
    const { userInfo } = state
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${ip}/api/users/signin`, {
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
                <title>Đăng nhập</title>
            </Helmet>
            <h1 className="my-3">Đăng nhập</h1>
            <Form onSubmit={submitHandler}>
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
                <div className="mb-3">
                    <Button type="submit">Đăng nhập</Button>
                </div>
                <div className="mb-3">
                    Bạn chưa có tài khoản?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Tạo tài khoản</Link>
                </div>
                <div className="mb-3">
                    <Link to={`/forwardPassword/request`}>Quên mật khẩu?</Link>
                </div>
            </Form>
        </Container>
    )
}