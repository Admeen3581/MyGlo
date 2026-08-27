import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from "./textbox";

// Optional turn off switch for internal checker
export interface PasswordBoxProps extends Omit<TextboxInputProps, 'isPassword'>
{
    useInternalChecker?: boolean;
}

const PasswordBox = forwardRef<TextInput, PasswordBoxProps>(
    ({ onChangeText, error, useInternalChecker = true, ...props }, ref) =>
    {
        const [internalError, setInternalError] = useState('');

        // Password Validation
        const handleFaultyPasswords = (text: string) => {

            if (onChangeText)
            {
                onChangeText(text);
            }

            if (useInternalChecker)
            {
                if (text.length === 0)
                {
                    setInternalError('');
                }
                else if (text.length < 8) {
                    setInternalError('Password must be at least 8 characters.');
                }
                else if (!/[A-Z]/.test(text))
                {
                    setInternalError('Password must contain at least one uppercase letter.');
                }
                else if (!/[0-9]/.test(text))
                {
                    setInternalError('Password must contain at least one number.');
                }
                else if (!/[!@#$%^&*]/.test(text))
                {
                    setInternalError('Password must contain a special character (!@#$%^&*).');
                }
                else
                {
                    setInternalError('');
                }
            }
        };

        // If the parent passes down an error, prioritize it. Otherwise, use the internal error.
        const displayError = error || internalError;

        return (
            <TextboxInput
                ref={ref}
                label="Password"
                placeholder="Enter your password"
                isHidden={true}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password" // "password" for signin not signup
                textContentType="newPassword"
                onChangeText={handleFaultyPasswords}
                error={displayError}
                {...props}
            />
        );
    }
);

PasswordBox.displayName = "PasswordBox";
export default PasswordBox;