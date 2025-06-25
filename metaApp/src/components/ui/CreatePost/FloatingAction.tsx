import React, { useRef } from 'react';
import { FloatingAction as FloatingActionButton } from 'react-native-floating-action';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type FloatingActionProps = {
  handleActionPress: (name?: string) => void;
};

const FloatingActionWrapper: React.FC<FloatingActionProps> = ({ handleActionPress }) => {
  const floatingActionRef = useRef<any>(null);

  // Actions for floating button
  const actions = [
    {
      text: 'Image',
      icon: <Entypo name="image" size={24} color="white" />,
      name: 'bt_image',
      position: 2,
      color: '#1DA1F2',
    },
    {
      text: 'Video',
      icon: <MaterialIcons name="videocam" size={24} color="white" />,
      name: 'bt_video',
      position: 1,
      color: '#FF4500',
    },
    {
      text: 'File',
      icon: <AntDesign name="file1" size={24} color="white" />,
      name: 'bt_file',
      position: 3,
      color: '#4CAF50',
    },
  ];

  return (
     <FloatingActionButton
       ref={floatingActionRef}
       actions={actions}
       onPressItem={handleActionPress}
       color="#1DA1F2"
       distanceToEdge={16}
       overlayColor="rgba(0, 0, 0, 0.7)"
       showBackground={true}
     />
  );
};

export default FloatingActionWrapper;
