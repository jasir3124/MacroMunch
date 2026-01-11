import {Modal, View, Text, Pressable} from "react-native";

export function AlertMealGeneration({visible, onClose,}: { visible: boolean; onClose: () => void;
}) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View
                className={"flex-1 items-center justify-center bg-black/50"}
            >
                <View
                    className={"w-10/12 bg-white rounded-2xl p-4"}
                >
                    <Text className="text-xl font-bold text-blueGray text-center">
                        Daily limit reached
                    </Text>

                    <Text style={{marginTop: 8, color: "#aaa"}}>
                        You’ve reached your limit for today. You can use this again tomorrow.
                    </Text>

                    <Pressable
                        onPress={onClose}
                        className={"bg-greenSoft"}
                        style={{
                            marginTop: 16,
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{color: "#fff", fontWeight: "600"}}>
                            Got it
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
