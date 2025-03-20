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
            // Handle network errors differently than API errors
            if (error.message === "Network Error") {
                console.error(`Network Error ${method} ${url}: Server might be down or unreachable`);
                return {
                    status: 503,
                    message: "Server is currently unavailable. Please try again later."
                };
            }
            
            const errorMessage = error.response?.data?.message || error.message;
            console.error(`Error ${method} ${url}:`, errorMessage);
            
            // Return a structured error response instead of throwing
            return {
                status: error.response?.status || 500,
                message: errorMessage,
                error: true
            };
        }
    }

    // --- CATEGORY METHODS ---
    static async getAllCategory() {
        return this.makeRequest("get", "/category/get-all");
    }

    static async createCategory(body) {
        return this.makeRequest("post", "/category/create", body);
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

    // --- PRODUCT METHODS ---
    static async createProduct(formData) {
        return this.makeRequest(
            "post", 
            "/product/create", 
            formData, 
            null,  
            {
                ...this.getHeader("multipart/form-data"),
                Authorization: this.getHeader().Authorization
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
                ...this.getHeader("multipart/form-data"),
                Authorization: this.getHeader().Authorization
            }
        );
    }

    static async deleteProduct(productId) {
        return this.makeRequest("delete", `/product/delete/${productId}`);
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

    // --- ORDER METHODS ---
    static async getAllOrders() {
        return this.makeRequest("get", "/order/filter");
    }

    static async getAllOrderItemsByStatus(status) {
        return this.makeRequest("get", "/order/filter", null, { status });
    }
    
    static async getOrderItemById(itemId) {
        return this.makeRequest("get", "/order/filter", null, { itemId });
    }
    
    static async updateOrderItemsByStatus(orderItemId, status) {
        return this.makeRequest("put", `/order/update-item-status/${orderItemId}`, null, { status });
    }

    // --- PAYMENT METHODS ---
    static async createCheckoutSession(orderRequest) {
        return this.makeRequest(
            "post", 
            "/api/create-checkout-session", 
            orderRequest,
            null,
            {
                ...this.getHeader("application/json"),
                Authorization: this.getHeader().Authorization
            }
        );
    }

    // --- AUTHENTICATION ---
    static async registerUser(registration) {
        return this.makeRequest("post", "/auth/register", registration);
    }

    static async loginUser(loginDetails) {
        return this.makeRequest("post", "/auth/login", loginDetails);
    }

    static async getLoggedInUserInfo() {
        return this.makeRequest("get", "/user/my-info");
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
    }

    static isAuthenticated() {
        return !!localStorage.getItem("token");
    }

    static isAdmin() {
        return localStorage.getItem("role") === "ADMIN";
    }
}