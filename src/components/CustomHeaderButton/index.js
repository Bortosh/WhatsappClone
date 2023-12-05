
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { EvilIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'

const CustomHeaderButton = (props) => {
    return (
        <HeaderButton
            {...props}
            IconComponent={Feather}
            iconSize={23}
            color="black"
            onPress={props.onPress}
        />
    );
};

export default CustomHeaderButton;
