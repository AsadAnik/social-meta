import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Details = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Details Screen here</Text>

            <Button
                title='Go Back to Your Home Screen'
                onPress={(): void => navigation.goBack()}
            />
        </View>
    )
}

export default Details;