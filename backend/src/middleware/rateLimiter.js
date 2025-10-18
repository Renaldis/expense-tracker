import ratelimit from '../config/upstash.js';

// Membuat middleware bernama rateLimiter
// Middleware ini akan mengecek apakah pengguna (client) sudah melewati batas jumlah request yang diizinkan.
const rateLimiter = async (req, res, next) => {
  try {
    // Memanggil fungsi limit() dari objek ratelimit
    // Parameter 'my-rate-limit' berfungsi sebagai *key unik* untuk menyimpan data limit di Redis.
    // Biasanya key ini bisa diganti dengan sesuatu yang dinamis seperti IP pengguna atau token user,
    // agar pembatasan berlaku per pengguna, bukan secara global.
    const { success } = await ratelimit.limit('my-rate-limit');

    // Jika hasilnya "success" bernilai false, berarti batas request sudah terlampaui.
    if (!success) {
      // Kirim respon HTTP status 429 (Too Many Requests)
      // Memberi tahu client bahwa mereka sudah mengirim terlalu banyak request dalam waktu singkat.
      return res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    }
    next();
  } catch (error) {
    console.log('Rate limit error', error);
    next(error);
  }
};

export default rateLimiter;
