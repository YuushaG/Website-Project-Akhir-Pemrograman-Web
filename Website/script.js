import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// Tambahkan baris ini untuk Realtime Database:
// Tambahkan get, query, orderByChild, dan equalTo
import {
  getDatabase,
  ref,
  push,
  serverTimestamp,
  get,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZKahbijKeeQOScBv6GFM4sNpNE_Ktl6U",
  authDomain: "tech4fest-c31f1.firebaseapp.com",
  databaseURL:
    "https://tech4fest-c31f1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tech4fest-c31f1",
  storageBucket: "tech4fest-c31f1.firebasestorage.app",
  messagingSenderId: "314821922319",
  appId: "1:314821922319:web:8cf684dd199cce1b5e5d7a",
  measurementId: "G-QW0Z34HXQ3",
};

// Inisialisasi App, Analytics, dan Database
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// COUNTDOWN
const TARGET = new Date("June 19, 2026 08:30:00").getTime(); // Sesuaikan dengan waktu mulainya acara

function tick() {
  const now = Date.now();
  const diff = TARGET - now; // Menghitung selisih waktu (untuk hitung mundur)
  
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  if (diff <= 0) {
    // KONDISI 1: Waktu target sudah terlewati (Acara sedang berjalan)
    
    const heading = document.querySelector(".countdown-heading");
    if (heading) {
      heading.innerText = "🔥 Acara Sedang Berlangsung 🔥";
    }

    // Hitung waktu yang sudah berlalu
    const elapsed = now - TARGET;

    // Tampilkan hasil hitung naik
    set("days", String(Math.floor(elapsed / 86400000)).padStart(2, "0"));
    set("hours", String(Math.floor((elapsed % 86400000) / 3600000)).padStart(2, "0"));
    set("minutes", String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, "0"));
    set("seconds", String(Math.floor((elapsed % 60000) / 1000)).padStart(2, "0"));
    
  } else {
    // KONDISI 2: Waktu belum sampai target (Acara belum mulai, hitung mundur normal)
    set("days", String(Math.floor(diff / 86400000)).padStart(2, "0"));
    set("hours", String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"));
    set("minutes", String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"));
    set("seconds", String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"));
  }
}

setInterval(tick, 1000);
tick();

// HEADER SCROLL
window.addEventListener("scroll", () => {
  document
    .getElementById("main-header")
    .classList.toggle("scrolled", window.scrollY > 50);
  highlightNav();
});

// HAMBURGER
const hamburger = document.getElementById("hamburger-btn");
const nav = document.getElementById("main-nav");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
});
document.querySelectorAll(".nav-link").forEach((l) =>
  l.addEventListener("click", () => {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
  }),
);

// SMOOTH SCROLL
function navTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.pageYOffset - 85,
    behavior: "smooth",
  });
}

// SCROLL SPY
function highlightNav() {
  const pos = window.scrollY + 130;
  let current = "";
  document.querySelectorAll("section[id], .hero-section[id]").forEach((sec) => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight)
      current = sec.id;
  });
  if (current) {
    document.querySelectorAll(".nav-link").forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }
}

// MODALS
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

document.querySelectorAll(".modal-overlay").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("open");
  });
});

// POSTER
function openPoster(type) {
  if (type === "seminar") openModal("poster-seminar");
  else if (type === "funrun") openModal("poster-funrun");
  else if (type === "bazar") openModal("poster-bazar");
  else if (type === "mlbb") openModal("poster-mlbb");
}

// TIMELINE TABS
function switchDay(dayId, btn) {
  document
    .querySelectorAll(".timeline-wrapper")
    .forEach((w) => w.classList.remove("active"));
  document
    .querySelectorAll(".timeline-tab-btn")
    .forEach((b) => b.classList.remove("active"));
  const target = document.getElementById(dayId);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("active");
  else if (event && event.currentTarget)
    event.currentTarget.classList.add("active");
}

// FILTER KARYA
function filterKarya(cat, btn) {
  document
    .querySelectorAll(".filter-tab-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  document.querySelectorAll(".vote-card").forEach((card) => {
    const show = cat === "all" || card.getAttribute("data-category") === cat;
    card.style.display = show ? "flex" : "none";
    if (show) card.style.animation = "fadeUp 0.35s ease";
  });
}

// VOTE LOGIC
const votedCards = new Set();
const voteData = { window: 95, pixeladv: 163, smartcampus: 87 };
const maxVotes = { window: 200, pixeladv: 200, smartcampus: 200 };

