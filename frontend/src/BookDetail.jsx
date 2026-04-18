import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/api/books/")
      .then((res) => res.json())
      .then((data) => {
        const foundBook = data.find((item) => String(item.id) === String(id));
        setBook(foundBook || null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentWrapperStyle}>
          <div style={cardStyle}>
            <h2 style={{ color: "white" }}>Loading book details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={pageStyle}>
        <div style={overlayStyle}></div>
        <div style={contentWrapperStyle}>
          <div style={cardStyle}>
            <h2 style={{ color: "white", marginBottom: "14px" }}>
              Book not found 😢
            </h2>
            <button onClick={() => navigate("/")} style={backButtonStyle}>
              ⬅ Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>

      <div style={contentWrapperStyle}>
        <div style={cardStyle}>
          <button onClick={() => navigate("/")} style={backButtonStyle}>
            ⬅ Back to Home
          </button>

          <h1 style={titleStyle}>{book.title}</h1>

          <div style={gridStyle}>
            <div style={sectionBoxStyle}>
              <h3 style={sectionTitleStyle}>Basic Info</h3>
              <p><strong>Author:</strong> {book.author || "N/A"}</p>
              <p><strong>Rating:</strong> {book.rating || "N/A"}</p>
              <p><strong>Reviews:</strong> {book.reviews || "N/A"}</p>
              <p><strong>Genre:</strong> {book.genre || "N/A"}</p>
              <p><strong>Sentiment:</strong> {book.sentiment || "N/A"}</p>
            </div>

            <div style={sectionBoxStyle}>
              <h3 style={sectionTitleStyle}>Description</h3>
              <p>{book.description || "No description available."}</p>
            </div>

            <div style={sectionBoxStyle}>
              <h3 style={sectionTitleStyle}>Summary</h3>
              <p>{book.summary || "No summary available."}</p>
            </div>

            <div style={sectionBoxStyle}>
              <h3 style={sectionTitleStyle}>Recommendation Note</h3>
              <p>{book.recommendation_note || "No recommendation note available."}</p>
            </div>
          </div>

          {book.book_url && (
            <div style={{ marginTop: "20px" }}>
              <a
                href={book.book_url}
                target="_blank"
                rel="noreferrer"
                style={linkButtonStyle}
              >
                🔗 Open Book Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  position: "relative",
  fontFamily: "Arial, sans-serif",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(rgba(7, 12, 24, 0.86), rgba(7, 12, 24, 0.90))",
};

const contentWrapperStyle = {
  position: "relative",
  zIndex: 1,
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px 16px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "1000px",
  background: "rgba(15, 23, 42, 0.78)",
  border: "1px solid rgba(255,255,255,0.10)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "28px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.30)",
  color: "#e5e7eb",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "800",
  color: "#ffffff",
  marginBottom: "20px",
  textAlign: "center",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const sectionBoxStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "18px",
  lineHeight: "1.7",
};

const sectionTitleStyle = {
  color: "#ffffff",
  marginBottom: "10px",
  fontSize: "22px",
};

const backButtonStyle = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #64748b, #475569)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  marginBottom: "20px",
};

const linkButtonStyle = {
  display: "inline-block",
  padding: "12px 18px",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "700",
};

export default BookDetail;