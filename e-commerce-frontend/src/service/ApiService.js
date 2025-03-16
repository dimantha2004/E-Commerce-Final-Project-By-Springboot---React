import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8080";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        };
    }

    static async makeRequest(method, url, data = null, params = null) {
        try {
            const response = await axios({
                method,
                url: `${this.BASE_URL}${url}`,
                headers: this.getHeader(),
                data,
                params
            });
            return response.data;
        } catch (error) {
            console.error(`Error making ${method} request to ${url}:`, error);
            throw error;
        }
    }

    /*-----User-----*/
    static async registerUser(registration) {
        return this.makeRequest("post", "/auth/register", registration);
    }

    static async loginUser(loginDetails) {
        return this.makeRequest("post", "/auth/login", loginDetails);
    }

    static async getLoggedInUserInfo() {
        return this.makeRequest("get", "/user/my-info");
    }

    static async getAllUsers() {
        return this.makeRequest("get", "/user/get-all");
    }

    /*-----Product-----*/
    static async addProduct(formData) {
        return axios.post(
            `${this.BASE_URL}/product/create`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );
    }

    static async updateProduct(productId, formData) {
        return axios.put(
            `${this.BASE_URL}/product/update/${productId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
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

    /*-----Category-----*/
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

    /*-----Order-----*/
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

    /*-----Address-----*/
    static async saveAddress(body) {
        return this.makeRequest("post", "/address/save", body);
    }

    /*-----Authentication-----*/
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
}