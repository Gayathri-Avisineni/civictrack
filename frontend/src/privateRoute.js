
import { Navigate,useLocation } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // User not logged in
  if (!role) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Role not allowed
  if (!allowedRoles.includes(role)) {
    if (role === "authority") {
      return (
        <div style={styles.overlay}>
          <div style={styles.card}>

            <div style={styles.icon}>🚫</div>

            <h2 style={styles.title}>Access Restricted</h2>

            <p style={styles.text}>
              Only <strong>citizens</strong> can report issues.<br />
              Please login as a citizen to continue.
            </p>

            <button
              style={styles.button}
              onClick={() => window.location.replace("/home")}
            >
              Go to Home
            </button>

          </div>
        </div>
      );
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}

// 🎨 Stylish Glassmorphism + Fade Animation
const styles = {
  overlay: {
    height: "100vh",
    width: "100vw",
    backdropFilter: "blur(10px)",
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    animation: "fadeIn 0.5s ease-in-out",
  },

  card: {
    width: "380px",
    padding: "30px",
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    textAlign: "center",
    color: "#fff",
    animation: "slideUp 0.45s ease-out",
  },

  icon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  text: {
    fontSize: "16px",
    opacity: 0.9,
    marginBottom: "25px",
    lineHeight: "1.5",
  },

  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #4c8bff, #1752ff)",
    color: "white",
    fontWeight: "bold",
    transition: "0.3s",
  }
};

// Injecting animation styles into document
const animations = `
@keyframes fadeIn {
  from { opacity: 0; } 
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; } 
  to { transform: translateY(0); opacity: 1; }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = animations;
document.head.appendChild(styleSheet);

export default PrivateRoute;