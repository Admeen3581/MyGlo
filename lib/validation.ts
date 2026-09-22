export type StatusType = 'success' | 'warning' | 'destructive';

export interface ValidationStatus {
    type: StatusType;
    text: string;
}

/**
 * Validates email input upon typing/blur.
 */
export function getEmailStatus(
    email: string,
    isBlurred: boolean,
    isUnavailable: boolean = false
): ValidationStatus | null {
    if (email.length === 0) return null;

    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    const isValidLength = email.trim().length >= 5;
    const atIdx = email.indexOf('@');
    const dotIdx = email.lastIndexOf('.');
    const isValidEmail =
        hasAt && hasDot && isValidLength && atIdx > 0 && dotIdx > atIdx + 1 && dotIdx < email.length - 1;

    if (!isValidEmail) {
        if (!isBlurred) return null;
        return { type: 'destructive', text: 'Not an email' };
    }

    if (isUnavailable) {
        return { type: 'destructive', text: 'Email Unavailable' };
    }

    return { type: 'success', text: 'Email Available' };
}

/**
 * Validates password strength and criteria.
 */
export function getPasswordStatus(password: string): ValidationStatus | null {
    if (!password) return null;

    if (password.length < 9) {
        return { type: 'destructive', text: 'Password must be at least 9 characters' };
    }

    const hasNumeric = /\d/.test(password);
    if (!hasNumeric) {
        return { type: 'destructive', text: 'Password requires a numeric value' };
    }

    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasSpecial) {
        return { type: 'destructive', text: 'Password requires a special character' };
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);

    const typeCount = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + 1 + (hasSpecial ? 1 : 0);

    if (typeCount <= 2 && password.length < 9) {
        return { type: 'destructive', text: 'Poor' };
    } else if (typeCount >= 4 || (typeCount >= 3 && password.length >= 10)) {
        return { type: 'success', text: 'Strong' };
    } else {
        return { type: 'warning', text: 'Weak' };
    }
}

/**
 * Validates password verification matching.
 */
export function getConfirmPasswordStatus(
    confirmPassword: string,
    password: string
): ValidationStatus | null {
    if (!confirmPassword) return null;

    if (confirmPassword === password && password.length > 0) {
        return { type: 'success', text: 'Matches' };
    } else {
        return { type: 'destructive', text: "Passwords don't match" };
    }
}
