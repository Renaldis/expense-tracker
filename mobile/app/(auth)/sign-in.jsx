import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../../assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));

      if (err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Password is incorrect. Please try again.');
      } else {
        setError('An error occured. Please try again.');
      }
    }
  };

  return (
    // Komponen ini digunakan untuk membuat tampilan bisa bergulir (scrollable)
    // serta otomatis menyesuaikan posisi ketika keyboard muncul,
    // agar input field tidak tertutup oleh keyboard.
    <KeyboardAwareScrollView
      // style={{ flex: 1 }} artinya seluruh elemen di dalam komponen ini
      // akan mengambil ruang penuh dari layar secara vertikal.
      style={{ flex: 1 }}
      // contentContainerStyle={{ flexGrow: 1 }} digunakan agar konten di dalam scroll view
      // bisa diperluas sesuai tinggi konten (grow) dan tidak "menyusut" ketika isinya sedikit.
      // Ini memastikan tampilan tetap memenuhi layar meskipun jumlah elemen sedikit.
      contentContainerStyle={{ flexGrow: 1 }}
      // enableOnAndroid={true} mengaktifkan fitur "keyboard aware"
      // (penyesuaian otomatis saat keyboard muncul) di perangkat Android.
      enableOnAndroid={true}
      // enableAutomaticScroll={true} membuat scroll otomatis naik ke posisi input
      // yang sedang aktif (misalnya saat user mengetik di TextInput).
      enableAutomaticScroll={true}
      // menambahkan extra scroll sebanyak 100
      // extraScrollHeight={20}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/revenue-i4.png')}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={'#9A8478'}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor={'#9A8478'}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
