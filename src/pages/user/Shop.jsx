import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ScrollView } from 'react-native-gesture-handler'
const Shop = ({navigation, route}) => {
  const [products, setProducts] = useState([]);

  const handleProductClick = (navigation, product_id) => {
    navigation.navigate('Product', {product_id:product_id});
  }

  useEffect(() => {
    const {collection_id} = route.params;
    // const collection_id = 'DOeo6J1rGG9JeD7fT2G6';

    const getData = async () => {
      const docRef = collection(db, 'products');
      const q = query(docRef, where('collection', '==', collection_id));
      const snapQuery = await getDocs(q);

      const temp = [];
      snapQuery.forEach(snap => {
        temp.push({...snap.data(), id:snap.id})
      });

      setProducts(temp);
    }

    // setProducts(_DATA);
    getData();
    navigation.getParent('main').setOptions({swipeEnabled:false, headerShown:false})
  }, [])

  return (
    <ScrollView className="bg-white flex flex-1 px-2 pt-1 gap-y-2">
      <View className="bg-red-100 w-full h-[175px] rounded-md shadow-sm">
      </View>

      <View className="flex flex-row flex-wrap flex-start justify-between">
        {products && products.map((product, index) => (
          <ProductCard key={index} product={product} handleProductClick={handleProductClick} navigation={navigation}/>
        ))}
      </View>
    </ScrollView>
  )
}

const ProductCard = ({product, handleProductClick, navigation}) => {
  return (
    <TouchableOpacity onPress={() => {handleProductClick(navigation, product.id)}} className="w-[49%] min-h-[100px] rounded-md mb-2 bg-white shadow-sm">
      <View className="h-[100px] bg-red-100 rounded-md">
        <Image className="h-full w-full" source={{uri:product.images[product.images.length-1].url}}/>
      </View>
      <View className="p-2 bg-white rounded-md">
        <Text className="text-lg font-bold">{product.name}</Text>
        <Text className="text-sm mt-2">{product.description}</Text>
        <Text className="font-bold">P{product.pricing}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Shop