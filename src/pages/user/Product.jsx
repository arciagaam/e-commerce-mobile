import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { db, auth } from '../../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import NumberCounter from '../../components/NumberCounter';
const Product = ({ route, navigation }) => {

  const [product, setProduct] = useState({});
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});

  const [selectedImage, setSelectedImage] = useState('');

  const handleAddToCart = async () => {

    const user = auth.currentUser;

    if (user) {

      const { uid } = user;

      const docRef = collection(db, `users/${uid}/cart`);
      await addDoc(docRef, orderDetails);

      navigation.navigate('Shop');
    } else {
      navigation.navigate('Authentication', { screen: 'Login' });
    }

  }

  const callbackCount = ({ type, name, count }) => {
    if (!orderDetails.addons) return false;
    if (type == 'addon') {
      orderDetails?.addons.forEach(addon => {
        if (name == addon.name) {
          addon.quantity = count;
        }
      })
    } else if (type == 'product') {

    }
  }

  useEffect(() => {
    const { product_id } = route.params;
    // const product_id = '1UuNzCwqKIrHqpjsAICj';
    const getProductData = async () => {

      const docRef = doc(db, 'products', product_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ ...docSnap.data(), id: docSnap.id })
        
        if(docSnap.data().images || docSnap.data().images.length != 0) {
          setSelectedImage(docSnap.data().images[docSnap.data().images.length-1].url);
        }

      };

      // setProduct(_DATA);
      orderDetails['product_id'] = product_id;
      orderDetails['quantity'] = 1;

      getCollectionData(docSnap.data());
    };

    const getCollectionData = async (productData) => {
      if (productData.collection != null && productData.collection != '') {
        const docRef = doc(db, 'collections', productData.collection);
        const docSnap = await getDoc(docRef);

        setCollectionData({ ...docSnap.data(), id: docSnap.id });

        const temp = [];
        docSnap.data().addons.forEach(addon => { temp.push({ ...addon, quantity: 0 }) })
        orderDetails['add_ons'] = temp;
      }
      setLoading(false);
    };

    getProductData();

  }, [])
  return (

    loading ? <Text>Loading</Text> :

      <ScrollView className="flex flex-1 bg-white">

        <Image className="w-full aspect-square rounded-md shadow-md bg-white" source={{uri:selectedImage}} />
        {product.images.length > 1 &&
          <>
            <FlatList
              data={product.images}
              renderItem={({item, index}) => <ProductImages key={index} item={item} index={index} setSelectedImage={setSelectedImage}/>}
              keyExtractor={item => item.id}
              horizontal={true}
              ItemSeparatorComponent={() => <View className='w-[10px]' />}
              className="mt-5 px-2"
            />
          </>}


        <View className="flex flex-col px-5 py-2 pb-5">
          <View className="mt-5 flex flex-row items-center justify-between">
            <Text className="text-accent-dark text-5xl font-bold">{product.name}</Text>
            <Text className="text-accent-dark text-xl">Php {product.pricing}</Text>
          </View>
          <Text className="text-accent-dark text-lg">{product.description}</Text>

          {product.inclusions &&
            <>
              <Text className="text-accent-dark text-2xl mt-5">Inclusions:</Text>
              <View>
                {product.inclusions.map((inclusion, index) => (
                  <Text key={index} className="text-accent-dark text-lg">{inclusion}</Text>
                ))}
              </View>
            </>
          }


          {collectionData &&
            <>
              <Text className="text-accent-dark text-2xl mt-5">Add-ons:</Text>
              {collectionData.addons.map((addon, index) => (
                <View key={index} className="flex flex-row items-center">
                  <NumberCounter label={addon.name} type={'addon'} callbackCount={callbackCount} />
                </View>
              ))}
            </>
          }


          <TouchableOpacity onPress={handleAddToCart} className="py-5 mt-5 bg-accent-default rounded-md flex flex-col items-center justify-center">
            <Text className="text-xl text-white">Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  )
}

const ProductImages = ({item, index, setSelectedImage}) => {
  return (
    <TouchableOpacity onPress={()=>{setSelectedImage(item.url)}} className="bg-accent-dark/30 aspect-square h-[100px] rounded-md overflow-hidden">
      <Image className="object-cover h-full" source={{uri:item.url}}/>
    </TouchableOpacity>
  )
}



export default Product