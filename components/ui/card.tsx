import * as React from "react"
import { View, Text } from "react-native"
import { cn } from "@/lib/utils"

// Card
const Card = React.forwardRef<View, any>(({ className, ...props }, ref) => (
    <View
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
    />
))
Card.displayName = "Card"

// Header
const CardHeader = React.forwardRef<View, any>(({ className, ...props }, ref) => (
    <View
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

// Title
const CardTitle = React.forwardRef<Text, any>(({ className, ...props }, ref) => (
    <Text
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

// Description
const CardDescription = React.forwardRef<Text, any>(({ className, ...props }, ref) => (
    <Text
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

// Content
const CardContent = React.forwardRef<View, any>(({ className, ...props }, ref) => (
        <View
            ref={ref}
            className={cn("p-6 pt-0", className)}
            {...props}
        />
))
CardContent.displayName = "CardContent"

// Footer
const CardFooter = React.forwardRef<View, any>(({ className, ...props }, ref) => (
    <View
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
