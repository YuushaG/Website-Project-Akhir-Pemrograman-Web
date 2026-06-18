CREATE DATABASE technofest;
USE technofest;

CREATE TABLE registrasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    nim_identitas VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    instansi VARCHAR(150) NOT NULL,
    status ENUM(
        'Mahasiswa Amikom Purwokerto',
        'Mahasiswa Universitas Lain',
        'Masyarakat Umum'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

