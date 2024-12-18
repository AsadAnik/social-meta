import React from 'react';
import { Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Container, NotifyDiv, NotifyPersonText, NotifyPersonAvatar, NotifyRightElement, NotifyLovedImg } from '../../styles/NotificationStyles';
import { FollowButton } from '../../components/widgets/Button';
import { Card as PaperCard } from 'react-native-paper';

const NotificationTabScreen = () => {
    return (
        <Container>
            <ScrollView
                style={{ backgroundColor: '#efefef' }}
                refreshControl={<RefreshControl refreshing={false} />}
            >
                <PaperCard style={styles.paper}>
                    <NotifyDiv>
                        <NotifyPersonAvatar source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQGxket1fQPy6A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718551521910?e=2147483647&v=beta&t=mrc3mFtlInpBfuG-_eJojdoBI5dxRAZEhoAtwkt0qSU' }} />

                        <Text style={{ maxWidth: 200 }}>
                            <NotifyPersonText>Asad Anik</NotifyPersonText> started following you.{" " + `2h`}
                        </Text>

                        <NotifyRightElement>
                            <FollowButton title="Follow" size={30} />
                        </NotifyRightElement>
                    </NotifyDiv>
                </PaperCard>

                <PaperCard style={styles.paper}>
                    <NotifyDiv>
                        <NotifyPersonAvatar source={{ uri: 'https://images.unsplash.com/photo-1464863979621-258859e62245?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVtYWxlJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' }} />

                        <Text style={{ maxWidth: 200 }}>
                            <NotifyPersonText>Sarah Jeklin</NotifyPersonText> started following you.{" " + `15h`}
                        </Text>

                        <NotifyRightElement>
                            <FollowButton title="Follow" size={30} />
                        </NotifyRightElement>
                    </NotifyDiv>
                </PaperCard>

                <PaperCard style={styles.paper}>
                    <NotifyDiv>
                        <NotifyPersonAvatar source={{ uri: 'https://imgcdn.stablediffusionweb.com/2024/6/14/e97975bb-e925-426d-be79-fb225e8289fc.jpg' }} />

                        <Text style={{ maxWidth: 200 }}>
                            <NotifyPersonText>Alexa Siri</NotifyPersonText> started following you.{" " + `1d`}
                        </Text>

                        <NotifyRightElement>
                            <FollowButton title="Follow" size={30} />
                        </NotifyRightElement>
                    </NotifyDiv>
                </PaperCard>

                <PaperCard style={styles.paper}>
                    <NotifyDiv>
                        <NotifyPersonAvatar source={{ uri: 'https://media.gettyimages.com/id/489440520/nl/foto/spokesperson-of-the-opposition-right-wing-party-les-republicains-lydia-guirous-poses-in-paris.jpg?s=612x612&w=gi&k=20&c=vY5oDVs8F1U7TeCMdO1_qhYIctxRIpJuA8r8yR8WifU=' }} />

                        <Text style={{ maxWidth: 200 }}>
                            <NotifyPersonText>Bill Gates Wife</NotifyPersonText> started following you.{" " + `2w`}
                        </Text>

                        <NotifyRightElement>
                            <FollowButton title="Follow" size={30} />
                        </NotifyRightElement>
                    </NotifyDiv>
                </PaperCard>

                <PaperCard style={styles.paper}>
                    <NotifyDiv>
                        <NotifyPersonAvatar source={{ uri: 'https://images.unsplash.com/photo-1464863979621-258859e62245?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVtYWxlJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' }} />

                        <Text style={{ maxWidth: 200 }}>
                            <NotifyPersonText>Sarah</NotifyPersonText> loved your photo.{" \n" + `1mo ago`}
                        </Text>

                        <NotifyRightElement>
                            <NotifyLovedImg source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQGxket1fQPy6A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718551521910?e=2147483647&v=beta&t=mrc3mFtlInpBfuG-_eJojdoBI5dxRAZEhoAtwkt0qSU' }} />
                        </NotifyRightElement>
                    </NotifyDiv>
                </PaperCard>
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    paper: {
        backgroundColor: '#fff',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    }
});

export default NotificationTabScreen;