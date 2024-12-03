import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { Entypo } from '@expo/vector-icons';

// region Image Picker
const ImagePicker = ({ image, height, width, onPress }: any) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{
                height: height,
                width: width,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ImageBackground
                    source={image}
                    style={{ height: height, width: width }}
                    imageStyle={{ borderRadius: 15 }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Entypo
                            name="camera"
                            size={24}
                            color="white"
                            style={{
                                opacity: 0.7,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: 'white',
                                borderRadius: 10
                            }}
                        />
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
};

export default ImagePicker;