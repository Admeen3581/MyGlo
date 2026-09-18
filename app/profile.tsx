import React from 'react';
import {Redirect} from "expo-router";
import BottomNavBar from "@/components/navigation/BottomNavBar";

export default function Profile() {

    return (
        <BottomNavBar
            initTab={'profile'}
        />
    )
}
