import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/adminprofile.css';

const AdminProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        pending: 0,
        returned: 0,
        cancelled: 0,
    });
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            // Fetch user info
            const userResponse = await ApiService.getLoggedInUserInfo();
            setUserInfo(userResponse.user);

            // Fetch order statistics
            const ordersResponse = await ApiService.getAllOrders();
            const orders = ordersResponse.orderList || [];

            const stats = {
                totalOrders: orders.length,
                confirmed: orders.filter(order => order.status === "CONFIRMED").length,
                shipped: orders.filter(order => order.status === "SHIPPED").length,
                delivered: orders.filter(order => order.status === "DELIVERED").length,
                pending: orders.filter(order => order.status === "PENDING").length,
                returned: orders.filter(order => order.status === "RETURNED").length,
                cancelled: orders.filter(order => order.status === "CANCELLED").length,
            };
            setOrderStats(stats);

            // Fetch product count
            const productsResponse = await ApiService.getAllProducts();
            setProductCount(productsResponse.productList?.length || 0);

            // Fetch customer count (assuming you have a method to get all users)
            const usersResponse = await ApiService.getAllUsers();
            setCustomerCount(usersResponse.userList?.length || 0);

        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    return (
        <div className="admin-profile">
            <h1>Admin Profile</h1>
            {userInfo && (
                <div className="user-info">
                    <h2>User Information</h2>
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Role:</strong> {userInfo.role}</p>
                </div>
            )}

            <div className="admin-stats">
                <h2>Admin Statistics</h2>
                <p><strong>Total Products:</strong> {productCount}</p>
                <p><strong>Total Customers:</strong> {customerCount}</p>
                <p><strong>Total Orders:</strong> {orderStats.totalOrders}</p>
                <p><strong>Confirmed Orders:</strong> {orderStats.confirmed}</p>
                <p><strong>Shipped Orders:</strong> {orderStats.shipped}</p>
                <p><strong>Delivered Orders:</strong> {orderStats.delivered}</p>
                <p><strong>Pending Orders:</strong> {orderStats.pending}</p>
                <p><strong>Returned Orders:</strong> {orderStats.returned}</p>
                <p><strong>Cancelled Orders:</strong> {orderStats.cancelled}</p>
            </div>
        </div>
    );
};

export default AdminProfile;