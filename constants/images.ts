export const images = {
    //Spacer Images
    emptyState: require('@/assets/images/emptyState.jpg'),
    splashIcon: require('@/assets/images/splash-icon.png'),
    reactLogo: require('@/assets/images/react-logo.png'),
    //B-Roll Images
    onboarding: require('@/assets/images/onboarding.jpg'),

    //Organized icons
    icons: {
        tray: require('@/assets/icons/tray.and.arrow.down.png'),
        gift: require('@/assets/icons/gift.gift.png'),
    },

    //Organized logo dictionary containing all 12 SVG variants
    logos: {
        light: {
            standard: require('@/assets/logo/myglo-light.svg'),
            icon: require('@/assets/logo/myglo-light-icon.svg'),
            subtext: require('@/assets/logo/myglo-subtext-light.svg') || require('@/assets/logo/myglo-light-subtext.svg'),
        },
        dark: {
            standard: require('@/assets/logo/myglo-dark.svg'),
            icon: require('@/assets/logo/myglo-dark-icon.svg'),
            subtext: require('@/assets/logo/myglo-dark-subtext.svg'),
        },
        black: {
            standard: require('@/assets/logo/myglo-black.svg'),
            icon: require('@/assets/logo/myglo-black-icon.svg'),
            subtext: require('@/assets/logo/myglo-black-subtext.svg'),
        },
        white: {
            standard: require('@/assets/logo/myglo-white.svg'),
            icon: require('@/assets/logo/myglo-white-icon.svg'),
            subtext: require('@/assets/logo/myglo-white-subtext.svg'),
        },
    },
};

export default images;
