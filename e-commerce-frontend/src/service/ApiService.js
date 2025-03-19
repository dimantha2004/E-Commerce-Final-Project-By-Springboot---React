import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";

    static getHeader(contentType = "application/json") {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": contentType
        };
    }

    static async makeRequest(method, url, data = null, params = null, headers = null) {
        try {
            const config = {
                method,
                url: `${this.BASE_URL}${url}`,
                headers: headers || this.getHeader(),
                data,
                params,
                withCredentials: true
            };

            if (data instanceof FormData) {
                config.headers = {
                    ...config.headers,
                    "Content-Type": "multipart/form-data"
                };
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Error making ${method} request to ${url}:`, error);
            throw error;
        }
    }

    // ---USER---
    static async registerUser(registration) {
        return this.makeRequest("post", "/auth/register", registration);
    }

    static async loginUser(loginDetails) {
        return this.makeRequest("post", "/auth/login", loginDetails);
    }

    static async getLoggedInUserInfo() {
        return this.makeRequest("get", "/user/my-info");
    }
    static sendOtp = async (email) => {
        return this.makeRequest("post", "/auth/forgot-password", null, { email });
    }
    
    static verifyOtp = async (email, otp) => {
        return this.makeRequest("post", "/auth/verify-otp", null, { email, otp });
    }
    
    static resetPassword = async (email, newPassword) => {
        return this.makeRequest("post", "/auth/reset-password", null, { email, newPassword });
    }
    
    //---PRODUCT---
    static async addProduct(formData) {
        return this.makeRequest(
            "post", 
            "/product/create", 
            formData, 
            null,  
            {
                Authorization: this.getHeader().Authorization,
                
            }
        );
    }

    static async updateProduct(productId, formData) {
        return this.makeRequest(
            "put", 
            `/product/update/${productId}`, 
            formData, 
            null,  
            {
                Authorization: this.getHeader().Authorization,
                
            }
        );
    }


    static async getAllProducts(page = 0, size = 10) {
        return this.makeRequest("get", "/product/get-all", null, { page, size });
    }

    static async searchProducts(searchValue) {
        return this.makeRequest("get", "/product/search", null, { searchValue });
    }

    static async getAllProductsByCategoryId(categoryId) {
        return this.makeRequest("get", `/product/get-by-category-id/${categoryId}`);
    }

    static async getProductById(productId) {
        return this.makeRequest("get", `/product/get-by-product-id/${productId}`);
    }

    static async deleteProduct(productId) {
        return this.makeRequest("delete", `/product/delete/${productId}`);
    }

    //---CATEGORY---
    static async createCategory(body) {
        return this.makeRequest("post", "/category/create", body);
    }

    static async getAllCategory() {
        return this.makeRequest("get", "/category/get-all");
    }

    static async getCategoryById(categoryId) {
        return this.makeRequest("get", `/category/get-category-by-id/${categoryId}`);
    }

    static async updateCategory(categoryId, body) {
        return this.makeRequest("put", `/category/update/${categoryId}`, body);
    }

    static async deleteCategory(categoryId) {
        return this.makeRequest("delete", `/category/delete/${categoryId}`);
    }

    //---ORDER---
    static async createOrder(body) {
        return this.makeRequest("post", "/order/create", body);
    }

    static async getAllOrders() {
        return this.makeRequest("get", "/order/filter");
    }

    static async getOrderItemById(itemId) {
        return this.makeRequest("get", "/order/filter", null, { itemId });
    }

    static async getAllOrderItemsByStatus(status) {
        return this.makeRequest("get", "/order/filter", null, { status });
    }

    static async updateOrderItemsByStatus(orderItemId, status) {
        return this.makeRequest("put", `/order/update-item-status/${orderItemId}`, null, { status });
    }

    //ADDRESS---
    static async saveAddress(body) {
        return this.makeRequest("post", "/address/save", body);
    }

    //---AUTHENTICATION---
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }
    
    // ---PAYMENT---
    static async createCheckoutSession(orderRequest) {
    return this.makeRequest("post", "/api/create-checkout-session", orderRequest);
    }
    
    static async createCheckoutSession(orderRequest) {
        try {
            const response = await this.makeRequest(
                "post", 
                "/api/create-checkout-session", 
                orderRequest,
                null,
                {
                    ...this.getHeader(),
                
                }
            );
            
            if (!response?.sessionId) {
                throw new Error("Invalid response from payment server");
            }
            
            return response;
        } catch (error) {
            console.error("Checkout error:", error);
            throw new Error(error.response?.data?.message || "Payment processing failed");
        }
    }
}
