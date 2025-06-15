import { View, ViewStyle, StyleSheet } from 'react-native'
import { FC, ReactNode } from 'react'
import { Colors } from '@utils/Constants'
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomSafeAreaViewProps {
    children: ReactNode,
    style?: ViewStyle
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({children, style}) => {
  return (
      <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        // backgroundColor: Colors.Soft_Pink,
    },
   
})

export default CustomSafeAreaView