import React, {forwardRef} from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from './textbox';

const GenericBox = forwardRef<TextInput, TextboxInputProps>(
    ({label, placeholder, ...props}, ref) =>
    {
        return (
            <TextboxInput
                ref={ref}
                label={label}
                placeholder={placeholder}
                autoCapitalize="sentences"
                autoCorrect={true}
                keyboardType="default"
                {...props}
            />
        );
    }
);

GenericBox.displayName = 'GenericBox';
export default GenericBox;