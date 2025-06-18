// Kategori transaksi
const categories = {
    pemasukan: ['Gaji', 'Bonus', 'Investasi', 'Hadiah', 'Lainnya'],
    pengeluaran: ['Makanan', 'Transportasi', 'Hiburan', 'Tagihan', 'Belanja', 'Kesehatan', 'Pendidikan', 'Lainnya']
};

// Inisialisasi data transaksi
let transactions = [];

// DOM Elements
const transaksiForm = document.getElementById('transaksi-form');
const jenisInput = document.getElementById('jenis');
const jumlahInput = document.getElementById('jumlah');
const kategoriInput = document.getElementById('kategori');
const tanggalInput = document.getElementById('tanggal');
const keteranganInput = document.getElementById('keterangan');
const daftarTransaksi = document.getElementById('daftar-transaksi');
const saldoElement = document.getElementById('saldo');
const totalPemasukanElement = document.getElementById('total-pemasukan');
const totalPengeluaranElement = document.getElementById('total-pengeluaran');
const filterBulanInput = document.getElementById('filter-bulan');
const filterJenisInput = document.getElementById('filter-jenis');
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const fileInput = document.getElementById('file-input');

// Chart instance
let financeChart;

// Set tanggal default ke hari ini
tanggalInput.valueAsDate = new Date();

// Update kategori berdasarkan jenis transaksi
jenisInput.addEventListener('change', function() {
    updateKategoriOptions(this.value);
});

// Fungsi untuk mengupdate opsi kategori
function updateKategoriOptions(jenis) {
    kategoriInput.innerHTML = '<option value="">Pilih Kategori</option>';
    
    if (jenis && categories[jenis]) {
        categories[jenis].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            kategoriInput.appendChild(option);
        });
    }
}

