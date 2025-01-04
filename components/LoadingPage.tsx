"use client";
import { useLoading } from '@/hooks/useLoading';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import MorphingText from './ui/morphing-text';

const texts = [
    "Loading",
    "Odds Graden"
  ];

const LoadingPage = () => {

    const { isLoading } = useLoading();

    useEffect(() => {
        // console.log("isLoading", isLoading);
    }, [isLoading]);

    return (
        <div className={cn(isLoading ? "absolute inset-0 flex items-center justify-center bg-black/50 z-[999999]" : "hidden")}>
            <MorphingText texts={texts} />;
        </div>

    );
};

export default LoadingPage;