import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, doc, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../firebase';


const Home = ({navigation}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {

        const getData = async () => {
            const docRef = collection(db, 'products');
            const q = query(docRef, limit(10));
            const docSnap = await getDocs(q);
            const temp = [];
            docSnap.forEach(snap => {
                temp.push({...snap.data(), id:snap.id});
            })
            setProducts(temp);
        }
        getData();
    }, [])

    return (
        <ScrollView className="flex flex-1 flex-col bg-white">

            <View className="pt-5 px-2">
                <Text className="font-bold text-accent-dark text-7xl">Sinagtala.ph</Text>
                <Text className="text-accent-dark text-xl leading-[-5px]">Crochet your way to a blooming bouquet that never wilts, or go for the charm of everlasting beauty with our dried flower creations!</Text>
            </View>
            
            <Image className='h-[400px] aspect-square' source={require('./../../../assets/bg.png')} />

            {/* <Text className="w-full font-bold text-accent-dark text-3xl text-center bg-accent-light py-5">Categories</Text>
            <View className="flex flex-col gap-y-10">

                <View className="flex flex-col justify-center items-center gap-2">
                    <View className="flex flex-col justify-center items-center">
                        <Text className="text-accent-default text-lg">Lorem Ipsum</Text>
                        <Text className="text-accent-dark font-bold text-xl text-center">Dried Flower Bouquet</Text>
                    </View>
                    <Text className="text-accent-dark text-center max-w-[90%]">Lorem ipsum dolor sit amet consectetur. Sed imperdiet mi massa convallis amet massa nisi nibh. Nisl hendrerit maecenas nec non arcu adipiscing. Molestie sagittis malesuada feugiat erat mattis malesuada quis. Nisi rhoncus a sed ullamcorper odio. Imperdiet ultrices quis faucibus ipsum sollicitudin vulputate vitae.</Text>
                    <TouchableOpacity onPress={() => {navigation.navigate('Shop', {collection_id: '1cR5CvC5TnfEaoFI9lAu'})}} className="py-2 px-3 bg-accent-default rounded-md">
                        <Text className="text-white">Shop Now</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-col justify-center items-center gap-2">
                    <View className="flex flex-col justify-center items-center">
                        <Text className="text-accent-default text-lg">Lorem Ipsum</Text>
                        <Text className="text-accent-dark font-bold text-xl text-center">Crochet Bouquet</Text>
                    </View>
                    <Text className="text-accent-dark text-center max-w-[90%]">Lorem ipsum dolor sit amet consectetur. Sed imperdiet mi massa convallis amet massa nisi nibh. Nisl hendrerit maecenas nec non arcu adipiscing. Molestie sagittis malesuada feugiat erat mattis malesuada quis. Nisi rhoncus a sed ullamcorper odio. Imperdiet ultrices quis faucibus ipsum sollicitudin vulputate vitae.</Text>
                    <TouchableOpacity onPress={() => {navigation.navigate('Shop', {collection_id: 'DOeo6J1rGG9JeD7fT2G6'})}} className="py-2 px-3 bg-accent-default rounded-md">
                        <Text className="text-white">Shop Now</Text>
                    </TouchableOpacity>
                </View>

            </View> */}

                <Text className="w-full font-bold text-accent-dark text-3xl text-center py-5">See What's Popular</Text>
            <View className='flex flex-col justify-center items-center gap-y-10 pb-5'>
                <View className="w-full items-center">
                    <FlatList
                        data={products}
                        renderItem={({item, index}) => <PopularProducts key={index} item={item} products={products} index={index} navigation={navigation}/>}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        ItemSeparatorComponent={() => <View className='w-[20px]'/>}
                    />
                </View>

            </View>

        </ScrollView>
    )
}

const PopularProducts = ({ item, index, products, navigation }) => {

    return (
        <TouchableOpacity onPress={()=>{}} className={`flex flex-col justify-center items-center w-[200px] min-h-[200px] rounded-md bg-white shadow-sm my-5 ${index==0 ? 'ml-[20px]' : index==products.length-1 ? 'mr-[20px]' : ''}`}>
            <Image className="bg-red-100 flex-1 h-auto w-full object-cover rounded-md" source={{ uri: item.images[item.images.length-1].url }} />
            <View className="py-2 rounded-md">
                <Text className="bg-white text-accent-dark font-bold w-full text-center ">{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default Home