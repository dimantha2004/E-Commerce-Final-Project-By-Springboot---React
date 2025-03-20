import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import '../../style/addCategory.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getAllCategories();
            if (response.categoryList) {
                setCategories(response.categoryList);
            } else {
                setMessage("Failed to fetch categories");
            }
        } catch (error) {
            setMessage("An unexpected error occurred. Please try again later.");
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const response = await ApiService.deleteCategory(categoryId);
                
                // Check the status code to determine if there was an error
                if (response.status !== 200) {
                    // This is where we display the error message from the backend
                    setMessage(response.message || "Failed to delete category");
                } else {
                    setMessage("Category deleted successfully");
                    // Refresh the categories list
                    fetchCategories();
                }
                
                // Automatically clear the message after 5 seconds
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            } catch (error) {
                setMessage("An unexpected error occurred. Please try again later.");
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleEdit = (categoryId) => {
        navigate(`/admin/categories/edit/${categoryId}`);
    };

    const handleAddNew = () => {
        navigate("/admin/categories/add");
    };

    if (loading && categories.length === 0) {
        return <div className="category-management-page"><p>Loading categories...</p></div>;
    }

    return (
        <div className="category-management-page">
            <h2>Category Management</h2>
            
            {message && (
                <div className="message-container">
                    <p className={message.includes("successfully") ? "success-message" : "error-message"}>
                        {message}
                    </p>
                </div>
            )}
            
            <button onClick={handleAddNew} className="add-button">Add New Category</button>
            
            <div className="categories-list">
                {categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button onClick={() => handleEdit(category.id)} className="edit-button">Edit</button>
                                        <button onClick={() => handleDelete(category.id)} className="delete-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;