import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { auth, db } from '../../firebase';
import { doc, addDoc, collection, serverTimestamp, deleteDoc } from 'firebase/firestore';

const Checkout = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const cartItems = useRef(route.params.cartItems);

  const handlePlaceOrder = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const { uid } = user;

    const docRef = collection(db, 'orders');
    switch (paymentMethod) {
      case 'cod':
        const data = {
          order_date: serverTimestamp(),
          paymentMethod: 'Cash On Delivery',
          products: cartItems.current,
          status: 'Pending',
          total_paid: 0,
          total_price: parseInt(route.params.cartTotal) + 100,
          user_id: uid
        }
        await addDoc(docRef, data);
        navigation.pop();
        break;

      case 'paypal':
        break;
    }

    for (const cartItem of cartItems.current) {
      const docRef = doc(db, `users/${uid}/cart`, cartItem.id);
      await deleteDoc(docRef);
    }
  }

  useEffect(() => {
    setLoading(false);
  }, [])

  return (
    loading ? <Text>Loading</Text> :
      <View className="flex flex-1">
        <ScrollView className="flex flex-1 bg-white">

          {cartItems.current && cartItems.current.map((cartItem, index) => (
            <CheckoutItem key={index} index={index} cartItem={cartItem} limit={cartItems.current.length} />
          ))}

          <View className="flex flex-col bg-white px-2 my-2">

            <View className="flex flex-col flex-1 shadow-md bg-white rounded-md mt-5 p-2">
              <Text className="mb-5 text-xl font-bold">Order Summary</Text>

              <View className="flex flex-row justify-between py-1">
                <Text>Subtotal ({cartItems.current.length} {cartItems.current.length > 1 ? 'items' : 'item'})</Text>
                <Text>₱ {route.params.cartTotal}</Text>
              </View>

              <View className="flex flex-row justify-between py-1">
                <Text>Shipping Fee (may vary)</Text>
                <Text>₱ 100</Text>
              </View>

              <View className="min-h-[1px] flex-1 bg-accent-light my-2"></View>
              <View className="flex flex-row justify-between py-1">
                <Text>Total: </Text>
                <Text>₱ {parseInt(route.params.cartTotal) + 100}</Text>
              </View>

            </View>

            <View className="flex flex-col flex-1 shadow-md bg-white rounded-md mt-5 p-2">
              <Text className="mb-5 text-xl font-bold">Payment Method</Text>

              <View className="flex flex-col gap-y-2">
                <TouchableOpacity onPress={() => setPaymentMethod('cod')} className="flex flex-row gap-x-2">
                  <View className={`h-[15px] w-[15px] border border-accent-light rounded-full ${paymentMethod == 'cod' ? 'bg-accent-default' : ''}`}></View>
                  <Text>Cash on Delivery (COD)</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPaymentMethod('paypal')} className="flex flex-row gap-x-2">
                  <View className={`h-[15px] w-[15px] border border-accent-light rounded-full ${paymentMethod == 'paypal' ? 'bg-accent-default' : ''}`}></View>
                  <Text>Paypal</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>


        </ScrollView>

        <View className="flex flex-row bg-white shadow-md py-2 px-3 justify-between items-end">
          <Text className="text-2xl font-bold self-center">Total: ₱ {parseInt(route.params.cartTotal) + 100}</Text>
          <TouchableOpacity onPress={handlePlaceOrder} className="py-3 px-3 bg-accent-default rounded-sm w-1/2 items-center">
            <Text className="text-lg text-white">Place Order</Text>
          </TouchableOpacity>
        </View>

      </View>
  )
}

const CheckoutItem = ({ cartItem, index, limit }) => {

  let total = 0;
  total = total + (parseInt(cartItem.pricing) * parseInt(cartItem.quantity));
  cartItem.add_ons.forEach(addon => {
    total = total + ((parseInt(addon.price) * parseInt(addon.quantity)) * parseInt(cartItem.quantity))
  })

  return (
    <View className={`bg-white flex flex-col py-4 ${index != limit - 1 ? 'border-b border-accent-light' : ''} `}>

      <View className="flex flex-row justify-between">

        <View className="flex flex-col">
          <View className="flex flex-row items-start justify-between">
            <View className="flex flex-col pl-5">
              <Text className="text-accent-dark font-bold text-2xl">{cartItem.quantity}x {cartItem.name}</Text>
              <Text className="text-accent-dark text-xl">₱ {cartItem.pricing}</Text>
            </View>
          </View>

          <View className="bg-white flex flex-col">
            <View className={`bg-white flex flex-col pl-5`}>
              <Text>Product Description Here</Text>
              {cartItem.inclusions.length != 0 &&
                <View className="flex flex-col my-2">
                  <Text className="font-bold">Inclusions: </Text>
                  {cartItem.inclusions.map((inclusion, index) => (
                    <Text key={index}>{inclusion}</Text>
                  ))}

                </View>
              }

              <Text className="font-bold">Add-ons:</Text>
              {cartItem.add_ons && cartItem.add_ons.map((addon, index) => (
                addon.quantity ?
                  <View key={index} className="flex flex-row gap-x-1">
                    <Text>{addon.quantity}x {addon.name}</Text>
                    <Text className="pl-3">₱ {addon.price}</Text>
                  </View>
                  : null
              ))}
            </View>
          </View>
        </View>

        <Text className="self-end justify-self-end mr-5">Item Total: ₱{total}</Text>

      </View>



    </View>
  )
}

export default Checkout