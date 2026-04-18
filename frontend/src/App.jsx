import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rating: "",
    reviews: "",
    description: "",
    book_url: "",
    summary: "",
    genre: "",
    sentiment: "",
    recommendation_note: "",
  });

  const fetchBooks = () => {
    fetch("http://127.0.0.1:8001/api/books/")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setFormData({
      title: "",
      author: "",
      rating: "",
      reviews: "",
      description: "",
      book_url: "",
      summary: "",
      genre: "",
      sentiment: "",
      recommendation_note: "",
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      reviews: formData.reviews ? parseInt(formData.reviews) : null,
    };

    if (editId) {
      fetch(`http://127.0.0.1:8001/api/books/update/${editId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Book updated successfully!");
          clearForm();
          fetchBooks();
        })
        .catch((err) => console.log(err));
    } else {
      fetch("http://127.0.0.1:8001/api/books/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Book added successfully!");
          clearForm();
          fetchBooks();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8001/api/books/delete/${id}/`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Book deleted successfully!");
        fetchBooks();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (book) => {
    setEditId(book.id);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      rating: book.rating || "",
      reviews: book.reviews || "",
      description: book.description || "",
      book_url: book.book_url || "",
      summary: book.summary || "",
      genre: book.genre || "",
      sentiment: book.sentiment || "",
      recommendation_note: book.recommendation_note || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8001/api/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong while asking the question");
        return;
      }

      setAnswer(data.answer || "No answer found");
      setSource(data.source || null);
    } catch (error) {
      console.log(error);
      alert("Something went wrong while asking the question");
    }
  };

  const genreOptions = [
    "all",
    ...new Set(
      books
        .map((book) => book.genre)
        .filter((genre) => genre && genre.trim() !== "")
    ),
  ];

  const filteredBooks = books
    .filter((book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) => {
      if (ratingFilter === "all") return true;
      return (book.rating || 0) >= parseFloat(ratingFilter);
    })
    .filter((book) => {
      if (genreFilter === "all") return true;
      return (book.genre || "").toLowerCase() === genreFilter.toLowerCase();
    });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === "title-asc") {
      return (a.title || "").localeCompare(b.title || "");
    }
    if (sortOption === "title-desc") {
      return (b.title || "").localeCompare(a.title || "");
    }
    if (sortOption === "rating-high") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortOption === "rating-low") {
      return (a.rating || 0) - (b.rating || 0);
    }
    return 0;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(7, 12, 24, 0.86), rgba(7, 12, 24, 0.90))",
        }}
      ></div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          padding: "32px 18px 50px",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "26px",
              fontSize: "40px",
              fontWeight: "800",
              letterSpacing: "0.4px",
              textShadow: "0 4px 18px rgba(0,0,0,0.45)",
            }}
          >
            📚 Book Intelligence Platform
          </h1>

          <div style={panelStyle}>
            <div style={toolbarGridStyle}>
              <input
                type="text"
                placeholder="🔍 Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="all">All Ratings</option>
                <option value="4">4+ Rating</option>
                <option value="4.5">4.5+ Rating</option>
              </select>

              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                style={inputStyle}
              >
                {genreOptions.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre === "all" ? "All Genres" : genre}
                  </option>
                ))}
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={inputStyle}
              >
                <option value="default">Default Sort</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="rating-high">Rating High to Low</option>
                <option value="rating-low">Rating Low to High</option>
              </select>
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={sectionHeading}>🤖 Ask Questions About Books</h2>

            <input
              type="text"
              placeholder="Ask something like: Which book is about habits?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleAskQuestion} style={accentButton}>
              Ask
            </button>

            {answer && (
              <div style={answerBoxStyle}>
                <p><strong>Answer:</strong> {answer}</p>

                {source && (
                  <div style={{ marginTop: "12px" }}>
                    <p><strong>Source Title:</strong> {source.title}</p>
                    <p><strong>Author:</strong> {source.author}</p>
                    <p><strong>Summary:</strong> {source.summary}</p>
                    {source.book_url && (
                      <p>
                        <strong>Book URL:</strong>{" "}
                        <a
                          href={source.book_url}
                          target="_blank"
                          rel="noreferrer"
                          style={linkStyle}
                        >
                          Open Link
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={sectionHeading}>
              {editId ? "✏️ Edit Book" : "➕ Add New Book"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                style={inputStyle}
              />

              <input
                type="number"
                step="0.1"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                style={inputStyle}
              />

              <input
                type="number"
                name="reviews"
                placeholder="Reviews"
                value={formData.reviews}
                onChange={handleChange}
                style={inputStyle}
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                style={textareaStyle}
              />

              <input
                type="text"
                name="book_url"
                placeholder="Book URL"
                value={formData.book_url}
                onChange={handleChange}
                style={inputStyle}
              />

              <textarea
                name="summary"
                placeholder="Summary"
                value={formData.summary}
                onChange={handleChange}
                style={textareaStyle}
              />

              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formData.genre}
                onChange={handleChange}
                style={inputStyle}
              />

              <input
                type="text"
                name="sentiment"
                placeholder="Sentiment"
                value={formData.sentiment}
                onChange={handleChange}
                style={inputStyle}
              />

              <textarea
                name="recommendation_note"
                placeholder="Recommendation Note"
                value={formData.recommendation_note}
                onChange={handleChange}
                style={textareaStyle}
              />

              <div style={{ marginTop: "6px" }}>
                <button type="submit" style={primaryButton}>
                  {editId ? "Update Book" : "Add Book"}
                </button>

                {editId && (
                  <button type="button" onClick={clearForm} style={secondaryButton}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {sortedBooks.length === 0 ? (
            <div style={emptyStateStyle}>😢 No books found</div>
          ) : (
            <div style={bookGridStyle}>
              {sortedBooks.map((book) => (
                <div key={book.id} style={bookCardStyle}>
                  <h3 style={{ marginBottom: "12px", fontSize: "24px", color: "#ffffff" }}>
                    {book.title}
                  </h3>
                  <p><strong>👤 Author:</strong> {book.author}</p>
                  <p><strong>⭐ Rating:</strong> {book.rating}</p>
                  <p><strong>📚 Genre:</strong> {book.genre}</p>
                  <p><strong>💬 Sentiment:</strong> {book.sentiment}</p>

                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/book/${book.id}`)}
                      style={warningButton}
                    >
                      View Details
                    </button>

                    <button onClick={() => handleEdit(book)} style={infoButton}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(book.id)} style={dangerButton}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "rgba(15, 23, 42, 0.72)",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "22px",
  borderRadius: "20px",
  marginBottom: "24px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
};

const sectionHeading = {
  marginBottom: "18px",
  fontSize: "25px",
  fontWeight: "700",
  color: "#ffffff",
};

const toolbarGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
};

const bookGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const bookCardStyle = {
  background: "rgba(15, 23, 42, 0.78)",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.26)",
  color: "#e5e7eb",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "13px 14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  fontSize: "15px",
  background: "rgba(248, 250, 252, 0.96)",
  color: "#111827",
  boxSizing: "border-box",
};

const textareaStyle = {
  display: "block",
  width: "100%",
  padding: "13px 14px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  fontSize: "15px",
  minHeight: "100px",
  resize: "vertical",
  background: "rgba(248, 250, 252, 0.96)",
  color: "#111827",
  boxSizing: "border-box",
};

const primaryButton = {
  padding: "12px 20px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "10px",
  fontWeight: "700",
};

const secondaryButton = {
  padding: "12px 20px",
  background: "#64748b",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const accentButton = {
  padding: "12px 22px",
  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "10px",
};

const warningButton = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #f59e0b, #d97706)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const infoButton = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const dangerButton = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
};

const answerBoxStyle = {
  background: "rgba(255,255,255,0.08)",
  padding: "16px",
  borderRadius: "14px",
  marginTop: "12px",
  color: "#f1f5f9",
};

const emptyStateStyle = {
  textAlign: "center",
  fontSize: "18px",
  padding: "28px",
  background: "rgba(15, 23, 42, 0.72)",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const linkStyle = {
  color: "#93c5fd",
  textDecoration: "none",
  fontWeight: "600",
};

export default App;