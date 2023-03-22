import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase';
import { collection, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import CartItemAccordion from '../../components/CartItemAccordion';

const _CART = { addons: [{ name: "Ferrero Rocher", price: "50", quantity: 2 }, { name: "Kitkat", price: "20", quantity: 2 }, { name: "Hany", price: "10", quantity: 2 }], product_id: "1UuNzCwqKIrHqpjsAICj", quantity: 0 }

const Cart = ({ navigation }) => {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [stateUid, setStateUid] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const user = auth.currentUser;

        navigation.addListener('focus', async() => {

            const { uid } = user;
            const docRef = collection(db, `users/${uid}/cart`);
            const docSnap = await getDocs(docRef);

            const tempSnap = [];
            const tempCartItems = [];

            docSnap.forEach(snap => {
                tempSnap.push({ ...snap.data(), id: snap.id });
            });

            for (const cartItem of tempSnap) {
                const docRef = doc(db, 'products', cartItem.product_id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    tempCartItems.push({ ...cartItem, ...docSnap.data() });
                }
            }

            setCartItems(tempCartItems);

        });

    }, [navigation])

    useEffect(() => {
        const user = auth.currentUser;
        
        if (user == null) { navigation.navigate('Home'); return }
        
        const getData = async () => {
            const { uid } = user;
            setStateUid(uid);

            const docRef = collection(db, `users/${uid}/cart`);
            const docSnap = await getDocs(docRef);

            const tempSnap = [];
            const tempCartItems = [];


            docSnap.forEach(snap => {
                tempSnap.push({ ...snap.data(), id: snap.id });
            });

            for (const cartItem of tempSnap) {
                const docRef = doc(db, 'products', cartItem.product_id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    tempCartItems.push({ ...cartItem, ...docSnap.data() });
                }
            }

            setCartItems(tempCartItems);

            setLoading(false);
        }

        getData();

    }, []);

    const callbackCartItem = async ({ type, name, count, index, cartItemIndex }) => {


        if (type == 'addon') {
            cartItems[cartItemIndex].add_ons[index].quantity = count;
            const docRef = doc(db, `users/${stateUid}/cart/`, cartItems[cartItemIndex].id);
            await updateDoc(docRef, {
              add_ons:cartItems[cartItemIndex].add_ons,
            });
        } else if (type == 'product') {
            cartItems[cartItemIndex].quantity = count;
            const docRef = doc(db, `users/${stateUid}/cart/`, cartItems[cartItemIndex].id);
            await updateDoc(docRef, {
              quantity:count,
            });
        }

        let tempProductTotal = 0;
        let tempAddOnsTotal = 0;

        cartItems.forEach(cartItem => {
            let tempPerProduct = 0;
            let tempAddOnsPerProduct = 0;
            tempPerProduct = tempPerProduct + (parseInt(cartItem.pricing) * parseInt(cartItem.quantity));

            for (const addon of cartItem.add_ons) {
                tempAddOnsPerProduct = tempAddOnsPerProduct + (parseInt(addon.quantity) * parseInt(addon.price));
            }

            tempProductTotal = tempProductTotal + tempPerProduct;
            tempAddOnsTotal = tempAddOnsTotal + tempAddOnsPerProduct * cartItem.quantity;

        });

        setTotalPrice(tempProductTotal + tempAddOnsTotal);
    }

    return (

        loading ? <View><Text>Loading</Text></View> :

        <>

            <ScrollView className="flex flex-1 bg-white px-2 mb-[calc(24%)]">
                <Text className="text-accent-dark font-bold text-5xl">Cart</Text>

                {cartItems && cartItems.map((cartItem, index) => (
                    
                    <CartItemAccordion key={index} cartItem={cartItem} callbackCartItem={callbackCartItem} cartItemIndex={index} />

                ))}

            </ScrollView>


            <View className="absolute bottom-0 left-0 right-0 flex flex-col items-end justify-center px-5 bg-white shadow-lg h-[calc(15%)]">
                <Text className="text-xl font-bold">Total Price: {totalPrice}</Text>

                <TouchableOpacity className="flex py-2 px-2 bg-accent-default w-[50%] rounded-sm items-center justify-center bg-accent">
                    <Text className="text-white text-xl">Check Out</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Cart