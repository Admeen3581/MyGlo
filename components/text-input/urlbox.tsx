import React, {forwardRef} from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from './textbox';

const URLBox = forwardRef<TextInput, Omit<TextboxInputProps, 'keyboardType'>>(
    (props, ref) =>
    {
        return (
            <TextboxInput
                ref={ref}
                label="Website URL"
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                textContentType="URL"
                showClearButton
                {...props}
            />
        );
    }
);

URLBox.displayName = "TextboxInput";
export default URLBox;