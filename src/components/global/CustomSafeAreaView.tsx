import { View, ViewStyle, StyleSheet, SafeAreaView } from 'react-native'
import { FC, ReactNode } from 'react'
import { Colors } from '@utils/Constants'

interface CustomSafeAreaViewProps {
    children: ReactNode,
    style?: ViewStyle
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({children, style}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.Primary,
    }
})

export default CustomSafeAreaView