let currentCaptchaAnswer = 0; // Variabel penyimpan jawaban benar captcha

function triggerVote(id, name) {
  // 1. Cek: Apakah karya sudah pernah divote sama user
  if (votedCards.has(id)) {
    alert(
      "Anda sudah memberikan suara untuk karya ini! Silakan dukung karya yang lain.",
    );
    return;
  }

  // 2. Simpan data karya yang divote ke dalam input tersembunyi
  document.getElementById("vote-target-id").value = id;
  document.getElementById("vote-target-name").value = name;

  // 3. Generate Soal Matematika Random (Angka 1 sampai 10)
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  currentCaptchaAnswer = num1 + num2;

  // 4. Tampilkan soal ke HTML & kosongkan kolom jawaban
  document.getElementById("captcha-question").innerText =
    `${num1} + ${num2} = ?`;
  document.getElementById("captcha-input").value = "";

  // 5. Buka modal
  openModal("vote-modal");
}

function confirmVote() {
  const id = document.getElementById("vote-target-id").value;
  const name = document.getElementById("vote-target-name").value;
  const userAnswer = document.getElementById("captcha-input").value.trim();

  // Validasi Jawaban Captcha
  if (userAnswer === "") {
    alert("Harap isi jawaban keamanan!");
    return;
  }
  if (parseInt(userAnswer) !== currentCaptchaAnswer) {
    alert("Jawaban hitungan salah! Kamu robot ya? 🤖 Coba lagi!");
    return;
  }

  // Jika Jawaban Benar, Eksekusi Vote
  closeModal("vote-modal");
  voteData[id]++;
  votedCards.add(id);
  updateVoteDisplay(id);

  const btn = document.getElementById("btn-" + id);
  if (btn) {
    btn.classList.add("voted");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Sudah Divote`;
    btn.disabled = true;
  }

  // Munculkan notifikasi
  showToast(`✅ Suara untuk "${name}" berhasil tercatat!`);
}

function updateVoteDisplay(id) {
  const count = voteData[id];
  const max = maxVotes[id];
  const pct = Math.min((count / max) * 100, 100).toFixed(0);
  const countEl = document.getElementById("count-" + id);
  const barEl = document.getElementById("bar-" + id);
  if (countEl) countEl.innerText = count;
  if (barEl) barEl.style.width = pct + "%";
}

// TOAST
function showToast(msg) {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(60px);
        background:var(--bg-card);border:1px solid rgba(0,229,255,0.3);box-shadow:0 8px 24px rgba(0,0,0,0.5),0 0 20px rgba(0,229,255,0.15);
        padding:14px 28px;border-radius:50px;font-size:14px;font-weight:700;color:var(--foreground);
        z-index:3000;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),opacity 0.4s ease;opacity:0;white-space:nowrap;`;
  t.innerText = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.transform = "translateX(-50%) translateY(0)";
    t.style.opacity = "1";
  });
  setTimeout(() => {
    t.style.transform = "translateX(-50%) translateY(60px)";
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

// REGISTRATION
async function submitRegistration() {
  // Mengambil nilai dari form HTML
  const nama = document.getElementById("reg-nama").value.trim();
  const nim = document.getElementById("reg-nim").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const institusi = document.getElementById("reg-institusi").value.trim();
  const status = document.getElementById("reg-status").value;

  // 1. Validasi Input
  if (!nama || !nim || !email || !institusi || !status) {
    alert("Harap lengkapi semua field, termasuk NIM/Identitas.");
    return;
  }

  // Validasi format email menggunakan Regular Expression
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Format email tidak valid.");
    return;
  }

  // 2. Ubah state tombol agar user tahu sedang proses (UX yang baik)
  const submitBtn = document.querySelector(
    "button[onclick*='submitRegistration']",
  );
  let originalBtnText = "Submit";
  if (submitBtn) {
    originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Menyimpan Data...";
    submitBtn.disabled = true; // Nonaktifkan tombol saat proses berjalan
  }

  // 3. Proses pengiriman ke Firebase Database
  try {
    const registrationsRef = ref(db, "register");

    // push() akan mengirimkan data-data di bawah ini ke tabel 'registrations'
    await push(registrationsRef, {
      nama: nama,
      nim: nim,
      email: email,
      institusi: institusi,
      status: status,
      waktu_daftar: serverTimestamp(), // Mencatat waktu presisi dari server
    });

    // 4. Jika berhasil, sembunyikan form dan tampilkan pesan sukses
    document.getElementById("register-form-wrap").style.display = "none";
    document.getElementById("register-success").style.display = "block";
  } catch (error) {
    // 5. Jika gagal (misal koneksi terputus)
    console.error("Error Firebase:", error);
    alert(
      "Terjadi kesalahan saat mendaftar. Pastikan koneksi internet stabil.",
    );
  } finally {
    // 6. Kembalikan kondisi tombol seperti semula setelah proses selesai/gagal
    if (submitBtn) {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}
window.submitRegistration = submitRegistration;

async function submitLogin() {
  const nim = document.getElementById("login-nim").value.trim();
  const nama = document.getElementById("login-nama").value.trim();

  if (!nim || !nama) {
    alert("Harap isi NIM dan Nama!");
    return;
  }

  // Ubah status tombol
  const submitBtn = document.querySelector("button[onclick*='submitLogin']");
  let originalText = "Masuk";
  if (submitBtn) {
    originalText = submitBtn.innerText;
    submitBtn.innerText = "Memeriksa...";
    submitBtn.disabled = true;
  }

  try {
    // Mencari data di Firebase berdasarkan NIM
    const registrationsRef = ref(db, "register");
    const searchQuery = query(
      registrationsRef,
      orderByChild("nim"),
      equalTo(nim),
    );
    const snapshot = await get(searchQuery);

    if (snapshot.exists()) {
      let found = false;
      let userData = null;

      // Cek apakah namanya juga cocok (toLowerCase agar tidak sensitif huruf besar/kecil)
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.nama.toLowerCase() === nama.toLowerCase()) {
          found = true;
          userData = data;
        }
      });

      if (found) {
        // Jika berhasil login, simpan datanya di Local Storage Browser
        localStorage.setItem("tech4fest_user", JSON.stringify(userData));
        closeModal("login-modal");
        alert(`Selamat datang kembali, ${userData.nama}!`);

        // Bersihkan form
        document.getElementById("login-nim").value = "";
        document.getElementById("login-nama").value = "";

        // Update tampilan header
        checkLoginStatus();
      } else {
        alert(
          "Nama tidak cocok dengan data NIM tersebut. Coba periksa ejaanmu.",
        );
      }
    } else {
      alert("NIM belum terdaftar. Silakan registrasi terlebih dahulu.");
    }
  } catch (error) {
    console.error("Error Firebase:", error);
    // Kita minta browser menampilkan pesan error asli dari Firebase
    alert("Error dari Firebase: " + error.message);
  } finally {
    if (submitBtn) {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  }
}

// Fungsi untuk mengecek apakah user sedang login dan mengubah tampilan Header
function checkLoginStatus() {
  const userStr = localStorage.getItem("tech4fest_user");
  const authButtons = document.getElementById("auth-buttons");
  const userProfile = document.getElementById("user-profile");
  const userGreeting = document.getElementById("user-greeting");

  if (userStr) {
    const user = JSON.parse(userStr);
    // Sembunyikan tombol Register/Login, tampilkan Profil
    authButtons.style.display = "none";
    userProfile.style.display = "flex";
    // Ambil kata pertama dari nama untuk sapaan
    const namaPanggilan = user.nama.split(" ")[0];
    userGreeting.innerText = `Halo, ${namaPanggilan}!`;
  } else {
    // Kondisi belum login
    authButtons.style.display = "flex";
    userProfile.style.display = "none";
  }
}

// Fungsi untuk Logout
function logout() {
  if (confirm("Apakah kamu yakin ingin keluar?")) {
    localStorage.removeItem("tech4fest_user");
    checkLoginStatus(); // Kembalikan header seperti semula
  }
}

// Jalankan pengecekan saat halaman pertama kali dibuka
checkLoginStatus();

// EKSPOS FUNGSI KE GLOBAL SCOPE
window.submitLogin = submitLogin;
window.logout = logout;

window.navTo = navTo;
window.highlightNav = highlightNav;
window.openModal = openModal;
window.closeModal = closeModal;
window.openPoster = openPoster;
window.switchDay = switchDay;
window.submitRegistration = submitRegistration;
window.triggerVote = triggerVote;
window.confirmVote = confirmVote;

// Mengekspos fungsi registrasi agar tombol Submit bekerja
if (typeof submitRegistration === "function") {
  window.submitRegistration = submitRegistration;
}