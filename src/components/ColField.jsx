import { View, Text, TextInput } from 'react-native'
import React from 'react'

const ColField = ({label, value, editing=false}) => {
  return (
    <View className="flex flex-col my-2">
        <Text className="text-2xl font-bold text-accent-dark">{label}</Text>
        <TextInput editable={editing} value={value} className={`text-lg text-accent-dark pb-2 px-2 rounded-md ${editing ? 'bg-white border border-accent-dark' : 'bg-gray-500/10'}`} />
    </View>
  )
}

export default ColField