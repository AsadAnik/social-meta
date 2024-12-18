import React, { useState, useRef, useCallback } from "react";
// import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  GestureResponderEvent,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Button } from "../../components/widgets/Button";
import ImagePicker from "../../components/widgets/ImagePicker";
// import BottomSheet from "@gorhom/bottom-sheet";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Button.type";
interface UploadProfileProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "UploadProfile">;
}

interface DataState {
  profilePhoto: string;
  check_textInputChange: boolean;
  secureTextEntry: boolean;
  email?: string;
  password?: string;
}

const UploadProfile: React.FC<UploadProfileProps> = ({ navigation }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
//   const bottomSheetRef = useRef<BottomSheet>(null);

  const [data, setData] = useState<DataState>({
    profilePhoto: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const handleBottomSheetOpen = useCallback(() => {
    // bottomSheetRef.current?.expand();
    setIsBottomSheetOpen(true);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    // bottomSheetRef.current?.close();
    setIsBottomSheetOpen(false);
  }, []);

  const textInputChange = (value: string, type: "EMAIL" | "PASSWORD") => {
    if (type === "EMAIL") {
      setData((prevData) => ({
        ...prevData,
        email: value,
        check_textInputChange: value.length !== 0,
      }));
    }
    if (type === "PASSWORD") {
      setData((prevData) => ({
        ...prevData,
        password: value,
      }));
    }
  };

  const updateSecureTextEntry = () => {
    setData((prevData) => ({
      ...prevData,
      secureTextEntry: !prevData.secureTextEntry,
    }));
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/post1.jpg")}
    >
      {/* <StatusBar style="light" /> */}

      {/* ---- Header ---- */}
      <View style={styles.header}>
        <Text style={styles.text_header}>Select Profile Photo</Text>
      </View>

      {/* ---- Footer ---- */}
      <Animatable.View
        style={[styles.footer, { opacity: !isBottomSheetOpen ? 1 : 0.25 }]}
        animation="fadeInUpBig"
      >
        <View style={{ alignItems: "center" }}>
          <ImagePicker
            image={require("../../assets/images/avatar-male.png")}
            height={200}
            width={200}
            onPress={() => handleBottomSheetOpen()}
          />
        </View>

        {/* ---- Buttons ---- */}
        <View style={{ marginTop: 30 }}>
          <Button
            title="Continue"
            color1st="lightgreen"
            color2nd="green"
            size={18}
            textColor="white"
            width="100%"
            height={50}
            onPress={() => navigation.navigate("MainTabs")}
          />
        </View>
      </Animatable.View>

      {/* ---- The Bottom Sheet here ---- */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["40%"]}
        onChange={(index) => setIsBottomSheetOpen(index !== -1)}
      > */}
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Upload Profile</Text>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Take Photo"
              color1st="yellow"
              color2nd="orange"
              size={20}
              height={50}
              width="100%"
              textColor="black"
            //   onPress={() => alert("Take Photo!")}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Upload Profile"
              color1st="royalblue"
              color2nd="blue"
              size={20}
              height={50}
              width="100%"
              textColor="white"
            //   onPress={() => alert("Upload Profile!")}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Cancel"
              color1st="brown"
              color2nd="red"
              size={20}
              height={50}
              width="100%"
              textColor="white"
              onPress={handleBottomSheetClose}
            />
          </View>
        </View>
      {/* </BottomSheet> */}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: "#05375a",
    fontWeight: "bold",
    textAlign: "center",
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
});

export default UploadProfile;
