import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableHighlight, ViewStyle } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
// import { navigate } from "../../utils/NavigationUtils"; 
import { navigate } from '@utils/NavigationUtils';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// // Replace with your actual navigation types
// interface RootStackParamList {
//   PostScreen: undefined;
//   SearchScreen: undefined;
//   UploadScreen: undefined;
//   ReviewScreen: undefined;
//   ProfileScreen: undefined;
// };


interface BottomNavComp {
  style?: ViewStyle
  backgroundColor?: string;
}

// const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({children, style}) => {

const BottomNav: React.FC<BottomNavComp> = ({ style, backgroundColor }) => {
  const route = useRoute();
  const routeName = route.name;

  const user = auth().currentUser;
  const [userIsAdmin, setUserIsAdmin] = useState(false);



  const fetchUserData = async () => {
    if (user?.email) {
      try {
        const doc = await firestore()
          .collection('UserAccounts')
          .doc(user.email)
          .get();

        if (doc.exists()) {
          const userData = doc.data();
          if (userData && typeof userData.isAdmin !== 'undefined') {
            setUserIsAdmin(userData.isAdmin);
          }
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('No user is logged in');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);


  return (
    <View style={[styles.mainbottom_div, { backgroundColor: backgroundColor || 'transparent' }]}>

      <View style={styles.bottomcontainer}>
        <View style={styles.menuItem}>
          <TouchableHighlight
            onPress={() => navigate("HomeScreen")}
            activeOpacity={0.6}
            underlayColor="none"
          >
            <Image
              source={
                routeName === "HomeScreen"
                  ? require("@assets/images/home_fill.png")
                  : require("@assets/images/home_unfill.png")
              }
              style={
                routeName === "HomeScreen"
                  ? styles.menuItemIcon2
                  : styles.menuItemIcon
              }
            />
          </TouchableHighlight>
        </View>


        {
          userIsAdmin &&
          <View style={styles.menuItem}>
            <TouchableHighlight
              onPress={() => navigate("AdminScreen")}
              activeOpacity={0.6}
              underlayColor="none"
            >
              <Image
                source={
                  routeName === "AdminScreen"
                    ? require("@assets/images/admin_fill.png")
                    : require("@assets/images/admin_unfill.png")
                }
                style={
                  routeName === "AdminScreen"
                    ? styles.menuItemIcon2
                    : styles.menuItemIcon
                }
              />
            </TouchableHighlight>
          </View>
        }
        

        <View style={styles.menuItem}>
          <TouchableHighlight
            onPress={() => navigate("ProfileScreen")}
            activeOpacity={0.6}
            underlayColor="none"
          >
            <Image
              source={
                routeName === "ProfileScreen"
                  ? require("@assets/images/profile_fill.png")
                  : require("@assets/images/profile_unfill.png")
              }
              style={
                routeName === "ProfileScreen"
                  ? styles.menuItemIcon2
                  : styles.menuItemIcon
              }
            />
          </TouchableHighlight>
        </View>


      </View>
    </View>

  );
};

const styles = StyleSheet.create({

  mainbottom_div: {
    width: '100%',
    // backgroundColor: "red",
  },
  bottomcontainer: {
    height: "auto",
    backgroundColor: "#FCE27A",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    // paddingBottom: 24,
    // borderRadius: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: "center",

  },
  menuItem: {
    flex: 1,
    alignItems: "center",
  },
  menuItemIcon: {
    height: 45,
    width: 45,
    resizeMode: "contain",
  },
  menuItemIcon2: {
    height: 45,
    width: 45,
    resizeMode: "contain",
  },
});

export default BottomNav;
