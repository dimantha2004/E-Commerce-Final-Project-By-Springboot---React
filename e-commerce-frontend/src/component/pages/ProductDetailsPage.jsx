import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/productDetailsPage.css';

const productDetailsPage = ()=>{
    const {productId}=useParams();
    const {cart,dispatch}=useCart();
    const [product,setProduct]=useState(null);

    useEffect(()=>{
    },[productId])

    const fetchProduct=async ()=>{
        try{
            const response=await ApiService.getProductById(productId);
            setProduct(response.product);
        }catch(error){
            console.log(error.message || error)
        }

    }
    
}