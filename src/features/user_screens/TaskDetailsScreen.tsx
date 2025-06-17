import { View, Text,StyleSheet,Alert,Button } from 'react-native'
import React from 'react'
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';


const TaskDetailsScreen = () => {
  return (
    <View style={styles.inner_container}>
        <CustomSafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text>Taskk Detail sREEN</Text>
          </View>
          {/* <BottomNav /> */}
        </CustomSafeAreaView>
        
      </View>
  )
}

const styles = StyleSheet.create({ 

    inner_container: {
        flex: 1,
        backgroundColor: "#FAF8F5",
        borderRadius: 12,
      },
  })

export default TaskDetailsScreen