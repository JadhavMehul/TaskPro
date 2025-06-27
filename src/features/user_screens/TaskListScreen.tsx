import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { firebase } from "../../../firebaseConfig";
import { RouteProp, useRoute } from '@react-navigation/native';
import { navigate } from '@utils/NavigationUtils';

type TaskListRouteParams = {
  taskId: string;
};

const TaskListScreen = () => {
  const route = useRoute<RouteProp<{ params: TaskListRouteParams }, 'params'>>();
  const { taskId } = route.params;

  const [allTaskList, setAllTaskList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTaskList = async () => {
    setRefreshing(true);
    // try {
    //   const doc = await firebase.firestore().collection('TaskList').doc(taskId).get();
    //   const data = doc.data();

    //   if (data?.taskList) {
    //     const taskArray = Object.values(data.taskList);
    //     setAllTaskList(taskArray);
    //   } else {
    //     setAllTaskList([]);
    //   }

    //   console.log("Fetched data:", data);
    // } catch (error) {
    //   console.error("Error getting task list:", error);
    // }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTaskList();
  }, []);

  return (
    <View>
      <Text>{taskId}</Text>
      <FlatList
        data={allTaskList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigate('TaskScreen', { taskData: item })}>
          <Text style={{ fontWeight: 'bold' }}>{item.taskTitle}</Text>
              {item.taskDescription && <Text>{item.taskDescription}</Text>}
              {item.assignedTo && <Text>{item.assignedTo}</Text>}
        </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={fetchTaskList}
        ListEmptyComponent={<Text>No task dates found</Text>}
      />
    </View>
  );
};

export default TaskListScreen;
