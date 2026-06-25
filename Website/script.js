<script src="script.js"></script>
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. MANAJEMEN MODAL & FORM REGISTRASI
    // ==========================================
    const modal = document.getElementById("registerModal");
    const btnDaftar = document.getElementById("btnDaftar");
    const btnClose = document.getElementById("closeModal");
    const registerForm = document.getElementById("registerForm");

    // Buka Modal ketika tombol pendaftaran diklik
    if (btnDaftar && modal) {
        btnDaftar.onclick = function() {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Kunci scroll latar belakang
        }
    }

    // Tutup Modal ketika tombol (X) diklik
    if (btnClose && modal) {
        btnClose.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Aktifkan kembali scroll
        }
    }

    // Tutup Modal jika area di luar card form diklik
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    // Handler Submit Form Registrasi
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Ambil data form
            const formData = new FormData(this);
            const nama = formData.get("nama");
            const acara = formData.get("acara");

            // Contoh simulasi penanganan pendaftaran sukses
            alert(`Terima kasih ${nama}! Pendaftaran Anda untuk acara '${acara}' telah berhasil dikonfirmasi.`);
            
            // Reset form dan tutup modal
            registerForm.reset();
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }


    // ==========================================
    // 2. NAVIGASI HEADER (EFEK SCROLL)
    // ==========================================
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });


    // ==========================================
    // 3. MENU MOBILE HAMBURGER (RESPONSIF)
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("toggle");
        });
    }


    // ==========================================
    // 4. SISTEM TAB JADWAL (TIMELINE)
    // ==========================================
    const tabButtons = document.querySelectorAll(".timeline-tab-btn");
    const timelineWrappers = document.querySelectorAll(".timeline-wrapper");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            // Ubah button aktif
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Tampilkan timeline yang sesuai
            timelineWrappers.forEach(wrapper => {
                if (wrapper.getAttribute("id") === targetTab) {
                    wrapper.classList.add("active");
                } else {
                    wrapper.classList.remove("active");
                }
            });
        });
    });


    // ==========================================
    // 5. SIMULASI FITUR VOTE KARYA EXPO
    // ==========================================
    const voteButtons = document.querySelectorAll(".btn-vote-action");

    voteButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (this.classList.contains("voted")) return; // Cegah vote berulang

            // Cari container bar terdekat
            const card = this.closest(".vote-card");
            const countElement = card.querySelector(".vote-count");
            const fillElement = card.querySelector(".vote-bar-fill");

            // Ambil total vote saat ini dan tambahkan 1
            let currentVotes = parseInt(countElement.innerText.replace(/\D/g, '')) || 0;
            currentVotes++;

            // Update UI teks vote
            countElement.innerText = `${currentVotes} Votes`;

            // Tandai tombol sebagai sudah dipilih (Voted)
            this.classList.add("voted");
            this.innerHTML = `<i class="fa-solid fa-check"></i> Voted`;
            this.disabled = true;

            // Simulasi animasi update panjang progress bar (misal ditambah 5% dari posisi awal)
            let currentWidth = parseFloat(fillElement.style.width) || 40; 
            let newWidth = Math.min(currentWidth + 5, 100);
            fillElement.style.width = `${newWidth}%`;
        });
    });
});