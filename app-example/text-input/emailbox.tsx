import React, {forwardRef, useState} from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from './textbox'; // Adjust path as needed

const EmailBox = forwardRef<TextInput, Omit<TextboxInputProps, 'keyboardType'>>(
    ({onChangeText, error, ...props}, ref) =>
    {
        const[errorNote, setErrorNote] = useState('');

        //Validate the email
        const handleEmailChange = (text: string) =>
        {
            if (onChangeText)
            {
                onChangeText(text);
            }

            // Check for the '@' symbol manually
            if (!text.includes('@') && text.length > 0)
            {
                setErrorNote(`Please include an '@' in the email address. '${text}' is missing an '@'.`);
            }
            else if(text.length < 10)
            {
                setErrorNote(`Please provide a valid email address. '${text} is too short.`)
            }
            else
            {
                setErrorNote('');
            }
        };

        // If the parent passes down an error, prioritize it. Otherwise, use the internal error.
        const displayError = error || errorNote;

        return (
            <TextboxInput
                ref={ref}
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                showClearButton={true}
                onChangeText={handleEmailChange}
                error={displayError}
                {...props}
            />
        );
    }
);

EmailBox.displayName = 'EmailBox';
export default EmailBox;