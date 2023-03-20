import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

const NumberCounter = ({label, type, callbackCount, initialValue, index}) => {
    const [count, setCount] = useState(type == 'product' ? 1 : 0);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        switch(type){            
            case 'addon': setCount(initialValue??0); break;
            case 'product' : setCount(initialValue??1); break;
        }
    },[])

    useEffect(() => {
        if((type == 'addon' && count <= 0) || (type == 'product' && count <= 1)) {
            setDisabled(true); 
        }else {
            setDisabled(false);
        }
    }, [count])

    useEffect(()=>{
        callbackCount({count, name:label, type, index});
    }, [count]);

    return (
        <View className="bg-white flex flex-row gap-x-2 mb-2">
            
            <View className="flex flex-row items-center">
                <TouchableOpacity disabled={disabled} onPress={()=>{setCount((prevCount) => prevCount-=1)}} className="p-2 bg-accent-light">
                    <Text className="text-accent-dark text-2xl font-bold">-</Text>
                </TouchableOpacity>
                <Text className="text-accent-dark p-2 px-5 text-xl w-[60px] text-center">{count}</Text>
                <TouchableOpacity onPress={()=>{setCount((prevCount) => prevCount+=1)}} className="p-2 bg-accent-light">
                    <Text className="text-accent-dark text-xl font-bold">+</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-accent-dark p-2 text-xl">{label}</Text>

        </View>
    )
}

export default NumberCounter

