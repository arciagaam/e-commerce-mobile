import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import CartItemAccordion from '../../components/CartItemAccordion';

const _CART = {addons: [{name: "Ferrero Rocher", price: "50", quantity: 2}, {name: "Kitkat", price: "20", quantity: 2}, {name: "Hany", price: "10", quantity: 2}], product_id: "1UuNzCwqKIrHqpjsAICj", quantity: 0}

const Cart = ({ navigation }) => {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    
    useEffect(() => {
        const user = auth.currentUser;

        if (user == null) { navigation.navigate('Home'); return}

        const getData = async () => {
            const { uid } = user;
            const docRef = collection(db, `users/${uid}/cart`);
            const docSnap = await getDocs(docRef);

            const tempSnap = [];
            const tempCartItems = [];

            docSnap.forEach(snap => {
                tempSnap.push({ ...snap.data(), id: snap.id });
            });

            for(const cartItem of tempSnap) {
                const docRef = doc(db, 'products', cartItem.product_id);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    tempCartItems.push({...cartItem, ...docSnap.data()});
                }
            }

            setCartItems(tempCartItems);
        }

        getData();

    }, []);

    const callbackCartItem = ({type, name, count, index, cartItemIndex}) => {
        if(type == 'addon') {
            cartItems[cartItemIndex].addons[index].quantity = count;
        }else if (type == 'product') {
            cartItems[cartItemIndex].quantity = count;
        }        
    }

    return (
        <ScrollView className="flex flex-1 bg-white">
            <Text className="text-accent-dark font-bold text-5xl">Cart</Text>

            {cartItems && cartItems.map((cartItem, index) => (

                <CartItemAccordion key={index} cartItem={cartItem} callbackCartItem={callbackCartItem} cartItemIndex={index}/>

            ))}


        </ScrollView>
    )
}

export default Cart