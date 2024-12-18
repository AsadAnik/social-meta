import React from 'react';
import { useState, useRef } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View, ActivityIndicator, Text, useColorScheme } from 'react-native';
import { Container, InputWrapper, TextInput, InnerContainer, LoadingContainer } from '../../styles/SearchStyles';
// import { Feather, Ionicons } from '@expo/vector-icons';
// import BottomSheet from '@/components/widgets/BottomSheet';
import { Button } from '../../components/widgets/Button';


const Explore = (): JSX.Element => {
    const colorScheme = useColorScheme();
    const [searchType, setSearchType] = useState("USER");
    const [isLoading, setIsLoading] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const bottomSheetRef = useRef(null);

    // To Open Bottom Sheet..
    // const handleSnapPress = React.useCallback((index) => {
    //     bottomSheetRef.current?.snapToIndex(index);
    //     setIsBottomSheetOpen(0);
    // }, []);

    // Alternative Way to Open Bottom Sheet..
    const handleBottomSheetOpen = () => {
        // bottomSheetRef.current?.expand();
        setIsBottomSheetOpen(true);
    };

    const handleBottomSheetClose = () => {
        // bottomSheetRef.current?.close();
        setIsBottomSheetOpen(false);3
    };

    // When Change Search Values...
    const textInputChange = (value: string) => {
        if (value.length > 1) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    };

    // Render Content Or Loading..
    const renderContentOrLoading = (loading: boolean): JSX.Element => {
        if (!loading) {
            return (
                <View>
                    <Text>Hello</Text>
                </View>
            );
        } else {
            return (
                <LoadingContainer>
                    <ActivityIndicator size="large" color="royalblue" />
                </LoadingContainer>
            );
        }
    };

    // console.log('IsBottomSheetOpen -- ', isBottomSheetOpen);
    // console.log('BottomSheetRef -- ', bottomSheetRef);

    return (
        <Container>
           {/* <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} /> */}

            {/* ---- Search Engine Part ---- */}
            <InputWrapper>
                {/* <Feather name="search" size={30} color="black" /> */}
                {/* ---- Search Bar ---- */}
                <TextInput
                    placeholder={searchType === "USER" ? 'Search User..' : 'Search Post..'}
                    onChangeText={(value: string) => textInputChange(value)}
                />
                {/* ---- Filter Button ---- */}
                <TouchableOpacity onPress={() => handleBottomSheetOpen()}>
                    {/* <Ionicons name="options" size={30} color="black" /> */}
                </TouchableOpacity>
            </InputWrapper>

            <InnerContainer style={{ opacity: !isBottomSheetOpen ? 1 : 0.25 }}>
                {/* ---- The Content Container ---- */}
                {renderContentOrLoading(isLoading)}
            </InnerContainer>

            {/* ---- The Bottom Sheet here ---- */}
            {/* <BottomSheet
                bottomSheetRef={bottomSheetRef}
                setIsOpen={setIsBottomSheetOpen}
                snapPoint="40%"
            // handleSnapPress={handleSnapPress}
            >
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="User Search"
                            color1st="royalblue"
                            color2nd="blue"
                            size={20}
                            height={50}
                            width="100%"
                            textColor="white"
                            onPress={() => {
                                setSearchType("USER");
                                handleBottomSheetClose();
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Post Search"
                            color1st="orange"
                            color2nd="red"
                            size={20}
                            height={50}
                            width="100%"
                            textColor="white"
                            onPress={() => {
                                setSearchType("POST");
                                handleBottomSheetClose();
                            }}
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
                            onPress={() => handleBottomSheetClose()}
                        />
                    </View>
                </View>
            </BottomSheet> */}
        </Container>
    );
};

export default Explore;