import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColField from './ColField'
import { auth, db } from '../firebase'
import { doc, updateDoc, arrayRemove} from 'firebase/firestore'

const AddressView = ({ address, index, limit, callbackAddresses, userData }) => {

    const [isEditing, setIsEditing] = useState(false);

    const callbackInput = ({ value, valueFor }) => {
        callbackAddresses({ index, value, valueFor });
    }

    const handleEditButton = () => {
        if(isEditing) callbackAddresses({type:"submit"});
        setIsEditing(!isEditing);
    }

    const handleDefaults = async ({type}) => {
        const user = auth.currentUser;
        if(!user) return;

        const {uid} = user;
        if(type == 'billing') {
            callbackAddresses({type:'set', index, valueFor:'billing'});
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {'default_billing':index})

        }else {
            callbackAddresses({type:'set', index, valueFor:'shipping'});
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {'default_shipping':index})
        }

    }

    const handleDelete = async (index) => {
        const user = auth.currentUser;
        if(user) {
            callbackAddresses({type:'delete', index});

            const {uid} = user;
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {
                addresses: arrayRemove(userData.addresses[index])
            });
        }
    }


    return (
        <View className={`flex flex-col gap-y-2 py-2 ${index != limit ? 'border-b border-b-accent-light' : ''}`}>

            <View className="flex flex-row items-center">
                <ColField extraClass={'flex-1 mr-5'} label={`Address ${index + 1}`} value={address.address} size={'small'} editing={isEditing} valueFor={'address'} callbackInput={callbackInput} />
                <ColField label={`Postal Code`} value={address.code} size={'small'} editing={isEditing} valueFor={'code'} callbackInput={callbackInput} />
            </View>
            <ColField label={`Name`} value={address.name} size={'small'} editing={isEditing} valueFor={'name'} callbackInput={callbackInput} />

            <View className="flex flex-row justify-between items-start">
                <ColField label={`Contact Number`} value={address.mobile} size={'small'} editing={isEditing} valueFor={'contact_number'} callbackInput={callbackInput} />

                <View className="flex flex-col">

                    <View className="flex flex-col">
                        <TouchableOpacity className="py-1 self-end" onPress={()=>{handleDefaults({type:'shipping'})}}>
                            <Text className="text-base">{userData.default_shipping == index ? 'Current Default Shipping' : 'Set as Default Shipping'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="py-1 self-end" onPress={()=>{handleDefaults({type:'billing'})}}>
                            <Text className="text-base">{userData.default_shipping == index ? 'Current Default Billing' : 'Set as Default Billing'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row mt-3 gap-x-3 self-end">
                        <TouchableOpacity className="py-1" onPress={handleEditButton}>
                            <Text className="text-base">{isEditing ? 'Save' : 'Edit'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="py-1" onPress={() => {handleDelete(index)}}>
                            <Text className="text-base">Delete</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>

        </View>
    )
}

export default AddressView