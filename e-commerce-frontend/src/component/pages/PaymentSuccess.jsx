import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../style/PaymentSuccess.css';

const PaymentSuccess = () => {
    const { dispatch } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
       
        dispatch({ type: 'CLEAR_CART' });

        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return (
        <div className="checkout-success">
            <h1>Payment Successful...! 🎉</h1>
            <p>Thank you for your purchase. You'll be redirected to the homepage shortly.</p>
        </div>
    );
};

export default PaymentSuccess;