import { View } from 'react-native';

// Import hook 'useSafeAreaInsets' dari 'react-native-safe-area-context'
// Hook ini berguna untuk mendapatkan ukuran area aman (safe area) di layar,
// seperti jarak dari notch (poni), status bar, atau navigation bar
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../constants/colors';

const SafeScreen = ({ children }) => {
  // Memanggil hook 'useSafeAreaInsets' untuk mendapatkan nilai padding aman
  // Nilai yang didapat meliputi: top, bottom, left, dan right
  const insets = useSafeAreaInsets();

  // Mengembalikan tampilan utama menggunakan komponen View
  return (
    <View
      style={{
        // Memberikan jarak bagian atas sesuai tinggi area aman perangkat
        // agar konten tidak tertutup oleh status bar atau notch
        paddingTop: insets.top,
        // Membuat View memenuhi seluruh ruang layar secara vertikal
        flex: 1,
        // Mengatur warna latar belakang layar sesuai tema aplikasi
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
