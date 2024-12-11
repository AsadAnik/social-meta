import React from 'react';
import ExpoInstaStory from 'expo-insta-story';
import { View } from 'react-native';


const data = [
  {
    id: 1,
    avatar_image:
      'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Muhammad Bilal',
    stories: [
      {
        story_id: 1,
        story:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
        duration: 10, //This tells the duration of each screen
      },
      {
        story_id: 2,
        story:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
        duration: 10,
      },
    ],
  },
  {
    id: 2,
    avatar_image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
        duration: 10,
      },
      {
        story_id: 2,
        story: 'https://demo-link/123-123-123.mp4',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
        duration: 10, // The duration of the video in seconds. Specifies how long the video will be displayed.=
        isVideo: true, // This field indicates that the item is a video. When passing a video URL, make sure to include this field.
      },
    ],
  },
];

const Story = () => {
  return (
    <View style={{ height: 100 }}>
        <ExpoInstaStory data={data} duration={10} />
    </View>
  );
};

export default Story;