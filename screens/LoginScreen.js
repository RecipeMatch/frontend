import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useState,useEffect } from 'react'
import ListIcon from '../assets/list.svg';
import { auth } from '../firebase'; // firebase.js에서 auth 가져오기
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

console.log("✅ Imported Firebase Auth object in LoginScreen:", auth);
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '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', // Firebase Web Client ID
    });

    const handleSignup = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log('✅ User Created:', user);
        } catch (error) {
            console.error("🔥 Firebase Auth Error:", error.message);
        }
    };

    const handleLogin = async() => {
        console.log('Login button pressed');
    }

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);

            signInWithCredential(auth, credential)
                .then((userCredential) => {
                    console.log('✅ Google 로그인 성공:', userCredential.user);
                })
                .catch((error) => {
                    console.error('🔥 Google 로그인 실패:', error.message);
                });
        }
    }, [response]);

  return (
    <View
    style={styles.container}
    >
        <ListIcon/>
        <View style={styles.inputContainer}>
            <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            />
            <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            />
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            >
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={handleSignup}
            >
                <Text style={styles.buttonOutlineText}>회원가입</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={[styles.button, { marginTop: 10, backgroundColor: 'blue' }]}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Text style={styles.buttonText}>Google로 로그인</Text>
                </TouchableOpacity>
    </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer:{
        width: '80%',
        marginTop: 15
    },
    input:{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer:{
        width: '50%',
       justifyContent: 'center',
       alignItems: 'center',
       marginTop: 30
    },
    button:{
        backgroundColor: 'black',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline:{
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'black',
        borderWidth: 1
    },
    buttonText:{
        color: 'white',
        fontWeight: '500',
        fontSize: 16
    },
    buttonOutlineText:{
        color: 'black',
        fontWeight: '500',
        fontSize: 16
    }
})


export default LoginScreen