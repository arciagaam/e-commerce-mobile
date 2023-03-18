import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Tinatangi',
        url: 'https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/c1I3Kef9FEDkF4xrcW6d%2FEu6i0jyXAAM6j0X.jpg?alt=media&token=84339681-dcdf-4b31-bb7f-ca9ca4abee4b',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Pantasya',
        url: 'https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/c1I3Kef9FEDkF4xrcW6d%2FEu6i0jyXAAM6j0X.jpg?alt=media&token=84339681-dcdf-4b31-bb7f-ca9ca4abee4b',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Uhaw',
        url: 'https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/c1I3Kef9FEDkF4xrcW6d%2FEu6i0jyXAAM6j0X.jpg?alt=media&token=84339681-dcdf-4b31-bb7f-ca9ca4abee4b',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571219d72',
        title: 'Boom Tarat Tarat',
        url: 'https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/c1I3Kef9FEDkF4xrcW6d%2FEu6i0jyXAAM6j0X.jpg?alt=media&token=84339681-dcdf-4b31-bb7f-ca9ca4abee4b',
    },
    {
        id: '58694a0f-3dd4-471f-bd96-145571219d72',
        title: 'Sorry',
        url: 'https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/c1I3Kef9FEDkF4xrcW6d%2FEu6i0jyXAAM6j0X.jpg?alt=media&token=84339681-dcdf-4b31-bb7f-ca9ca4abee4b',
    },
];

const Home = () => {
    return (
        <ScrollView className="flex flex-1 flex-col bg-white">

            <View className="pt-5 px-2">
                <Text className="font-bold text-accent-dark text-8xl">Dried Flower Bouquets</Text>
                <Text className="text-accent-dark text-2xl">Lorem ipsum dolor sit amet consectetur.</Text>
            </View>
            
            <Image className='h-[400px] aspect-square' source={require('./../../../assets/bg.png')} />

            <Text className="w-full font-bold text-accent-dark text-3xl text-center bg-accent-light py-5">Categories</Text>
            <View className="flex flex-col gap-y-10">

                <View className="flex flex-col justify-center items-center gap-2">
                    <View className="flex flex-col justify-center items-center">
                        <Text className="text-accent-default text-lg">Lorem Ipsum</Text>
                        <Text className="text-accent-dark font-bold text-xl text-center">Dried Flower Bouquet</Text>
                    </View>
                    <Text className="text-accent-dark text-center max-w-[90%]">Lorem ipsum dolor sit amet consectetur. Sed imperdiet mi massa convallis amet massa nisi nibh. Nisl hendrerit maecenas nec non arcu adipiscing. Molestie sagittis malesuada feugiat erat mattis malesuada quis. Nisi rhoncus a sed ullamcorper odio. Imperdiet ultrices quis faucibus ipsum sollicitudin vulputate vitae.</Text>
                    <TouchableOpacity className="py-2 px-3 bg-accent-default rounded-md">
                        <Text className="text-white">Shop Now</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-col justify-center items-center gap-2">
                    <View className="flex flex-col justify-center items-center">
                        <Text className="text-accent-default text-lg">Lorem Ipsum</Text>
                        <Text className="text-accent-dark font-bold text-xl text-center">Crochet Bouquet</Text>
                    </View>
                    <Text className="text-accent-dark text-center max-w-[90%]">Lorem ipsum dolor sit amet consectetur. Sed imperdiet mi massa convallis amet massa nisi nibh. Nisl hendrerit maecenas nec non arcu adipiscing. Molestie sagittis malesuada feugiat erat mattis malesuada quis. Nisi rhoncus a sed ullamcorper odio. Imperdiet ultrices quis faucibus ipsum sollicitudin vulputate vitae.</Text>
                    <TouchableOpacity className="py-2 px-3 bg-accent-default rounded-md">
                        <Text className="text-white">Shop Now</Text>
                    </TouchableOpacity>
                </View>

            </View>

                <Text className="w-full font-bold text-accent-dark text-3xl text-center py-5">See What's Popular</Text>
            <View className='flex flex-col justify-center items-center gap-y-10 pb-5'>
                <View className="w-full items-center">
                    <FlatList
                        data={DATA}
                        renderItem={PopularProducts}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        ItemSeparatorComponent={() => <View className='w-[20px]' />}
                    />
                </View>

            </View>

        </ScrollView>
    )
}

const PopularProducts = ({ item, index }) => {

    return (
        <View className={`flex flex-col justify-center items-center w-[200px] min-h-[200px] rounded-md bg-white shadow-sm my-5 ${index==0 ? 'ml-[20px]' : index==DATA.length-1 ? 'mr-[20px]' : ''}`}>
            <Image className="bg-red-100 flex-1 h-auto w-full object-cover rounded-md" source={{ uri: item.url }} />
            <View className="py-2 rounded-md">
                <Text className="bg-white text-accent-dark font-bold w-full text-center ">{item.title}</Text>
            </View>
        </View>
    )
}

export default Home