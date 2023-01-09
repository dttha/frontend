import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { Store } from '../../store';
import { getError } from '../utils';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { ip } from '../../configs/ip';
import { toast } from 'react-toastify';
import handleUpload from '../../helper/uploadImage';
import { reducer } from './reducer';

export default function AdvertisementCreateEdit() {
    const navigate = useNavigate();
    const params = useParams();
    const { id: advertisementId } = params;
    const isCreate = advertisementId === 'create'

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: isCreate ? false : true,
            error: '',
        });

    const [alt, setAlt] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${ip}/api/advertisements/${advertisementId}`);
                setAlt(data.alt);
                setImage(data.image);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (!isCreate) {
            fetchData();
        }
    }, [advertisementId]);
    const submitHandler = async (e) => {
        e.preventDefault();
        let id = advertisementId
        try {
            if (isCreate) {
                const { data } = await axios.post(
                    `${ip}/api/advertisements`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                id = data.advertisement._id
            }
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `${ip}/api/advertisements/${id}`,
                {
                    _id: id,
                    alt,
                    image,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            toast.success(`${isCreate ? "Thêm" : "Chỉnh sửa"} ảnh bìa quảng cáo thành công`);
            navigate('/admin/advertisements');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const url = await handleUpload(file)
            dispatch({ type: 'UPLOAD_SUCCESS' });

            toast.success('Tải ảnh thành công');
            setImage(url);
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
        }
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>{isCreate ? "Thêm" : "Sửa"} ảnh quảng cáo ${advertisementId}</title>
            </Helmet>
            <h1>{isCreate ? "Thêm" : "Sửa"} ảnh quảng cáo {isCreate ? "" : advertisementId}</h1>
            {loading ? (
                <Loading></Loading>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="alt">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>File ảnh</Form.Label>
                        <Form.Control
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="imageFile">
                        <Form.Label>Tải File</Form.Label>
                        <Form.Control type="file" onChange={uploadFileHandler} />
                        {loadingUpload && <Loading></Loading>}
                    </Form.Group>
                    <div className="mb-3">
                        <Button disabled={loadingUpdate} type="submit">
                                    {isCreate ? "Thêm" : "Sửa"}
                        </Button>
                        {loadingUpdate && <Loading></Loading>}
                    </div>
                </Form>
            )}
        </Container>
    );
}