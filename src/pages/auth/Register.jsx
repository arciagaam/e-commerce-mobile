import React, { useEffect, useState, useContext } from 'react'
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Formik, useFormik } from 'formik';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../authContext';



const handleRegister = async (credentials, setSubmitting, signUp) => {
    createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then(async (userCredentials) => {
        const {email, uid} = userCredentials.user;
        try {
            await setDoc(doc(db, 'users', uid), {
                email: credentials.email,
                role:0
            })
            await AsyncStorage.setItem('user', JSON.stringify({email, uid, role:0}));
            signUp({email, uid, role:0})
        } catch (err) {
            console.error(err);
        }
    })

}

const Register = ({ navigation }) => {
    const { signUp } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' className="bg-white py-5">

            <Formik
                initialValues={{ email: '', password: '', confirm_password: '' }}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.email == '' || values.password == '') {
                        setMessage('Email or Password should not be empty.');
                        setMessageType('fail');
                        setSubmitting(false);
                    } else if (values.password !== values.confirm_password) {
                        setMessage('Passwords do not match.');
                        setMessageType('fail');
                        setSubmitting(false);
                    } else {
                        handleRegister(values, setSubmitting, signUp);
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

                        <View className="flex flex-col gap-y-1">
                            <Text className="text-accent-dark font-bold text-xl">Confirm Password</Text>
                            <TextInput
                                onChangeText={handleChange('confirm_password')}
                                onBlur={handleBlur('confirm_password')}
                                value={values.confirm_password}
                                secureTextEntry={true}
                                style={{ fontSize: 20 }}
                                placeholder='Confirm password'
                                className='border border-accent-light rounded-md py-2 px-1'
                            />
                        </View>

                        {!isSubmitting && (
                            <TouchableOpacity className="flex flex-col justify-center items-center py-2 bg-accent-default rounded-md" onPress={handleSubmit}>
                                <Text className="text-lg font-bold text-white">Create Account</Text>
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


            <TouchableOpacity className="self-center" onPress={() => { navigation.navigate('Login') }}>
                <Text>Already have an account? Login here.</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default Register