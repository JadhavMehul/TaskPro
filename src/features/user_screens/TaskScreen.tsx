import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native';

type TaskListRouteParams = {
  taskData: any;
};

const TaskScreen = () => {
  const route = useRoute<RouteProp<{ params: TaskListRouteParams }, 'params'>>();
  const { taskData } = route.params;

  console.log(taskData.taskTitle);
  
  return (
    <View style={styles.container}>
        <Text style={styles.heading}>{taskData.taskTitle}</Text>
        {taskData.taskDescription && <Text>Description: {taskData.taskDescription}</Text>}
        {taskData.assignedTo && <Text>Assigned To: {taskData.assignedTo}</Text>}
        {taskData.createdBy?.userEmail && <Text>Created By: {taskData.createdBy.userEmail}</Text>}
    </View>

  )
}

export default TaskScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
