import React, {forwardRef, useState} from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from './textbox';

const NumberBox = forwardRef<TextInput, Omit<TextboxInputProps, 'keyboardType'>>(
    ({label, placeholder, onChangeText, error, ...props}, ref) =>
    {
        const[errorNote, setErrorNote] = useState('');//check for non-number characters mistype

        //Validate the number
        const handleNumber = (num: string) =>
        {
            if (onChangeText)
            {
                onChangeText(num);
            }

            // Check for non-numbers symbol manually
            if (/^[0-9]+$/.test(num))
            {
                setErrorNote('');
            }
            else
            {
                setErrorNote(`Numeric values only.`);
            }
        };

        // If the parent passes down an error, prioritize it. Otherwise, use the internal error.
        const displayError = error || errorNote;

        return (
            <TextboxInput
                ref={ref}
                label={label}
                placeholder={placeholder}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleNumber}
                error={displayError}
                {...props}
            />
        );
    }
);

NumberBox.displayName = 'NumberBox';
export default NumberBox;