import React from 'react';
import {Redirect} from "expo-router";
import BottomNavBar from "@/components/navigation/BottomNavBar";

export default function Friends() {

    return (
        <BottomNavBar
        initTab={'friends'}
        />
    )
}
