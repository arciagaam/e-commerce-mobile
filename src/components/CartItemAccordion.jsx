import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import NumberCounter from './NumberCounter'


const CartItemAccordion = ({ cartItem, cartItemIndex, callbackCartItem }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [cartItemState, setCartItemState] = useState([])

    const callbackCount = ({ type, name, count, index }) => {
        if (type == 'addon') {
            callbackCartItem({type, name, count, index, cartItemIndex});
        }else if (type == 'product') {
            callbackCartItem({type, name, count, cartItemIndex});
        }
    }

    return (
        <View className="bg-white flex flex-col border-b border-accent-light pt-5">

            <View className="flex flex-row items-start justify-between">
                <View className="flex flex-col pl-5">
                    <Text className="text-accent-dark font-bold text-2xl">Product Name</Text>
                    <Text className="text-accent-dark text-xl">Product Price</Text>
                </View>

                <View className="flex flex-col">
                    <NumberCounter callbackCount={callbackCount} initialValue={cartItem.quantity} type={'product'} />
                </View>
            </View>

            <View className="bg-white flex flex-col overflow-hidden">
                <View className={`bg-white flex flex-col pl-5 ${isOpen ? 'max-h[calc(100%)]' : 'max-h-0'}`}>
                    <Text>Product Description Here</Text>
                    <Text>Inclusions: </Text>

                    <Text>Add-ons:</Text>
                    {cartItem.addons && cartItem.addons.map((addon, index) => (
                        <NumberCounter key={index} callbackCount={callbackCount} label={addon.name} initialValue={addon.quantity} index={index} type={'addon'} />
                    ))}
                </View>

                <TouchableOpacity onPress={() => setIsOpen(!isOpen)} className=" bg-white flex items-center justify-center">
                    <Text className="text-xl">Expand Details</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default CartItemAccordion
