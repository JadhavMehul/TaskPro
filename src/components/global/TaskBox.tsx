import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import TitleText from './Titletext';

type TaskBoxProps = {
  taskTitle: string;
  taskDescription: string;
  imageSource: ImageSourcePropType;
  personName: string;
  dateTime: string;
  taskStatus: string;
  onPress: () => void;
  onDelete: () => void;
};

const TaskBox = ({
  taskTitle,
  taskDescription,
  imageSource,
  personName,
  dateTime,
  taskStatus,
  onPress,
  onDelete
}: TaskBoxProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[
    styles.taskbox,
    taskStatus === 'Done' && { backgroundColor: '#FFFFAF' },
    taskStatus === 'Approved' && { backgroundColor: '#DAF8E6' },
  ]}>
        <View style={styles.topbox}>
          <View style={styles.lefttop}>
            <TitleText numberOfLines={1} ellipsizeMode="tail" style={styles.tasktitle}>{taskTitle}</TitleText>
            <TitleText numberOfLines={2} ellipsizeMode="tail" style={styles.taskdescription}>{taskDescription}</TitleText>
          </View>
          <View style={styles.righttop}>
            <View style={styles.circle}>
              <Image source={
                imageSource
                  ? { uri: imageSource } // Remote URL string
                  : require('@assets/images/profileIcon.png') // Local fallback
              } style={styles.circleImage} />
            </View>
            <Text style={styles.personName}>{personName}</Text>
          </View>
        </View>

        <View style={styles.aline} />

        <View style={styles.bottombox}>
          <View style={styles.leftbottom}>
            <Text style={styles.datetime}>{dateTime}</Text>
          </View>
          <TouchableOpacity onPress={onDelete}>
            <Feather name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskBox;

const styles = StyleSheet.create({
  taskbox: {

    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,

    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },

  datetime: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
  },

  leftbottom: {
    width: '70%',
    // backgroundColor: 'red',
  },

  bottombox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',

  },

  aline: {
    height: 1,
    width: '100%',
    backgroundColor: '#E7E2DA',
  },

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  circle: {
    width: '70%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  personName: {
    fontWeight: 500,
    fontSize: 16,
    color: '#000000',
  },

  righttop: {
    alignItems: 'center',
    // backgroundColor: 'green',
    width: '25%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  tasktitle: {
    fontWeight: 500,
    fontSize: 20,
    color: '#000000',
  },

  taskdescription: {
    fontWeight: 400,
    fontSize: 16,
    color: '#666666',
  },

  lefttop: {
    width: '74%',
    // backgroundColor: 'red',
    flexDirection: 'column',
    gap: 12,
  },

  topbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },




})
