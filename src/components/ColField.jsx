import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'

const ColField = ({label, value, valueFor, editing=false, call, callbackInput, size='normal', extraClass}) => {

  const [textValue, setTextValue] = useState('');
 

  useEffect(() => {
    if(callbackInput){
      callbackInput({valueFor, value:textValue})
    }
  }, [textValue])
  

  useEffect(() => {
    setTextValue(value)
  }, [])


  return (
    <View className={`flex flex-col my-2 ${extraClass?extraClass:''}`} >
        <Text className={`${size == 'normal' ? 'text-2xl' : 'text-lg'} font-bold text-accent-dark`}>{label}</Text>
        <TextInput editable={editing} defaultValue={textValue} value={textValue} onChangeText={newText => setTextValue(newText)} className={` text-accent-dark pb-2 px-2 rounded-md ${size == 'normal' ? 'text-lg' : 'text-sm'} ${editing ? 'bg-white border border-accent-dark' : 'bg-gray-500/10'}`} />
    </View>
  )
}

export default ColField