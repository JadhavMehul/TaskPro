import {
  View, Text, StyleSheet, Alert, Button, Image, TouchableOpacity, Modal,
  Pressable
} from 'react-native'
import React, { useState } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import { goBack } from '@utils/NavigationUtils';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import ReadMoreText from '@components/global/ReadMoreText';




const statuses = ['New', 'Done', 'Approved'];


type User2 = {
  id: string;
  name: string;
  image: string;
};

const users2: User2[] = [
  {
    id: '0',
    name: 'Unassign',
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



const TaskDetailsScreen = () => {

  const [selectedUser2, setSelectedUser2] = useState<User2 | null>(null);
  const [showDropdown2, setShowDropdown2] = useState<boolean>(false);

  const handleSelect2 = (user2: User2) => {
    if (user2.id === '0') {
      setSelectedUser2(null);
    } else {
      setSelectedUser2(user2);
    }
    setShowDropdown2(false);
  };
  const renderUser2 = ({ item }: { item: User2 }) => {
    const isSelected2 = selectedUser2?.id === item.id;

    if (item.id === '0') {
      return (
        <TouchableOpacity onPress={() => handleSelect2(item)}>
          <View style={[styles.userContainer2, { backgroundColor: '#fff', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={styles.crossIcon2}>❌</Text>
            <Text style={styles.userName2}>{item.name}</Text>
            <Text style={styles.crossIcon2}>❌</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const content2 = (
      <View style={styles.userInner2}>
        <Image source={{ uri: item.image }} style={styles.avatar2} />
        <Text style={[styles.userName2, isSelected2 && { color: '#fff' }]}>
          {item.name}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect2(item)}>
        {isSelected2 ? (
          <LinearGradient
            colors={['#F8B700', '#F88D00']}
            style={styles.userContainer2}
          >
            {content2}
          </LinearGradient>
        ) : (
          <View style={[styles.userContainer2, { backgroundColor: '#fff' }]}>
            {content2}
          </View>
        )}
      </TouchableOpacity>
    );
  };










  const [selectedStatus, setSelectedStatus] = useState('New');
  const [showDropdown, setShowDropdown] = useState(false);


  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'New':
        return '#fff';
      case 'Done':
        return '#FFFFCC';
      case 'Approved':
        return '#D8F9E0';
      default:
        return '#fff';
    }
  };



  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);
  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={goBack}>
            <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' }} >
              <Image
                source={require('../../assets/images/backicon.png')}
                style={styles.image}
              />
              <TitleText style={styles.backtext}>Back</TitleText>

            </View>
          </TouchableOpacity>


          <View style={{ padding: 16, gap: 16 }}>

            <View style={styles.taskbox}>

              {/* <TitleText style={styles.tasktitle}>taskTitle</TitleText> */}

              <ReadMoreText
                text="taskTitle"
                numberOfLines={1}
                style={styles.text}
                toggleTextStyle={styles.readMoreLink}
              />

              <ReadMoreText
                text="Lorem ipsum is a dummy o jherbsd kwjebna  ljwnde  lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, d kjwf esd ensma wedjnsam."
                numberOfLines={1}
                style={styles.text}
                toggleTextStyle={styles.readMoreLink}
              />
              {/* <TitleText style={styles.taskdescription}>taskDescription</TitleText> */}

            </View>

            <View style={styles.commentbox}>

              <Image source={require('../../assets/images/speaker.png')} style={styles.speaker} />

              <View style={styles.righttop}>
                <View style={styles.circle}>
                  <Image source={require('../../assets/images/home_fill.png')} style={styles.circleImage} />
                </View>
                <Text style={styles.personName}>Mehul</Text>
              </View>

              <View style={{ flexDirection: 'column', gap: 6 }}>

                <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} >
                  <View style={[
                    styles.addtask,
                    { backgroundColor: getBackgroundColor(selectedStatus) },
                  ]}>
                    <TitleText>
                      {selectedStatus}
                    </TitleText>
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={styles.image2}
                    />
                  </View>

                </TouchableOpacity>


                <Modal
                  transparent
                  visible={showDropdown}
                  animationType="fade"
                  onRequestClose={() => setShowDropdown(false)}
                >
                  <Pressable
                    style={styles.modalBackground}
                    onPress={() => setShowDropdown(false)}
                  >
                    <View style={styles.dropdown}>
                      {statuses.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[styles.option, { backgroundColor: getBackgroundColor(status) }]}
                          onPress={() => {
                            setSelectedStatus(status);
                            setShowDropdown(false);
                          }}
                        >
                          <Text style={styles.optionText}>{status}</Text>

                        </TouchableOpacity>
                      ))}
                    </View>
                  </Pressable>
                </Modal>


                <TouchableOpacity
                  onPress={() => setShowDropdown2(!showDropdown2)}>

                  <View style={styles.addtask}>
                    <TitleText style={styles.dropdownText2}>
                      {selectedUser2 ? selectedUser2.name : 'Assign To'}
                    </TitleText>
                    <Image
                      source={require('../../assets/images/downarrow.png')}
                      style={styles.image2}
                    />
                  </View>

                </TouchableOpacity>



                {showDropdown2 && (
                  <View style={styles.dropdownList2}>
                    {users2.map((item) => (
                      <React.Fragment key={item.id}>{renderUser2({ item })}</React.Fragment>
                    ))}
                  </View>
                )}


              </View>
            </View>


            <View style={styles.commentbox}>

              <TitleText style={styles.textualtext}>Will you approve this?</TitleText>
              <View style={styles.addtask}>
                <TouchableOpacity onPress={() => setSelected(!selected)}>
                  <Image
                    source={
                      selected
                        ? require('../../assets/images/like_fill.png')
                        : require('../../assets/images/like_unfill.png')
                    }
                    style={styles.icon}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelected2(!selected2)}>
                  <Image
                    source={
                      selected2
                        ? require('../../assets/images/dislike_fill.png')
                        : require('../../assets/images/dislike_unfill.png')
                    }
                    style={styles.icon}
                  />
                </TouchableOpacity>

              </View>
            </View>


            <View style={styles.commentbox}>

              <TitleText style={styles.textualtext}>Comment</TitleText>
              <Image
                source={require('../../assets/images/addicon.png')}
                style={styles.image2}
              />
            </View>

            <View style={styles.commentbox}>

              <View style={{ flexDirection: 'row', gap: 0 }}>

                <View style={styles.righttop}>
                  <View style={styles.circle}>
                    <Image source={require('../../assets/images/home_fill.png')} style={styles.circleImage} />
                  </View>
                  <Text style={styles.personName}>Mehul</Text>
                </View>

                <View style={{ flexDirection: 'column', gap: 6, maxWidth: '70%' }}>
                  <TitleText>30 May 2025 11:25 AM</TitleText>

                  <ReadMoreText
                    text="Lorem ipsum is a dummy o jherbsd kwjebna  ljwnde  lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, d kjwf esd ensma wedjnsam."
                    numberOfLines={2}
                    style={styles.text}
                    toggleTextStyle={styles.readMoreLink}
                  />
                  {/* <TitleText >Lorem ipsum is a dummy o jherbsd kwjebna  ljwnde  lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, lukjbweda j dejklwj hkbrjfsd kjwne, d kjwf esd ensma wedjnsam.</TitleText> */}
                </View>

              </View>


              <TouchableOpacity onPress={() => { }}>
                <Feather name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
        {/* <BottomNav /> */}
      </CustomSafeAreaView>

    </View>
  )
}

