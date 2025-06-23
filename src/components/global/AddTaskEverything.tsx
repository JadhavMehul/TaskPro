import { View, Text, Image, Animated, Platform, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react';
import TitleText from './Titletext'
import InputField from './InputField'
import ToggleSwitch from './ToggleSwitch'

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import TimePicker from './TimePicker'
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';



type User2 = {
  id: string;
  name: string;
  image: string;
};

const users2: User2[] = [

  {
    id: '0',
    name: 'Assigned to',
    image: '',
  },

  {
    id: '1',
    name: 'Mehul',
    image: 'https://i.imgur.com/1Qf1Z0G.jpg',
  },
  {
    id: '2',
    name: 'Chris',
    image: 'https://i.imgur.com/1Qf1Z0G.jpg',
  },
];



const AddTaskEverything = () => {


  //   timepicker start

  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [timeSet, setTimeSet] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignTo: '',
    needPermission: false,
    phoneNumber: '',
    taskEndTime: '',
    notificationTimer: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  // };

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      setTimeSet(true);
      const taskEndTime = moment(selectedDate).format('YYYY-MM-DDTHH:mm:ssZ');
      handleInputChange('taskEndTime', taskEndTime)
    }
  };

  const showTimepicker = () => {
    setShow(true);
  };

  //   timepicker end

  // toggleswitch start

  const [isOn, setIsOn] = useState(false);
  const knobPosition = useRef(new Animated.Value(6)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 6 : 38;
    Animated.timing(knobPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(prev => !prev);
  };

  // toggleswitch end




  // dropdown start
  const [selectedUser3, setSelectedUser3] = useState<User2 | null>(null);
  const [showDropdown3, setShowDropdown3] = useState<boolean>(false);

  const handleSelect3 = (user2: User2) => {
    if (user2.id === '0') {
      setSelectedUser3(null);
    } else {
      setSelectedUser3(user2);
    }
    setShowDropdown3(false);
  };
  const renderUser3 = ({ item }: { item: User2 }) => {
    const isSelected3 = selectedUser3?.id === item.id;

    if (item.id === '0') {
      return (
        <TouchableOpacity onPress={() => handleSelect3(item)}>
          <View style={[styles.userContainer2, { backgroundColor: '#fff', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={styles.crossIcon2}>❌</Text>
            <Text style={styles.userName2}>{item.name}</Text>
            <Text style={styles.crossIcon2}>❌</Text>
          </View>
        </TouchableOpacity>
      );
    }



    const content3 = (
      <View style={styles.userInner2}>
        <Image source={{ uri: item.image }} style={styles.avatar2} />
        <Text style={[styles.userName2, isSelected3 && { color: '#fff' }]}>
          {item.name}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect3(item)}>
        {isSelected3 ? (
          <LinearGradient
            colors={['#F8B700', '#F88D00']}
            style={styles.userContainer2}
          >
            {content3}
          </LinearGradient>
        ) : (
          <View style={[styles.userContainer2, { backgroundColor: '#fff' }]}>
            {content3}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // dropdown end









  return (

    <View style={{ flex: 1 }}>



      <ScrollView>
        <View style={{ flexDirection: 'column', gap: 16 }}>




          <TitleText style={styles.poptext}>
            Title
          </TitleText>
          <InputField style={styles.input1}
            placeholder="Task title"
            autoCapitalize="none"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />

          <TitleText style={styles.poptext}>
            Description
          </TitleText>

          <InputField style={styles.input2}
            placeholder="Description"
            autoCapitalize="none"
            textAlignVertical="top"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />

          <View style={styles.namecard}>
            <View style={styles.row}>
              <View style={styles.circle}>
                <Image
                  source={require('@assets/images/home_fill.png')}

                  style={styles.circleImage}
                />
              </View>

              <TitleText style={styles.personName}>Mehul</TitleText>
            </View>

            <TouchableOpacity onPress={() => setShowDropdown3(!showDropdown3)}>
              <View style={styles.addtask}>
                <TitleText style={styles.dropdownText2}>
                  {selectedUser3 ? selectedUser3.name : 'Assign To'}
                </TitleText>
                <Image
                  source={require('../../assets/images/downarrow.png')}
                  style={styles.image2}
                />
              </View>

            </TouchableOpacity>

            {showDropdown3 && (
              <View style={styles.dropdownList2}>
                {users2.map((item) => (
                  <React.Fragment key={item.id}>{renderUser3({ item })}</React.Fragment>
                ))}
              </View>
            )}



          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TitleText style={styles.poptext}>
              Need Permission?
            </TitleText>

            <ToggleSwitch
              isOn={isOn}
              toggleSwitch={() => {
                toggleSwitch(); // <- call toggle switch
                handleInputChange('needPermission', !isOn); // <- call input change
              }}
              knobPosition={knobPosition}
            />


          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TitleText style={styles.poptext}>
              Task End Time
            </TitleText>


            <TouchableOpacity onPress={showTimepicker}>
              <View style={styles.addtask}>
                {timeSet ? (
                  <TitleText >
                    {moment(date).format('YYYY-MM-DDTHH:mm:ssZ')}
                    {/* {moment(date).format('HH:mm')} */}
                  </TitleText>
                ) : (
                  <>
                    <TitleText>Add Time</TitleText>
                    <Image
                      source={require('../../assets/images/addcircle.png')}
                      style={styles.image2}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                testID="timePicker"
                value={date}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onChange}
              />
            )}

            {/* <TouchableOpacity onPress={showTimepicker}>
          <View style={styles.addtask}>
            <TitleText>
              Add Time
            </TitleText>
            <Image
              source={require('../../assets/images/addcircle.png')}
              style={styles.image2}
            />
          </View>

        </TouchableOpacity> */}






          </View>
          {/* <Text style={{ fontSize: 16 }}>
      Selected Time: {date.toLocaleTimeString()}
    </Text> */}
          {/* {show && (
        <DateTimePicker
          testID="timePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )} */}


          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TitleText style={styles.poptext}>
        Notification Timer 1
      </TitleText>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>

        <View style={styles.addtask}>
          <TitleText>
            {date.toLocaleTimeString()}
          </TitleText>
        </View>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/cancelicon.png')}
            style={styles.image2}
          />
        </TouchableOpacity>


      </View>




    </View> */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TitleText style={styles.poptext}>
              Add Notification Timer
            </TitleText>



            <TimePicker />


          </View>


          {/* <TouchableOpacity style={styles.orangebutton} >
          <TitleText style={styles.orangebtntext}>
            Add Task
          </TitleText>
        </TouchableOpacity> */}













        </View>
      </ScrollView>

      <View style={styles.endcontainer}>
        <TouchableOpacity style={styles.orangebutton} onPress={() => console.log(formData)}>
          <TitleText style={styles.orangebtntext}>
            Add Task
          </TitleText>
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({


  endcontainer: {
    width: '100%',
    paddingTop: 16,
    bottom: 0,
    backgroundColor: '#fff',

  },

  orangebtntext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  orangebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FECC01',
    padding: 12,
    borderRadius: 25,
  },

  text: {
    fontSize: 16,
    color: '#333',
  },
  readMoreLink: {
    color: 'orange',
    fontWeight: '500',
  },

  crossIcon2: {
    fontSize: 8,
    color: '#999',
    paddingHorizontal: 4,
  },

  dropdownHeader2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText2: {
    fontSize: 14,
    // marginRight: 10,
  },
  arrow2: {
    fontSize: 16,
  },
  dropdownList2: {
    position: 'absolute',
    top: 50,

    right: 10,
    zIndex: 4,
    // marginTop: 10,
    width: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    gap: 10,
    padding: 8,
  },
  userContainer2: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    borderRadius: 12,
    padding: 10,
  },
  userInner2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar2: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  userName2: {
    fontSize: 16,
    fontWeight: '600',
  },







  namecard: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  personName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',
  },

  input1: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    color: "#291C0A",
  },

  input2: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#FFFFFF',
    padding: 16,
    height: 120,
    borderRadius: 8,
    color: "#291C0A",
  },
  poptext: {
    fontSize: 15,
    fontWeight: 400,
  },//


  image: {
    width: 17,
    height: 17,
    resizeMode: 'cover',
  },

  image2: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
  },

  addtask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 12,
    borderRadius: 6,
  },

  dropsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,

  },


  gradientBox: {
    // ...StyleSheet.absoluteFillObject,
    padding: 16,
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },


  // yellow: {
  //   padding: 16,
  //   flex: 1, backgroundColor: '#FAB90A',
  //   borderTopLeftRadius: 12,
  //   borderTopRightRadius: 12,
  // },
  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  itemText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#555' },

})

export default AddTaskEverything