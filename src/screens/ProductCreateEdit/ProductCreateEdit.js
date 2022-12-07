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

export default function ProductCreateEdit() {
    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: productId } = params;
    const isCreate = productId === "create"

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: isCreate ? false : true,
            error: '',
        });

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [weight, setWeight] = useState('');
    const [numberOfPages, setNumberOfPages] = useState('');
    const [size, setSize] = useState('');
    const [yearPublish, setYearPublish] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {

        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${ip}/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setImage(data.image);
                setCategory(data.category);
                setPrice(data.price);
                setCountInStock(data.countInStock);
                setAuthor(data.author);
                setPublisher(data.publisher);
                setWeight(data.weight);
                setNumberOfPages(data.numberOfPages);
                setSize(data.size);
                setYearPublish(data.yearPublish);
                setDescription(data.description);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        if (isCreate) {

        } else {
            fetchData();
        }

    }, [productId]);
    const submitHandler = async (e) => {
        let id = productId
        e.preventDefault();
        try {
            if (isCreate) {
                const { data } = await axios.post(
                    `${ip}/api/products`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                id = data.product._id
            }
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `${ip}/api/products/${id}`,
                {
                    _id: id,
                    name,
                    slug,
                    image,
                    category,
                    price,
                    countInStock,
                    author,
                    publisher,
                    weight,
                    numberOfPages,
                    size,
                    yearPublish,
                    description,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({
                type: 'UPDATE_SUCCESS',
            });
            toast.success(`${isCreate ? "Thêm" : "Chỉnh sửa"} sản phẩm thành công`);
            navigate('/admin/products');
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
                <title>{isCreate ? "Thêm" : "Sửa"} sản phẩm ${!isCreate ? productId : ""}</title>
            </Helmet>
            <h1>{isCreate ? "Thêm" : "Sửa"} sản phẩm {!isCreate ? productId : ""}</h1>

            {loading ? (
                <Loading></Loading>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
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
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Số lượng trong kho</Form.Label>
                        <Form.Control
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Tác giả</Form.Label>
                        <Form.Control
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Nhà xuất bản</Form.Label>
                        <Form.Control
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Trọng lượng (gram)</Form.Label>
                        <Form.Control
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Số trang</Form.Label>
                        <Form.Control
                            value={numberOfPages}
                            onChange={(e) => setNumberOfPages(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Kích thước</Form.Label>
                        <Form.Control
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>Năm xuất bản</Form.Label>
                        <Form.Control
                            value={yearPublish}
                            onChange={(e) => setYearPublish(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
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