// Fungsi untuk memuat data dari file TXT
async function loadTransactions() {
    try {
        const response = await fetch('data/transaksi.txt');
        if (response.ok) {
            const data = await response.text();
            if (data) {
                transactions = JSON.parse(data);
                updateUI();
            }
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Fungsi untuk menyimpan data ke file TXT
async function saveTransactions() {
    try {
        // Dalam lingkungan nyata, ini akan memerlukan backend
        // Untuk demo, kita simpan di localStorage
        localStorage.setItem('transactions', JSON.stringify(transactions));
        console.log('Data disimpan (dalam lingkungan nyata akan disimpan ke file TXT)');
    } catch (error) {
        console.error('Error saving transactions:', error);
    }
}

// Fungsi untuk menambahkan transaksi baru
transaksiForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const jenis = jenisInput.value;
    const jumlah = parseFloat(jumlahInput.value);
    const kategori = kategoriInput.value;
    const tanggal = tanggalInput.value;
    const keterangan = keteranganInput.value;
    
    if (!jenis || isNaN(jumlah) || !kategori || !tanggal) {
        alert('Harap isi semua field yang diperlukan!');
        return;
    }
    
    const newTransaction = {
        id: Date.now(),
        jenis,
        jumlah,
        kategori,
        tanggal,
        keterangan: keterangan || '-'
    };
    
    transactions.push(newTransaction);
    saveTransactions();
    updateUI();
    transaksiForm.reset();
    tanggalInput.valueAsDate = new Date();
});

// Fungsi untuk mengupdate UI
function updateUI() {
    // Filter transaksi berdasarkan bulan dan jenis
    const bulanFilter = filterBulanInput.value;
    const jenisFilter = filterJenisInput.value;
    
    let filteredTransactions = [...transactions];
    
    if (bulanFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(trans => {
            const transDate = new Date(trans.tanggal);
            return transDate.getMonth() + 1 === parseInt(bulanFilter);
        });
    }
    
    if (jenisFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(trans => trans.jenis === jenisFilter);
    }
    
    // Tampilkan transaksi
    displayTransactions(filteredTransactions);
    
    // Hitung total
    calculateTotals();
    
    // Update chart
    updateChart();
    
    // Update opsi bulan filter
    updateMonthFilterOptions();
}

// Fungsi untuk menampilkan transaksi
function displayTransactions(transactionsToDisplay) {
    if (transactionsToDisplay.length === 0) {
        daftarTransaksi.innerHTML = '<p class="empty-message">Tidak ada transaksi yang sesuai dengan filter.</p>';
        return;
    }
    
    daftarTransaksi.innerHTML = '';
    
    // Urutkan berdasarkan tanggal (terbaru pertama)
    transactionsToDisplay.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    transactionsToDisplay.forEach(trans => {
        const transElement = document.createElement('div');
        transElement.className = `transaction-item transaction-${trans.jenis}`;
        
        const dateObj = new Date(trans.tanggal);
        const formattedDate = dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        transElement.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-date">${formattedDate}</div>
                <div class="transaction-category">${trans.kategori}</div>
                <div class="transaction-desc">${trans.keterangan}</div>
            </div>
            <div class="transaction-amount">
                ${trans.jenis === 'pemasukan' ? '+' : '-'}Rp${trans.jumlah.toLocaleString('id-ID')}
            </div>
        `;
        
        daftarTransaksi.appendChild(transElement);
    });
}

// Fungsi untuk menghitung total
function calculateTotals() {
    const totalPemasukan = transactions
        .filter(trans => trans.jenis === 'pemasukan')
        .reduce((sum, trans) => sum + trans.jumlah, 0);
    
    const totalPengeluaran = transactions
        .filter(trans => trans.jenis === 'pengeluaran')
        .reduce((sum, trans) => sum + trans.jumlah, 0);
    
    const saldo = totalPemasukan - totalPengeluaran;
    
    totalPemasukanElement.textContent = `Rp${totalPemasukan.toLocaleString('id-ID')}`;
    totalPengeluaranElement.textContent = `Rp${totalPengeluaran.toLocaleString('id-ID')}`;
    saldoElement.textContent = `Rp${saldo.toLocaleString('id-ID')}`;
    
    // Update warna saldo berdasarkan nilai
    if (saldo > 0) {
        saldoElement.style.color = 'var(--income-color)';
    } else if (saldo < 0) {
        saldoElement.style.color = 'var(--expense-color)';
    } else {
        saldoElement.style.color = 'inherit';
    }
}

// Fungsi untuk update chart
function updateChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    
    // Kelompokkan transaksi per bulan
    const monthlyData = {};
    
    transactions.forEach(trans => {
        const date = new Date(trans.tanggal);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                pemasukan: 0,
                pengeluaran: 0
            };
        }
        
        monthlyData[monthYear][trans.jenis] += trans.jumlah;
    });
    
    const labels = Object.keys(monthlyData).sort();
    const pemasukanData = labels.map(label => monthlyData[label].pemasukan);
    const pengeluaranData = labels.map(label => monthlyData[label].pengeluaran);
    
    if (financeChart) {
        financeChart.destroy();
    }
    
    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: pemasukanData,
                    backgroundColor: 'rgba(46, 196, 182, 0.7)',
                    borderColor: 'rgba(46, 196, 182, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: pengeluaranData,
                    backgroundColor: 'rgba(231, 29, 54, 0.7)',
                    borderColor: 'rgba(231, 29, 54, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp' + value.toLocaleString('id-ID');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += 'Rp' + context.raw.toLocaleString('id-ID');
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Fungsi untuk update opsi bulan filter
function updateMonthFilterOptions() {
    const uniqueMonths = new Set();
    
    transactions.forEach(trans => {
        const date = new Date(trans.tanggal);
        const month = date.getMonth() + 1; // 1-12
        const year = date.getFullYear();
        uniqueMonths.add(`${month}/${year}`);
    });
    
    const sortedMonths = Array.from(uniqueMonths).sort((a, b) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);
        
        if (yearA !== yearB) return yearB - yearA;
        return monthB - monthA;
    });
    
    filterBulanInput.innerHTML = '<option value="all">Semua Bulan</option>';
    
    sortedMonths.forEach(monthYear => {
        const [month, year] = monthYear.split('/');
        const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long' });
        const option = document.createElement('option');
        option.value = month;
        option.textContent = `${monthName} ${year}`;
        filterBulanInput.appendChild(option);
    });
}

// Event listener untuk filter
filterBtn.addEventListener('click', updateUI);
resetBtn.addEventListener('click', function() {
    filterBulanInput.value = 'all';
    filterJenisInput.value = 'all';
    updateUI();
});

// Fungsi untuk export data
exportBtn.addEventListener('click', function() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi_keuangan_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Fungsi untuk import data
importBtn.addEventListener('click', function() {
    fileInput.click();
});

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                transactions = importedData;
                saveTransactions();
                updateUI();
                alert('Data berhasil diimpor!');
            } else {
                alert('Format file tidak valid!');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Gagal mengimpor data!');
        }
    };
    reader.readAsText(file);
});

// Load data saat pertama kali dijalankan
document.addEventListener('DOMContentLoaded', function() {
    // Coba muat dari localStorage untuk demo
    const savedData = localStorage.getItem('transactions');
    if (savedData) {
        transactions = JSON.parse(savedData);
    }
    
    updateUI();
    
    // Untuk implementasi nyata dengan file TXT, uncomment ini:
    // loadTransactions();
});