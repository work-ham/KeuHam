# KeuHam - Aplikasi Keuangan Bulanan Ilham

## Deskripsi Aplikasi

KeuHam adalah aplikasi keuangan pribadi berbasis web yang dirancang khusus untuk membantu Saya mengelola keuangan bulanan dengan mudah dan efektif. Aplikasi ini memungkinkan pencatatan pemasukan dan pengeluaran, analisis keuangan, serta penyimpanan data transaksi.

## Fitur Utama

✅ **Manajemen Transaksi**  
- Catat pemasukan dan pengeluaran  
- Kategorikan transaksi  
- Edit dan hapus transaksi  
- Filter transaksi berdasarkan bulan dan jenis  

📊 **Dashboard Keuangan**  
- Tampilkan saldo bulanan  
- Ringkasan pemasukan dan pengeluaran  
- Grafik visualisasi keuangan  

💾 **Manajemen Data**  
- Simpan data transaksi dalam file TXT  
- Export/Import data  
- Backup data keuangan  

## Teknologi Yang Digunakan

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Chart.js (untuk visualisasi data)
- Font Awesome (untuk ikon)

## Cara Instalasi

1. Clone repository ini atau download sebagai ZIP
   ```
   git clone https://github.com/username/KeuHam.git
   ```

2. Buat folder `data` di dalam direktori utama
   ```
   mkdir data
   ```

3. Buat file `transaksi.txt` di dalam folder data
   ```
   touch data/transaksi.txt
   ```

4. Buka file `index.html` di browser favorit Anda

## Cara Penggunaan

1. **Menambahkan Transaksi Baru**:
   - Pilih jenis transaksi (Pemasukan/Pengeluaran)
   - Masukkan jumlah nominal
   - Pilih kategori
   - Tambahkan tanggal dan keterangan (opsional)
   - Klik "Simpan"

2. **Mengedit Transaksi**:
   - Klik tombol pensil (edit) pada transaksi yang ingin diubah
   - Ubah data yang diperlukan di form
   - Klik "Update" untuk menyimpan perubahan

3. **Menghapus Transaksi**:
   - Klik tombol tong sampah (delete) pada transaksi yang ingin dihapus
   - Konfirmasi penghapusan

4. **Filter Transaksi**:
   - Gunakan dropdown filter untuk melihat transaksi berdasarkan bulan/jenis tertentu
   - Klik "Reset" untuk menampilkan semua transaksi

5. **Export/Import Data**:
   - Export: Klik "Export Data" untuk menyimpan data ke file TXT
   - Import: Klik "Import Data" dan pilih file TXT yang berisi data transaksi

## Struktur File

```
KeuHam/
├── index.html          # File utama aplikasi
├── style.css           # Stylesheet aplikasi
├── script.js           # Logika aplikasi
├── data/
│   └── transaksi.txt   # Penyimpanan data transaksi
└── README.md           # Dokumentasi ini
```

## Kontribusi

Jika Anda ingin berkontribusi pada pengembangan KeuHam, silakan:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -am 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Aplikasi ini dilisensikan di bawah [MIT License](LICENSE).

---

**KeuHam** © 2025 - Aplikasi Keuangan Bulanan Ilham  
*"Mengatur Keuangan dengan Lebih Mudah dan Terencana"*
