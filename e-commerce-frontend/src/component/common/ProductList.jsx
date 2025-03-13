import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../../style/productList.css';

const ProductList = ({products})=>{
    const {cart,dispatch}=useCart();

    const addToCart = (product) => {
        dispatch({type: 'ADD_ITEM', payload: product});
    }

    const incrementItem = (product) => {
        dispatch({type: 'INCREMENT_ITEM', payload: product});
    }

    const decrementItem = (product) => {

        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({type: 'DECREMENT_ITEM', payload: product}); 
        }else{
            dispatch({type: 'REMOVE_ITEM', payload: product}); 
        }
    }
    reeturn(
        <dev className="product-lisy">
            {products.map((product,index)=>{
                const cartITEM=cart.find(item.id==product.id); 
                return{
                    <div>
                    
                    </dev>
                }
            })}
        </dev>
    )
}