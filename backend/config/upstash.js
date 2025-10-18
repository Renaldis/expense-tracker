import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Import konfigurasi dari file .env (environment variables)
// Agar data sensitif seperti URL dan TOKEN Upstash Redis bisa diambil dari file .env, bukan ditulis langsung di kode.
import 'dotenv/config';

// Membuat instance (objek) ratelimiter untuk membatasi request API
const ratelimit = new Ratelimit({
  // Menghubungkan Ratelimit ke database Redis yang tersimpan di environment variable (.env)
  // Upstash Redis digunakan sebagai penyimpanan data rate limit (berapa kali user sudah melakukan request)
  redis: Redis.fromEnv(),

  // Menentukan jenis pembatasan yang digunakan, yaitu sliding window
  // Ratelimit.slidingWindow(100, '60 s') artinya:
  // - Maksimum 100 request diizinkan
  // - Dalam periode waktu 60 detik (1 menit)
  // Sliding window berarti jika batas terlampaui, sistem akan menghitung ulang batas waktu secara bergeser,
  // bukan direset secara total di setiap interval waktu.
  limiter: Ratelimit.slidingWindow(4, '60 s'),
});

export default ratelimit;
