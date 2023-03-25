import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import ColField from '../../components/ColField'
import AddressView from '../../components/AddressView'

const AddressBook = ({ navigation }) => {

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [defaultBilling, setDefaultBilling] = useState('');
  const [defaultShipping, setDefaultShipping] = useState('');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {

    navigation.addListener('focus', async () => {
      const user = auth.currentUser;
      if (user) {
        const { uid } = user;
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setDefaultBilling(docSnap.data().default_billing);
          setDefaultShipping(docSnap.data().default_shipping);
          setAddresses(docSnap.data().addresses);
        }

        setLoading(false)
      }
    })

  }, [navigation])


  useEffect(() => {
    const user = auth.currentUser;
    if (user) {

      const getUser = async () => {
        const { uid } = user;
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setDefaultBilling(docSnap.data().default_billing);
          setDefaultShipping(docSnap.data().default_shipping);
          setAddresses(docSnap.data().addresses);
        }

        setLoading(false)
      }
      getUser();
    }
  }, []);

  const callbackAddresses = async ({ index, value, valueFor, type }) => {
    if (type == 'submit') {
      const user = auth.currentUser;
      if (user) {
        const { uid } = user;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { addresses: userData.addresses });
      }
    } else if (type == 'set') {
      switch (valueFor) {
        case 'billing': userData.default_billing = index; setDefaultBilling(index); break;
        case 'shipping': userData.default_shipping = index; setDefaultShipping(index); break;
      }
    } else if (type == 'delete') {
      setAddresses((prevAddresses) => (prevAddresses.filter((e, filterIndex) => (filterIndex != index))));
    } else {
      switch (valueFor) {
        case 'address': userData.addresses[index].address = value; break;
        case 'code': userData.addresses[index].code = value; break;
        case 'name': userData.addresses[index].name = value; break;
        case 'contact_number': userData.addresses[index].mobile = value; break;
      }
    }
  }

  const handleAddAddress = () => {
    navigation.navigate('AddAddress', { addresses: userData.addresses });
  }

  return (
    loading ? <Text>Loading</Text> :
      <ScrollView className="flex flex-1 bg-white px-2">

        <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5">
          <Text className="text-accent-dark text-3xl font-bold mb-5">Defaults</Text>

          <View className="flex flex-col my-2">
            <Text className="text-xl font-bold text-accent-dark">Default Shipping Address</Text>
            <Text className="text-lg">{addresses[defaultShipping]?.address || 'No default shipping address set'}</Text>
          </View>

          <View className="flex flex-col my-2">
            <Text className="text-xl font-bold text-accent-dark">Default Billing Address</Text>
            <Text className="text-lg">{addresses[defaultBilling]?.address || 'No default billing address set'}</Text>
          </View>
        </View>


        <View className="bg-white shadow-md px-5 py-3 rounded-lg mb-5">
          <Text className="text-accent-dark text-3xl font-bold mb-5">Addresses</Text>

          <View>
            {(userData && userData.addresses) && addresses.map((address, index) => (
              <AddressView userData={userData} key={index} address={address} index={index} limit={userData.addresses.length - 1} callbackAddresses={callbackAddresses} />
            ))}

            <TouchableOpacity onPress={handleAddAddress} className="py-3 bg-accent-default rounded-md mt-5">
              <Text className="text-base text-center text-white">Add Address</Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>
  )
}
export default AddressBook