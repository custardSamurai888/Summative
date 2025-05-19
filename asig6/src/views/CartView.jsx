import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CartView.css';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="cart-view">
      <Header />
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cart.map((movie) => (
              <div key={movie.id} className="cart-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
                <div className="cart-details">
                  <h3>{movie.title}</h3>
                  <button onClick={() => removeFromCart(movie.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartView;
