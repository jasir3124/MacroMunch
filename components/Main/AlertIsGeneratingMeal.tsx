import { Modal, Text, Animated, Easing, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import Svg, { Rect, Defs, Filter, FeGaussianBlur, FeOffset, FeMerge, FeMergeNode } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function AlertIsGeneratingMeal({ visible, onClose }) {
    const translateY = useRef(new Animated.Value(-150)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const progress = useRef(new Animated.Value(0)).current;

    const [ModalVisible, setModalVisible] = useState(false);

    const width = 300;
    const height = 100;
    const strokeWidth = 3;
    const radius = 16;

    const perimeter =
        2 * (width + height - 2 * radius) + 2 * Math.PI * radius;

    useEffect(() => {
        if (visible) {
            translateY.setValue(-150);
            opacity.setValue(0);
            progress.setValue(0);
            setModalVisible(true);

            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 40,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.loop(
                    Animated.timing(progress, {
                        toValue: 1,
                        duration: 2200,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    })
                ),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -150,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                setModalVisible(false);
            });
        }
    }, [visible]);

    const strokeDashoffset = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -perimeter],
    });

    const dashLength = perimeter * 0.25;
    const gapLength = perimeter - dashLength;

    return (
        <Modal visible={ModalVisible} transparent onRequestClose={onClose}>
            {/*<View className="flex-1 bg-black/20">*/}
                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        opacity,
                    }}
                    className="absolute top-0 self-center"
                >
                    {/* SHADOW CONTAINER */}
                    <View
                        style={{
                            width,
                            height,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 10,
                            borderRadius: radius,
                            backgroundColor: 'white',
                        }}
                    >
                        <View style={{ width, height }} className="relative">
                            {/* SVG BACKGROUND AND BORDER */}
                            <Svg width={width} height={height} style={{ position: 'absolute' }}>
                                {/* WHITE BACKGROUND */}
                                <Rect
                                    x={0}
                                    y={0}
                                    width={width}
                                    height={height}
                                    rx={radius}
                                    ry={radius}
                                    fill="white"
                                />

                                {/* PROGRESS BORDER */}
                                <AnimatedRect
                                    x={strokeWidth / 2}
                                    y={strokeWidth / 2}
                                    width={width - strokeWidth}
                                    height={height - strokeWidth}
                                    rx={radius}
                                    ry={radius}
                                    stroke="#93c572"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeDasharray={`${dashLength} ${gapLength}`}
                                    strokeDashoffset={strokeDashoffset}
                                />
                            </Svg>

                            {/* CONTENT - POSITIONED ABSOLUTELY ON TOP */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                }}
                            >
                                <Text className="text-xl font-semibold text-center">
                                    Meal Is Being Generated
                                </Text>
                                <Text className="text-md text-gray-500 mt-1 text-center">
                                    Crafting your personalized meal, just a moment.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            {/*</View>*/}
        </Modal>
    );
}