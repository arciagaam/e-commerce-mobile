import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColField from '../../components/ColField'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../firebase'
const AddAddress = ({ navigation, route }) => {

    const [address, setAddress] = useState('');
    const [code, setCode] = useState('');
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');

    const handleAddAddress = async () => {
        const user = auth.currentUser;

        if(user) {
            const {uid} = user;
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {
                addresses: arrayUnion({address: address, code: code, mobile:mobile, name:name})
            })
        }

        navigation.pop();
    }

    useEffect(() => {
        setAddress('')
        setCode('')
        setMobile('')
        setName('')
    }, [])

    const callbackInput = ({valueFor, value}) => {
        switch(valueFor) {
            case 'address' : setAddress(value); break;
            case 'code' : setCode(value); break;
            case 'mobile' : setMobile(value); break;
            case 'name' : setName(value); break;
        }
    }

    return (
        <ScrollView className="flex flex-1 bg-white px-2">
            <Text className="text-2xl font-bold mt-2 mb-5">Add Address</Text>

            <ColField valueFor={'address'} label={'Address'} size={'small'} editing={true} callbackInput={callbackInput} />
            <ColField valueFor={'code'} label={'Postal Code'} size={'small'} editing={true} callbackInput={callbackInput}/>
            <ColField valueFor={'mobile'} label={'Mobile Number'} size={'small'} editing={true} callbackInput={callbackInput}/>
            <ColField valueFor={'name'} label={'Full Name'} size={'small'} editing={true} callbackInput={callbackInput}/>

            <View className="flex flex-row gap-x-3">
                <TouchableOpacity onPress={() => {navigation.navigate('Address')}} className="bg-white py-2 rounded-md mt-5 flex-1 border border-accent-default">
                    <Text className="text-center text-accent-default text-base">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleAddAddress} className="bg-accent-default py-2 rounded-md mt-5 flex-1">
                    <Text className="text-center text-white text-base">Add Address</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default AddAddress