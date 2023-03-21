import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { db, auth } from '../../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import NumberCounter from '../../components/NumberCounter';

const _DATA = {
  id: '1UuNzCwqKIrHqpjsAICj',
  collection: '1cR5CvC5TnfEaoFI9lAu',
  name: 'Product 1',
  description: 'Description for product',
  images: [{ file_name: "EuBx-MrUYAMOiI4.jpg", url: "https://firebasestorage.googleapis.com/v0/b/e-commerce-55e6b.appspot.com/o/1UuNzCwqKIrHqpjsAICj%2FEuBx-MrUYAMOiI4.jpg?alt=media&token=ee12a2f5-8064-4e8c-9289-582593fc70e7" }],
  pricing: '220'
}

const _COLLECTIONDATA = { addons: [{ name: "Ferrero Rocher", price: "50" }, { name: "Kitkat", price: "20" }, { name: "Hany", price: "10" }], description: "description for dried flowers bouquet", id: "1cR5CvC5TnfEaoFI9lAu", title: "Dried Flowers Bouquet" }

const Product = ({ route, navigation }) => {

  const [product, setProduct] = useState({});
  const [collectionData, setCollectionData] = useState({});
  const [loading, setLoading] = useState(true);

  const [cbCounter, setCbCounter] = useState(0);
  const orderDetails = useRef({});

  const handleAddToCart = async () => {
    
    const user = auth.currentUser;

    if(user) {

      const {uid} = user;

      const docRef = collection(db, `users/${uid}/cart`);
      await addDoc(docRef, orderDetails);

      navigation.navigate('Shop');
    } else {
      navigation.navigate('Authentication', {screen:'Login'});
    }

  }

  const callbackCount = ({type, name, count}) => {
    if(!orderDetails.addons) return false;

    if(type == 'addon') {
      orderDetails?.addons.forEach(addon => {
        if(name == addon.name){
          addon.quantity = count;
        }
      })
    }else if(type == 'product') {
      // DITO PAPASOK LOGIC KAPAG QUANTITY PINALITAN
      // stateDATA.quantity = count;
    }
  }

  useEffect(() => {
    // const { product_id } = route.params;
    const product_id = '1UuNzCwqKIrHqpjsAICj';
    const getProductData = async () => {

      // const docRef = doc(db, 'products', product_id);
      // const docSnap = await getDoc(docRef);

      // if (docSnap.exists()) {
      //   setProduct({...docSnap.data(), id:docSnap.id});
      // }
      setProduct(_DATA);
      orderDetails['product_id'] = product_id;
      orderDetails['quantity'] = 0;
    };

    const getCollectionData = async () => {
      // if(product.collection!=null && product.collection!=''){
      //   const docRef = doc(db, 'collections', product.collection);
      //   const docSnap = await getDoc(docRef);

      //   if (docSnap.exists()) {
      //     setCollectionData({...docSnap.data(), id:docSnap.id});
      //   }
      // }

      setCollectionData(_COLLECTIONDATA)

      const temp = [];

      _COLLECTIONDATA.addons.forEach(addon => {temp.push({...addon, quantity:0})})
      orderDetails['addons'] = temp;
    }


    Promise.all([getProductData(), getCollectionData(), setLoading(false)])

  }, [])

  return (

    loading ? <Text>Loading</Text> :

      <ScrollView className="flex flex-1 bg-white">

        <Image className="w-full aspect-square rounded-md shadow-md bg-white" source={{ uri: product.images[0].url }} />

        <View className="flex flex-col px-5 py-2 pb-5">

          <View className="mt-5 flex flex-row items-center justify-between">
            <Text className="text-accent-dark text-5xl font-bold">{product.name}</Text>
            <Text className="text-accent-dark text-xl">Php {product.pricing}</Text>
          </View>
          <Text className="text-accent-dark text-lg">{product.description}</Text>

          <Text className="text-accent-dark text-2xl mt-5">Inclusions:</Text>
          <View>
            <Text className="text-accent-dark text-lg">2 Crochet Tulip</Text>
            <Text className="text-accent-dark text-lg">3 Crochet Lavender</Text>
            <Text className="text-accent-dark text-lg">Fairy Lights</Text>
            <Text className="text-accent-dark text-lg">14" Box</Text>
          </View>

          <Text className="text-accent-dark text-2xl mt-5">Add-ons:</Text>
          {collectionData && collectionData.addons.map((addon, index) => (
            <View key={index} className="flex flex-row items-center">
            <NumberCounter label={addon.name} type={'addon'} callbackCount={callbackCount}/>
            </View>
          ))}

          <TouchableOpacity onPress={handleAddToCart} className="py-5 mt-5 bg-accent-default rounded-md flex flex-col items-center justify-center">
            <Text className="text-xl text-white">Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  )
}



export default Product