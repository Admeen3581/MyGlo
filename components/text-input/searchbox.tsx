import React, {forwardRef} from 'react';
import { TextInput, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextboxInput, { TextboxInputProps } from './textbox';
import { Colors } from '@/constants/theme'; // Adjust path as needed

const SearchBox = forwardRef<TextInput, TextboxInputProps>(
    (props, ref) =>
    {
        const colorScheme = useColorScheme();
        const iconColor = Colors[colorScheme ?? 'light'].icon;

        return (
            <TextboxInput
                ref={ref}
                placeholder="Search..."
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                showClearButton={true}
                leftIcon={<Ionicons name="search" size={20} color={iconColor} />}
                {...props}
            />
        );
    }
);

SearchBox.displayName = 'SearchBox';
export default SearchBox;