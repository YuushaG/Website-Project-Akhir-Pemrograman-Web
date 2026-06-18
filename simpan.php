<?php

include "koneksi.php";

$nama = $_POST['nama_lengkap'];
$nim = $_POST['nim_identitas'];
$email = $_POST['email'];
$instansi = $_POST['instansi'];
$status = $_POST['status'];

$sql = "INSERT INTO registrasi
(nama_lengkap,nim_identitas,email,instansi,status)
VALUES
('$nama','$nim','$email','$instansi','$status')";

if(mysqli_query($conn,$sql)){
    echo "Data berhasil disimpan";
}else{
    echo "Error: " . mysqli_error($conn);
}

?>