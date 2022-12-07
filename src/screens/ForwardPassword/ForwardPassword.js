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
import { useParams } from "react-router-dom";

export default function ForwardPassword() {
    const navigate = useNavigate()
    const { method } = useParams()
    const isRequest = method === "request"
    const { search } = useLocation()
    const token = new URLSearchParams(search).get('token')
    console.log("🚀 ~ file: ForwardPassword.js:20 ~ ForwardPassword ~ token", token)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        if (isRequest) {
            requestForgot()
        } else {
            confirmPass()
        }

    }

    const requestForgot = async (e) => {
        try {
            await axios.post(
                `${ip}/api/users/send-email-password`,
                {
                    email
                }
            );
            toast.success("Vui lòng vào mail để xác nhận")
        }
        catch (e) {
            console.log(e);
            toast.error(getError(e))
        }
    }

    const confirmPass = async (e) => {
        try {
            if (password === confirmPassword) {
                await axios.post(
                    `${ip}/api/users/confirm-password`,
                    {
                        password, token
                    }
                );
                toast.success("Thay đổi thành công")
                navigate('/signin')
            } else {
                toast.error("Mật khẩu không trùng khớp")
            }

        }
        catch (e) {
            console.log(e);
            toast.error(getError(e))
        }
    }

    return (
        <Container className="small-container">
            <Helmet>
                <title>Quên mật khẩu</title>
            </Helmet>
            <h1 className="my-3">Khôi phục mật khẩu</h1>
            <Form onSubmit={submitHandler}>
                {isRequest ? <Form.Group className="mb-3" style={{ position: 'relative' }} controlId="email">
                    <Form.Label>Email</Form.Label>
                    <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                </Form.Group> : <>
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
                </>}
                <div className="mb-3">
                    <Button variant="primary" type="submit">
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Container>
    )
}