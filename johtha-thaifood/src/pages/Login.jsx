import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login สำเร็จ");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        regEmail,
        regPassword
      );

      const user = userCredential.user;

      // ✅ save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: regName,
        email: regEmail,
        createdate: serverTimestamp()
      });

      alert("สมัครสำเร็จ");

      // reset + close modal
      setIsModalOpen(false);
      setRegName("");
      setRegEmail("");
      setRegPassword("");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 320,
          padding: 25,
          borderRadius: 16,
          background: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: "black", textAlign: "center", marginBottom: 20 }}>
          Johtha Thaifood 🛒
        </h2>

        {/* login inputs */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={loginBtn}>
          Login
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          style={registerBtn}
        >
          Create Account
        </button>
      </div>

      {/* 🔥 Modal */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: 15 }}>Create Account</h3>

            <input
              type="text"
              placeholder="Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleRegister} style={loginBtn}>
              สมัครสมาชิก
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              style={{ ...registerBtn, background: "#eee" }}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};

const loginBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #22c55e, #4ade80)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "5px"
};

const registerBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#adadad",
  cursor: "pointer",
  marginTop: "10px"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  width: 300,
  background: "white",
  padding: 20,
  borderRadius: 12
};