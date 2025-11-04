import React from 'react';
import axios from 'axios';
import '../styles/BookCard.css';

export default function BookCard({ book }) {
const handleAddToCart = async () => {
  const userId = localStorage.getItem("userId"); // Assuming you store this after login

  if (!userId) {
    alert("Please login to add books to cart!");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/api/cart", // endpoint
      {
        userId: parseInt(userId),
        bookId: book.id,
        qty: 1,
      }, // <-- JSON body
      {
        headers: { "Content-Type": "application/json" }, // <-- IMPORTANT
      }
    );

    alert(response.data || "Book added to cart!");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add book to cart.");
  }
};


  return (
    <div className="book-card">
      <img
        src={book.image || "https://picsum.photos/200/300?random=" + book.id}
        alt={book.title}
      />
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <div className="card-footer">
        <span>₹{book.price}</span>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
