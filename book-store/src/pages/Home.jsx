import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import BookCard from './BookCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Random placeholder images
  const bookImages = [
    'https://picsum.photos/200/300?random=1',
    'https://picsum.photos/200/300?random=2',
    'https://picsum.photos/200/300?random=3',
    'https://picsum.photos/200/300?random=4',
    'https://picsum.photos/200/300?random=5',
    'https://picsum.photos/200/300?random=6',
    'https://picsum.photos/200/300?random=7'
  ];

  // Fetch all books from backend
  useEffect(() => {
    fetch('http://localhost:8080/api/books')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }
        return res.json();
      })
      .then((data) => {
        // Add random image to each book
        const booksWithImages = data.map((book, index) => ({
          ...book,
          image: bookImages[Math.floor(Math.random() * bookImages.length)]
        }));
        setBooks(booksWithImages);
      })
      .catch((err) => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="logo">📚 BookStore</h1>
        <div className="nav-actions">
          <button onClick={() => navigate('/cart')} className="cart-btn">🛒 Cart</button>
          <button onClick={() => navigate('/login')} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="content">
        <h2 className="heading">Find Your Next Favorite Book</h2>
        <input
          type="text"
          placeholder="Search by title or author..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="books-grid">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
            {filteredBooks.length === 0 && <p>No books found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
