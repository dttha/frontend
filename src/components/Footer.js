import React from 'react';
import logo from '../assets/images/logo.png'

export default function Footer() {
    return (
        <div className="footer">
            <div className="flex wrap-footer mt-5 mb-4">
                <div className="logo-footer">
                    <img alt="logo" src={logo} className="logo" width="175" height="51" />
                </div>
                <div className="footer-content">
                    <div className="wrap-list">
                        <div className="list-title">
                            Dịch vụ
                        </div>
                        <ul className="list">
                            <li className="list-item">
                                Điều khoản sử dụng
                            </li>
                            <li className="list-item">
                                Chính sách bảo mật thông tin cá nhân
                            </li>
                            <li className="list-item">
                                Chính sách bảo mật thanh toán
                            </li>
                        </ul>
                    </div>
                    <div className="wrap-list">
                        <div className="list-title">
                            Hỗ trợ
                        </div>
                        <ul className="list">
                            <li className="list-item">
                                Chính sách vận chuyển
                            </li>
                            <li className="list-item">
                                Chính sách bảo hành
                            </li>
                            <li className="list-item">
                                Chính sách thanh toán
                            </li>
                        </ul>
                    </div>
                    <div className="wrap_list">
                        <div className="list-title">
                            Tài khoản của tôi
                        </div>
                        <ul className="list">
                            <li className="list-item">
                                Đăng nhập/Tạo mới tài khoản
                            </li>
                            <li className="list-item">
                                Chỉnh sửa tài khoản
                            </li>
                            <li className="list-item">
                                Lịch sử mua hàng
                            </li>
                        </ul>
                    </div>
                    <div className="wrap-list-contact">
                        <div className="list-title">
                            Liên hệ
                        </div>
                        <ul className="list-contact">
                            <li className="list-item-contact">
                                <i className="fas fa-envelope" style={{ marginRight: 5 }}></i>
                                cskh@motsach.com.vn
                            </li>
                            <li className="list-item-contact">
                                <i className="fas fa-phone" style={{ marginRight: 5 }}></i>
                                19001500
                            </li>
                            <li className="list-item-contact">
                                <i className="fas fa-map" style={{ marginRight: 5 }}></i>
                                60-62 Lê Lợi, Q.1, TP. HCM
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <div className="d-flex justify-content-between" style={{ marginTop: '11px', marginBottom: '11px' }}>
                    <div>
                        Motsach 2022
                    </div>
                    <div className="d-flex">
                        <div className="font-copyright-text">
                            Mạng xã hội&nbsp;
                        </div>
                        <div style={{ color: '#5B5D9B' }}>
                            <i className="fab fa-facebook" style={{ marginRight: 5 }}></i>
                            <i className="fab fa-instagram" style={{ marginRight: 5 }}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}