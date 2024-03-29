import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import NumberCounter from './NumberCounter'


const CartItemAccordion = ({ cartItem, cartItemIndex, callbackCartItem }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [itemTotal, setItemTotal] = useState(0);

    const callbackCount = ({ type, name, count, index }) => {
        if (!callbackCartItem) return false;
        let tempTotal = 0;

        if (type == 'addon') {
            Promise.all([
                setItemTotal(0),
                setItemTotal((prevTotal) => (prevTotal + (parseInt(cartItem.pricing) * parseInt(cartItem.quantity)))),
                cartItem.add_ons.forEach((addon, _index) => {
                    if (_index == index) {
                        tempTotal = tempTotal + ((parseInt(addon.price) * count) * cartItem.quantity)
                    } else {
                        tempTotal = tempTotal + ((parseInt(addon.price) * parseInt(addon.quantity)) * cartItem.quantity)
                    }
                }),
                setItemTotal((prevTotal) => (prevTotal + tempTotal))
            ]);

            callbackCartItem({ type, name, count, index, cartItemIndex });
        } else if (type == 'product') {
            Promise.all([
                setItemTotal(0),
                setItemTotal((prevTotal) => (prevTotal + (parseInt(cartItem.pricing) * count))),
                cartItem.add_ons.forEach((addon, _index) => {
                    tempTotal = tempTotal + ((parseInt(addon.price) * parseInt(addon.quantity)) * count)
                }),
                setItemTotal((prevTotal) => (prevTotal + tempTotal))
            ]);

            callbackCartItem({ type, name, count, cartItemIndex });
        }

    }

    return (
        <View className="bg-white flex flex-col border-b border-accent-light pt-5">

            <View className="flex flex-row items-start justify-between mb-2">
                <View className="flex flex-col pl-5">
                    <Text className="text-accent-dark font-bold text-2xl">{cartItem.name}</Text>
                    <Text className="text-accent-dark text-xl">₱ {cartItem.pricing}</Text>
                </View>

                <View className="flex flex-col">
                    <NumberCounter callbackCount={callbackCount} initialValue={cartItem.quantity} type={'product'} />
                    <Text className="text-lg text-accent-dark">Item total: ₱ {itemTotal}</Text>
                </View>
            </View>

            <View className="bg-white flex flex-col overflow-hidden">
                <View className={`bg-white flex flex-col pl-5 ${isOpen ? 'max-h[calc(100%)]' : 'max-h-0'}`}>
                    <Text>{cartItem.description}</Text>

                    {cartItem.inclusions.length != 0 &&
                        <View className="flex flex-col my-2">
                            <Text>Inclusions: </Text>
                            {cartItem.inclusions.map((inclusion, index) => (
                                <Text key={index}>{inclusion}</Text>
                            ))}

                        </View>
                    }

                    <View className="flex flex-col my-2">
                        <Text className="mb-1">Add-ons:</Text>
                        {cartItem.add_ons && cartItem.add_ons.map((addon, index) => (
                            <NumberCounter key={index} callbackCount={callbackCount} label={addon.name} initialValue={addon.quantity} index={index} type={'addon'} />
                        ))}
                    </View>
                </View>

                <TouchableOpacity onPress={() => setIsOpen(!isOpen)} className=" bg-white flex items-center justify-center">
                    <Text className="text-xl">Expand Details</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default CartItemAccordion