const styles = StyleSheet.create({

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
    fontSize: 16,
    marginRight: 10,
  },
  arrow2: {
    fontSize: 16,
  },
  dropdownList2: {
    position: 'absolute',
    top: 60, // adjust this based on dropdownHeader height
    // left: 0,
    right: 0,
    zIndex: 4,
    marginTop: 10,
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














  modalBackground: {
    flex: 1,
  },

  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdown: {
    gap: 6,
    padding: 6,
    alignSelf: 'center',
    width: '40%',
    marginTop: 220,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 20,
  },


  option: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0ddd7',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',

  },
  optionText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
  },





  speaker: {
    width: 44,
    height: 43,
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
    justifyContent: 'center',
    gap: 6,
  },

  icon: {
    width: 24,
    height: 21,
  },

  addtask: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E2DA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    gap: 18,
    borderRadius: 6,
    alignItems: 'center',
  },

  textualtext: {
    fontWeight: 'bold',
    fontSize: 16,

  },

  commentbox: {
    borderColor: '#FEC601',
    borderWidth: 4,
    borderStyle: 'dashed',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
    ,
    justifyContent: 'space-between',
    alignItems: 'center'
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

  taskbox: {

    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,

    flexDirection: 'column',
    gap: 8,
  },

  image2: {
    width: 18,
    height: 18,
    resizeMode: 'cover',
  },

  image: {
    width: 24,
    height: 24,
    resizeMode: 'cover',
  },

  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
  backtext: {
    fontWeight: 600,
    fontSize: 16,
  },
})

export default TaskDetailsScreen