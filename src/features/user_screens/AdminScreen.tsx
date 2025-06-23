import { View, Text, StyleSheet, Alert, Button, Switch, Animated, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react';
import BottomNav from '@components/global/BottomBar'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import TitleText from '@components/global/Titletext';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '@components/global/GradientButton';
import BottomModal from '@components/global/BottomModal';
import Clipboard from '@react-native-clipboard/clipboard';
import ToggleSwitch from '@components/global/ToggleSwitch';
import NameCard from '@components/global/Namecard';
// import { firebase } from "../../../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const AdminScreen = () => {
  
  
  
    // const [isOn, setIsOn] = useState(false);
    // const knobPosition = useRef(new Animated.Value(6)).current;
  
    // const toggleSwitch = () => {
    //   Animated.timing(knobPosition, {
    //     toValue: isOn ? 6 : 38,
    //     duration: 200,
    //     useNativeDriver: false,
    //   }).start();
    //   setIsOn(!isOn);
    // };

  const [refreshing, setRefreshing] = React.useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);

  const [cards, setCards] = useState([
    { name: '', isOn: false, userEmail: null, knobPosition: new Animated.Value(6) },
  ]);

  const toggleSwitch = (index: number) => {
    setCards(prevCards =>
      prevCards.map((card, i) => {
        if (i === index) {
          const newIsOn = !card.isOn;
          Animated.timing(card.knobPosition, {
            toValue: newIsOn ? 38 : 6,
            duration: 200,
            useNativeDriver: false,
          }).start();

          return { ...card, isOn: newIsOn };
        }
        return card;
      }))
  };


  const [code, setCode] = useState('');

  const handleCopy = () => {
    Clipboard.setString(code);
    Alert.alert('Copied', `Promo code "${code}" copied to clipboard.`);
  };

  const [code2, setCode2] = useState('');

  const handleCopy2 = () => {
    Clipboard.setString(code2);
    Alert.alert('Copied', `Promo code "${code2}" copied to clipboard.`);
  };

  const storePromo = async (aCode: string, uCode: string) => {
    try {
      await firestore().collection("PromoCodes").doc("Code").set({
        adminCode: aCode,
        userCode: uCode
      })
    } catch (error) {
      console.log(error);
    }
  }

  const generatePromoCode = () => {
    const adminPromoCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCode(adminPromoCode.toString());

    const userPromoCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCode2(userPromoCode.toString());

    setModalVisible(true);
    storePromo(adminPromoCode, userPromoCode);
  }

  const getEmployees = async () => {
    try {
      const allEmployeeData = await firestore().collection("UserAccounts").get()
      const employees = allEmployeeData.docs.map(doc => {
        const data = doc.data();
        console.log(data);
        
        return {
          name: data.firstName || '',
          isOn: data.isAdmin || false,
          userEmail: data.email || null,
          knobPosition: new Animated.Value(data.isAdmin ? 38 : 2),
        };
      });
      setCards(employees);
      // console.log("Employees:", JSON.stringify(employees));
    } catch (error) {
      console.log(error);
    }
    setModalVisible2(true);
  }

  const updateUserAdminStatus = async (
    userEmailId: string | null,
    userStatus: boolean,
    i: any
  ) => {
    if (!userEmailId) {
      console.warn('User email is null, cannot update admin status.');
      return;
    }

    try {
      toggleSwitch(i);
      await firestore()
        .collection('UserAccounts')
        .doc(userEmailId)
        .update({ isAdmin: !userStatus });

      console.log(`Admin status updated for: ${userEmailId}`);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };


  return (
    <View style={styles.inner_container}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>

          <View style={{ padding: 24, alignItems: 'center', flexDirection: 'row', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>






            <GradientButton
              imageSource={require('@assets/images/promocode_img.png')}
              title="Promo Code"
              onPress={generatePromoCode}
            />

            <BottomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
              <ScrollView>

              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
                <TitleText style={{ fontSize: 20, fontWeight: 400, }}>
                  Admin Promo Code
                </TitleText>

                <TouchableOpacity onPress={handleCopy}>
                  <Image
                    source={require('@assets/images/copy.png')}
                    style={styles.image3}
                  /></TouchableOpacity>

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code[0]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code[1]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code[2]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code[3]}
                  </TitleText>
                </View>
              </View>


              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
                <TitleText style={{ fontSize: 20, fontWeight: 400, }}>
                  User Promo Code
                </TitleText>


                <TouchableOpacity onPress={handleCopy2}>
                  <Image
                    source={require('@assets/images/copy.png')}
                    style={styles.image3}
                  /></TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code2[0]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code2[1]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code2[2]}
                  </TitleText>
                </View>
                <View style={styles.box_section}>
                  <TitleText style={{ fontWeight: 500, fontSize: 32 }}>
                    {code2[3]}
                  </TitleText>
                </View>
              </View>
              </ScrollView>
              {/* <View style={{ height: 190 }}>

              </View> */}
              
              
<View style={styles.endcontainer}>
<TouchableOpacity style={styles.orangebutton} onPress={generatePromoCode}>
                <TitleText style={styles.orangebtntext}>
                  Regenrate
                </TitleText>
              </TouchableOpacity>

                        </View>
            </BottomModal>

            <GradientButton
              imageSource={require('@assets/images/employes_img.png')}
              title="Employees"
              onPress={getEmployees}
            />


            <BottomModal isVisible={isModalVisible2} onClose={() => setModalVisible2(false)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24, marginBottom: 24 }}>
                <TitleText style={{ fontSize: 20, fontWeight: 400, }}>
                  Employees
                </TitleText>

                <TitleText style={{ fontSize: 20, fontWeight: 400, }}>
                  Admin
                </TitleText>
              </View>


              {/* <View style={{flexDirection: 'column', gap: 16}}>
              <NameCard
                name="Mehul"
                isOn={isOn}
                toggleSwitch={toggleSwitch}
                knobPosition={knobPosition}
              />

<NameCard
                name="Tirthak"
                isOn={isOn}
                toggleSwitch={toggleSwitch}
                knobPosition={knobPosition}
              />
              </View> */}

              {/* <View style={{ flexDirection: 'column', gap: 16 }}> */}

              

                <FlatList
                  data={cards}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <NameCard
                      key={index}
                      name={item.name}
                      imageSource={require('@assets/images/home_fill.png')}
                      isOn={item.isOn}
                      toggleSwitch={() => updateUserAdminStatus(item.userEmail, item.isOn, index)}
                      knobPosition={item.knobPosition}
                      style={{marginBottom: 16}}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  onRefresh={getEmployees}
                  refreshing={refreshing}
                  ListEmptyComponent={<Text>No task dates found</Text>}
                />

                {/* {cards.map((card, index) => (
                  <NameCard
                    key={index}
                    name={card.name}
                    imageSource={require('../../assets/images/home_fill.png')}
                    isOn={card.isOn}
                    toggleSwitch={() => toggleSwitch(index)}
                    knobPosition={card.knobPosition}
                  />
                ))} */}
              {/* </View> */}

            </BottomModal>




          </View>


        </View>
        <BottomNav />
      </CustomSafeAreaView>

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

  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // optional to increase size
  },





  orangebtntext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  orangebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F49C16',
    padding: 12,
    borderRadius: 25,
  },

  box_section: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    backgroundColor: '#ffffff',
    // paddingVertical: 16,
    // paddingHorizontal: 32,
    maxWidth: 75,
    width: '100%',
    minHeight: 75,
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image3: {
    width: 24,
    height: 24,
  },

  adminbox: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'red',
    width: 'auto',
  },

  inner_container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    borderRadius: 12,
  },
})

export default AdminScreen