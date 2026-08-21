import React, {forwardRef} from 'react';
import { TextInput } from 'react-native';
import TextboxInput, { TextboxInputProps } from './textbox';

const TwoFactorBox = forwardRef<TextInput, TextboxInputProps>(
    ({error, ...props}, ref) =>
    {
        return (
            <TextboxInput
                ref={ref}
                label="Verification Code"
                placeholder="XXXXXX"
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={6} // Standard length for 2FA, easily overridden by props
                error={error}
                {...props}
            />
        );
    }
);

TwoFactorBox.displayName = 'TwoFactorBox';
export default TwoFactorBox;