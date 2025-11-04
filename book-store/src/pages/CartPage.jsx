import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CartPage.css";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      alert("Please login to view your cart!");
      return;
    }

    axios
      .get(`http://localhost:8080/api/cart/${userId}`)
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${userId}/${bookId}`);
      setCartItems(cartItems.filter((item) => item.book_id !== bookId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item!");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/checkout", {
        userId,
        items: cartItems.map((item) => ({
          bookId: item.book_id,
          qty: item.quantity,
        })),
      });

      if (response.data === "Order placed successfully!") {
        alert("✅ Order placed successfully!");
        setCartItems([]); // clear cart on frontend
        navigate("/home"); // optional route
      } else {
        alert("Checkout failed!");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again!");
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>No items added yet!</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.book_id}>
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.book_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-total">
            <h3>Grand Total: ₹{totalAmount.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
