import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { auth } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import ColField from '../../components/ColField'
import AuthContext from '../../authContext'

const Account = () => {
    const { signOut } = useContext(AuthContext);
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {

            const getUser = async () => {
                const { uid } = user;
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
            getUser();
        }
    }, []);


    return (
        <ScrollView className="flex flex-1 bg-white px-2">
            <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5 mt-5">
                <Text className="text-accent-dark text-3xl font-bold mb-5">Personal Profile</Text>

                <ColField label={'Full Name'} value={userData.full_name} editing={isEditing}/>
                <ColField label={'Email'} value={userData.email} editing={isEditing}/>
                <ColField label={'Mobile Number'} value={userData.mobile} editing={isEditing}/>
                <ColField label={'Birthday'} value={userData.birthday} editing={isEditing}/>
                <ColField label={'Gender'} value={userData.gender} editing={isEditing}/>

                <View className="flex flex-col mt-5">
                    <TouchableOpacity onPress={()=>{setIsEditing(!isEditing)}} className="flex-1 justify-center items-center bg-accent-default py-4 rounded-md">
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

                <ColField label={'Default Shipping Address'} value={userData.full_name}/>
                <ColField label={'Default Billing Address'} value={userData.full_name}/>
            </View>

            <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5">
                <Text className="text-accent-dark text-3xl font-bold mb-5">Recent Orders</Text>

                <ColField label={'Default Shipping Address'} value={userData.full_name}/>
                <ColField label={'Default Billing Address'} value={userData.full_name}/>
            </View>
        </ScrollView>
    )
}


export default Account