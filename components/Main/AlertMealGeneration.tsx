import {Modal, Text, Pressable, Animated, Easing} from "react-native";
import {useEffect, useRef, useState} from "react";

export function AlertMealGeneration({visible, onClose,}: {
    visible: boolean; onClose: () => void;
}) {
    const translateY = useRef(new Animated.Value(-150)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const [ModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            translateY.setValue(-150);
            opacity.setValue(0);

            setModalVisible(true);

            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 40,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -150,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setModalVisible(false);
            });
        }
    }, [visible]);

    return (
        <Modal visible={ModalVisible} transparent onRequestClose={onClose}>
            {/* Backdrop */}
            <Pressable className="flex-1" onPress={onClose}>
                <Animated.View
                    style={{
                        transform: [{translateY}],
                        opacity,
                    }}
                    className="
                        absolute
                        top-0
                        self-center
                        w-11/12
                        bg-white
                        border-2 border-limeSoft
                        rounded-2xl
                        p-4
                        shadow-lg
                    "
                >
                    <Text className="text-lg font-bold text-center">
                        Daily limit reached
                    </Text>

                    <Text className="mt-2 text-gray-500 text-center">
                        You’ve reached your limit for today. You can use this again tomorrow.
                    </Text>

                    <Pressable
                        onPress={onClose}
                        className="mt-4 bg-greenSoft py-3 rounded-xl items-center"
                    >
                        <Text className="text-white font-semibold">
                            Got it
                        </Text>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}
