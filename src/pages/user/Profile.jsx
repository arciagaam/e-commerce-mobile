import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthContext from '../../authContext'

const handleLogout = async (signOut) => {
    try {
        await AsyncStorage.removeItem('user');
        signOut();
    } catch (e) {
        console.error(e);
    }
}

const Profile = ({ navigation }) => {
    const { signOut } = useContext(AuthContext);


    return (
        <View>
            <Text onPress={() => { handleLogout(signOut) }}>Profile</Text>


        </View>
    )
}

export default Profile