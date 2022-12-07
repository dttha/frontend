import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Message from '../../components/Message';
import { getError } from '../utils';
import Loading from '../../components/Loading';
import { Store } from '../../store';
import { ip } from '../../configs/ip';
import { reducer } from './reducer';
import formatMoney from '../../helper/format';

export default function Dashboard() {
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${ip}/api/orders/summary`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userInfo]);

    return (
        <div>
            <h1>Bảng điều khiển</h1>
            {loading ? (
                <Loading />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.users && summary.users[0]
                                            ? summary.users[0].numUsers
                                            : 0}
                                    </Card.Title>
                                    <Card.Text> Số người dùng</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.orders && summary.users[0]
                                            ? summary.orders[0].numOrders
                                            : 0}
                                    </Card.Title>
                                    <Card.Text> Số đơn hàng</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                                {formatMoney(summary.orders && summary.users[0]
                                            ? summary.orders[0].totalSales
                                                    : 0)}
                                    </Card.Title>
                                    <Card.Text> Số tiền đặt hàng</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className="my-3">
                        <h2>Doanh thu bán hàng</h2>
                        {summary.dailyOrders.length === 0 ? (
                            <Message>No Sale</Message>
                        ) : (
                            <Chart
                                width="100%"
                                height="400px"
                                chartType="AreaChart"
                                loader={<div>Loading Chart...</div>}
                                data={[
                                    ['Ngày', 'Doanh thu bán hàng'],
                                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                                ]}
                            ></Chart>
                        )}
                    </div>
                    <div className="my-3">
                        <h2>Danh mục sách</h2>
                        {summary.productCategories.length === 0 ? (
                            <Message>No Category</Message>
                        ) : (
                            <Chart
                                width="100%"
                                height="400px"
                                chartType="PieChart"
                                loader={<div>Loading Chart...</div>}
                                data={[
                                    ['Category', 'Products'],
                                    ...summary.productCategories.map((x) => [x._id, x.count]),
                                ]}
                            ></Chart>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}