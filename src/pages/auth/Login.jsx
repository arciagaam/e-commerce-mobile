import React, { createContext, useContext, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native';
import { Formik, useFormik } from 'formik';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../authContext';


const Login = ({ navigation }) => {

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const { signIn } = useContext(AuthContext);

    const handleLogin = async (credentials, setSubmitting) => {
        signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then(async (userCredentials) => {
                // Signed In
                const { email, uid } = userCredentials.user;
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const { role } = docSnap.data();
                    await AsyncStorage.setItem('user', JSON.stringify({ email, uid, role }));
                    signIn({ email: credentials.email, password: credentials.password, uid: uid })

                } else {
                    console.warn('Something went wrong!');
                }
            }).catch((err) => {
                if (err.message.includes('wrong-password') || err.message.includes('invalid-email')) {
                    setMessage('Invalid email or password.');
                    setSubmitting(false);


                } else if (err.message.includes('user-not-found')) {
                    setMessage('Invalid email or password.');
                    setSubmitting(false);

                } else {
                    console.error(err);
                    setMessage('Something went wrong');
                    setSubmitting(false);

                }
            });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' className="bg-white py-5">
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.email == '' || values.password == '') {
                        setMessage('Email or Password should not be empty.');
                        setMessageType('fail');
                        setSubmitting(false);
                    } else {
                        handleLogin(values, setSubmitting);
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, isSubmitting, values }) => (

                    <View className="flex flex-col flex-1 w-full gap-y-4 px-5">

                        <View className="flex flex-col gap-y-1">
                            <Text className="text-accent-dark font-bold text-xl">Email</Text>
                            <TextInput
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                placeholder='Enter email'
                                style={{ fontSize: 20 }}
                                className='border border-accent-light rounded-md py-2 px-1'
                            />
                        </View>

                        <View className="flex flex-col gap-y-1">
                            <Text className="text-accent-dark font-bold text-xl">Password</Text>
                            <TextInput
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={true}
                                style={{ fontSize: 20 }}
                                placeholder='Enter password'
                                className='border border-accent-light rounded-md py-2 px-1'
                            />
                        </View>

                        {!isSubmitting && (
                            <TouchableOpacity className="flex flex-col justify-center items-center py-2 bg-accent-default rounded-md" onPress={handleSubmit}>
                                <Text className="text-lg font-bold text-white">Login</Text>
                            </TouchableOpacity>
                        )}

                        {isSubmitting && (
                            <TouchableOpacity className="flex flex-col justify-center items-center py-2 bg-accent-default rounded-md">
                                <ActivityIndicator size="small" color='#ffffff' />
                            </TouchableOpacity>
                        )}

                        <Text className="self-center text-red-500 text-sm italic">{message}</Text>
                    </View>
                )}
            </Formik>

            <TouchableOpacity className="self-center" onPress={() => { navigation.navigate('Register') }}>
                <Text>Don't have an account yet? Register here.</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Login