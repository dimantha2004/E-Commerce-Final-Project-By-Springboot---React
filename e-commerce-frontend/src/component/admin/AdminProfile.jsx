import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import "../../style/adminprofile.css";

const AdminProfile = () => {
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        cancelledOrders: 0
    });

    const [revenueMetrics, setRevenueMetrics] = useState({
        totalRevenue: 0,
        averageOrderValue: 0
    });

    const [productStats, setProductStats] = useState({
        totalProducts: 0,
        topSellingProducts: [],
        outOfStockProducts: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all orders
                const ordersResponse = await ApiService.getAllOrders();
                console.log("Raw orders response:", ordersResponse);
                const orders = ordersResponse?.orderItemList || [];
                console.log("Processed orders:", orders);

                // Calculate order statistics
                const stats = {
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(order => order.status === "PENDING").length,
                    confirmedOrders: orders.filter(order => order.status === "CONFIRMED").length,
                    shippedOrders: orders.filter(order => order.status === "SHIPPED").length,
                    cancelledOrders: orders.filter(order => order.status === "CANCELLED").length
                };
                setOrderStats(stats);

                // Calculate revenue metrics
                const totalRevenue = orders.reduce((sum, order) => {
                    return sum + (Number(order.price) * Number(order.quantity));
                }, 0);
                
                const averageOrderValue = orders.length > 0 
                    ? totalRevenue / orders.length 
                    : 0;
                
                setRevenueMetrics({
                    totalRevenue,
                    averageOrderValue
                });

                // Fetch product statistics
                const productsResponse = await ApiService.getAllProducts();
                console.log("Raw products response:", productsResponse);
                const products = productsResponse?.productList || [];
                console.log("Processed products:", products);

                const productStats = {
                    totalProducts: products.length,
                    topSellingProducts: products.slice(0, 3),
                    outOfStockProducts: products.filter(p => p.stock === 0).length
                };
                setProductStats(productStats);

                // Get recent orders
                const recentOrders = orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                setRecentOrders(recentOrders);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-profile-page">
            <h1>Admin Profile</h1>

            {/* Order Statistics */}
            <div className="stats-section">
                <h2>Order Statistics</h2>
                <div>Total Orders: {orderStats.totalOrders}</div>
                <div>Pending Orders: {orderStats.pendingOrders}</div>
                <div>Confirmed Orders: {orderStats.confirmedOrders}</div>
                <div>Shipped Orders: {orderStats.shippedOrders}</div>
                <div>Cancelled Orders: {orderStats.cancelledOrders}</div>
            </div>

            {/* Revenue Metrics */}
            <div className="stats-section">
                <h2>Revenue Metrics</h2>
                <div>Total Revenue: LKR {revenueMetrics.totalRevenue.toLocaleString()}</div>
                <div>Average Order Value: LKR {revenueMetrics.averageOrderValue.toLocaleString()}</div>
            </div>

            {/* Product Statistics */}
            <div className="stats-section">
                <h2>Product Statistics</h2>
                <div>Total Products: {productStats.totalProducts}</div>
                <div>Top Selling Products:</div>
                <ul>
                    {productStats.topSellingProducts.map(product => (
                        <li key={product.id}>
                            {product.name} - LKR {product.price?.toLocaleString() || 'N/A'}
                        </li>
                    ))}
                </ul>
                <div>Out of Stock Products: {productStats.outOfStockProducts}</div>
            </div>

            {/* Recent Orders */}
            <div className="stats-section">
                <h2>Recent Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.product?.name || 'N/A'}</td>
                                <td>{order.quantity}</td>
                                <td>LKR {(order.price * order.quantity).toLocaleString()}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProfile;