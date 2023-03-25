import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { auth } from '../../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import ColField from '../../components/ColField'
import AuthContext from '../../authContext'

const Account = ({ navigation }) => {
    const { signOut } = useContext(AuthContext);

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [birthday, setBirthday] = useState('')
    const [gender, setGender] = useState('')
    const [addresses, setAddresses] = useState([]);


    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true);

    const handleSubmitEdit = async () => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {
                full_name: fullName, email, mobile, birthday, gender
            })
        }
    }

    const callbackInput = ({ value, valueFor }) => {
        switch (valueFor) {
            case 'full_name': setFullName(value); break;
            case 'email': setEmail(value); break;
            case 'mobile': setMobile(value); break;
            case 'birthday': setBirthday(value); break;
            case 'gender': setGender(value); break;
            
        }
    }

    useEffect(() => {
        navigation.addListener('focus', async () => {
            const user = auth.currentUser;
            if (user) {
                const { uid } = user;
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                    setFullName(docSnap.data().full_name);
                    setEmail(docSnap.data().email);
                    setMobile(docSnap.data().mobile);
                    setBirthday(docSnap.data().birthday);
                    setGender(docSnap.data().gender);
                    setAddresses(docSnap.data().addresses);
                }
                setLoading(false)
            }
        })
    }, [navigation]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {

            const getUser = async () => {
                const { uid } = user;
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                    setFullName(docSnap.data().full_name);
                    setEmail(docSnap.data().email);
                    setMobile(docSnap.data().mobile);
                    setBirthday(docSnap.data().birthday);
                    setGender(docSnap.data().gender);
                    setAddresses(docSnap.data().addresses);
                }

                setLoading(false)
            }
            getUser();
        }
    }, []);

    return (
        loading ? <Text>Loading</Text> :

            <ScrollView className="flex flex-1 bg-white px-2">
                <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5 mt-5">
                    <Text className="text-accent-dark text-3xl font-bold mb-5">Personal Profile</Text>

                    <ColField label={'Full Name'} value={fullName} editing={isEditing} valueFor={'full_name'} callbackInput={callbackInput} />
                    <ColField label={'Email'} value={email} editing={isEditing} valueFor={'email'} callbackInput={callbackInput} />
                    <ColField label={'Mobile Number'} value={mobile} editing={isEditing} valueFor={'mobile'} callbackInput={callbackInput} />
                    <ColField label={'Birthday'} value={birthday} editing={isEditing} valueFor={'birthday'} callbackInput={callbackInput} />
                    <ColField label={'Gender'} value={gender} editing={isEditing} valueFor={'gender'} callbackInput={callbackInput} />

                    <View className="flex flex-col mt-5">
                        <TouchableOpacity onPress={() => { !isEditing ? setIsEditing(!isEditing) : handleSubmitEdit(); setIsEditing(!isEditing); }} className="flex-1 justify-center items-center bg-accent-default py-4 rounded-md">
                            <Text className="text-bold text-white">{isEditing ? 'Save' : 'Edit Details'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-1 justify-center items-center bg-accent-default py-4 rounded-md mt-5">
                            <Text className="text-bold text-white">Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5">
                    <Text className="text-accent-dark text-3xl font-bold mb-5">Address Book</Text>

                    <View className="flex flex-col my-2">
                        <Text className="text-xl font-bold text-accent-dark">Default Shipping Address</Text>
                        <Text className="text-lg">{addresses[userData.default_shipping]?.address || 'No default shipping address set'}</Text>
                    </View>

                    <View className="flex flex-col my-2">
                        <Text className="text-xl font-bold text-accent-dark">Default Billing Address</Text>
                        <Text className="text-lg">{addresses[userData.default_billing]?.address || 'No default billing address set'}</Text>
                    </View>
                </View>

                <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5">
                    <Text className="text-accent-dark text-3xl font-bold mb-5">Recent Orders</Text>
                    <Text>ORDERS GO HERE</Text>
                </View>
            </ScrollView>
    )
}


export default Account