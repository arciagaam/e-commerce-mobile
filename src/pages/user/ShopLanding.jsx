import { View, Text, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useHeaderHeight } from '@react-navigation/elements';

const ShopLanding = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const dbRef = collection(db, 'collections');
            const docSnap = await getDocs(dbRef);

            let temp = [];

            docSnap.forEach(snap => {
                temp.push({ ...snap.data(), id: snap.id })
            })

            setCollections(temp);
            setLoading(false);
        }
        getData();

        // setCollections(_DATA);
        setLoading(false);
    }, [])

    const handleSelectCollection = (navigation, collection_id) => {
        navigation.navigate('Shop', {
            collection_id: collection_id,
        })
    }

    return (

        loading ? <View className={`flex flex-col bg-white pt-[64px]`}><Text>Loading</Text></View> :
            <ScrollView className={`flex flex-col bg-white`}>
                {collections && collections.map((collection, index) => (
                    <CollectionCard key={index} collection={collection} handleSelectCollection={handleSelectCollection} navigation={navigation} />
                ))}
            </ScrollView>
    )
}

const CollectionCard = ({ collection, handleSelectCollection, navigation }) => {
    return (
        <View className="flex flex-col aspect-square min-w-full">
            <ImageBackground className='flex flex-col justify-end h-full bg-center' imageStyle={{resizeMode:'cover'}} source={ collection.image_url == null ? require('../../../assets/cat_bg.png') : {url:collection.image_url}}>
                <View className="flex flex-col w-full items-center justify-center mt-auto bg-white py-5">
                    <View className="flex flex-col items-center justify-center">
                        <Text className="text-accent-dark font-bold text-2xl">{collection.title}</Text>
                        <Text className="text-accent-dark text-sm">{collection.description}</Text>
                    </View>
                    <TouchableOpacity className="mt-5 w-fit bg-accent-default py-2 px-5 rounded-sm" onPress={() => { handleSelectCollection(navigation, collection.id) }}>
                        <Text className="text-white">Shop</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

export default ShopLanding