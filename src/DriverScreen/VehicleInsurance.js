import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../Constants/Colors";
import ControllerInput from "../Components/ControllerInput";
import { AuthContext } from "../Providers/AuthProvider";
import { launchImageLibrary } from "react-native-image-picker";
import { Icon } from "react-native-elements";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { SafeAreaView } from "react-native";
import { Modal } from "react-native";
import { ERROR, LOADING } from "../Providers";
import ListEmpty from "../Components/ListEmpty";
import { ActivityIndicator } from "react-native";



const VehicleInsurance = ({ navigation, route }) => {
    const authStack = useMemo(() => true || route.params?.authStack);

    const [state, setState] = useState();

    const { submitVehicleInsurance, getInsuranceDetail } = useContext(
        AuthContext
    );

    const [selectedImage, setSelectedImage] = useState();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
    
        submitVehicleInsurance(
            {
                ...data,
                expiration_date: moment(expirationDate).format("YYYY-MM-DD"),
                image: selectedImage,
            },
            () => navigation.goBack()
        );
    };

    const imageSelectCallBack = (res) => {
        if (res.didCancel) return;
    
        setSelectedImage(res?.assets[0]);
    };

    const [expirationDate, setExpirationDate] = useState();
    const [
        expirationDatePickerVisible,
        setExpirationDatePickerVisibility,
    ] = useState(false);

    useEffect(
        () => (authStack ? null : getInsuranceDetail(setState, onGetSuccess)),
        []
    );

    const onGetSuccess = (data) => {
        reset(data);
        setSelectedImage({ uri: data.image });
        setExpirationDate(new Date(data.expiration_date));
    };

    switch (state) {
        case ERROR:
            return (
                <ListEmpty
                    emptyMsg="Something went wrong. Please try again."
                    retry={() => getInsuranceDetail(setState, onGetSuccess)}
                />
            );
        case LOADING:
            return (
                <ActivityIndicator
                    color={Colors.blue_color}
                    size="large"
                    style={{ justifyContent: "flex-start", padding: 50 }}
                />
            );
        default:
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {expirationDatePickerVisible && (
                            <DateModal
                                value={expirationDate}
                                confirm={setExpirationDate}
                                dismiss={() => setExpirationDatePickerVisibility(false)}
                            />
                        )}
                        <View
                            style={{
                                height: 250,
                                width: "100%",
                                backgroundColor: "#eee",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {selectedImage ? (
                                <View
                                    style={{
                                        flex: 1,
                                        height: 250,
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        style={{ height: 250, width: "100%", resizeMode: "cover" }}
                                        source={
                                            selectedImage
                                                ? selectedImage
                                                : {
                                                    uri:
                                                        "https://image.flaticon.com/icons/png/512/1655/1655290.png",
                                                }
                                        }
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => launchImageLibrary({}, imageSelectCallBack)}
                                        style={{
                                            borderRadius: 100,
                                            height: 150,
                                            width: 150,
                                            backgroundColor: "#00000050",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "absolute",
                                            opacity: 0.8,
                                        }}
                                    >
                                        <Icon color="white" size={50} name="autorenew" />
                                        <Text
                                            style={{
                                                color: "white",
                                                textAlign: "center",
                                                fontSize: 14,
                                            }}
                                        >
                                            Change the photo
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => launchImageLibrary({}, imageSelectCallBack)}
                                    style={{
                                        borderRadius: 100,
                                        height: 150,
                                        width: 150,
                                        backgroundColor: "white",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        elevation: 10,
                                        shadowColor: "#555",
                                    }}
                                >
                                    <Icon color="#aaa" size={50} name="add" />
                                    <Text
                                        style={{ color: "#aaa", textAlign: "center", fontSize: 14 }}
                                    >
                                        Add a photo
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#FFF",
                                alignItems: "center",
                                paddingTop: 16,
                            }}
                        >
                            <ControllerInput
                                label="NAME OF INSURED PERSON"
                                control={control}
                                errors={errors}
                                rules={{ required: true }}
                                fieldName="name"
                            />
                            <ControllerInput
                                label="CARRIER'S NAME"
                                control={control}
                                errors={errors}
                                rules={{ required: true }}
                                fieldName="carriers_name"
                            />
                            <ControllerInput
                                label="POLICY NUMBER"
                                control={control}
                                errors={errors}
                                rules={{ required: true }}
                                fieldName="policy_number"
                                keyboardType="numeric"
                            />
                            <View style={{ width: "90%", paddingHorizontal: 2 }}>
                                <Text
                                    style={{
                                        color: "#999",
                                        textAlign: "left",
                                        width: "100%",
                                        marginTop: 4,
                                    }}
                                >
                                    EXPIRATION DATE
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setExpirationDatePickerVisibility(true)}
                                    style={{
                                        padding: 8,
                                        paddingHorizontal: 0,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#ddd",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: expirationDate ? "black" : "#999",
                                        }}
                                    >
                                        {expirationDate
                                            ? expirationDate.toDateString()
                                            : "- - - - / - - / - -"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <CardBtn
                                onPress={handleSubmit(onSubmit)}
                                navigation={navigation}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            );
    }
};

export default VehicleInsurance;
const CardBtn = ({ onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.card,
            { backgroundColor: Colors.blue_color, padding: 16, marginTop: "auto" },
        ]}
    >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {"DONE"}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        width: "90%",
        backgroundColor: "#fff",
        alignItems: "center",
        shadowColor: "#999",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        borderRadius: 3,
        elevation: 5,
        marginTop: 40,
        marginBottom: 12,
    },
});

const DateModal = ({ dismiss, confirm, value, initialDate }) => {
    const [date, setDate] = useState(value || initialDate || new Date());

    const onConfirm = () => {
        confirm(date);
        dismiss();
    };
    return (
        <View>
            <Modal
                transparent={true}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={dismiss}
                    style={{
                        flex: 1,
                        backgroundColor: "#00000080",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            borderRadius: 15,
                            padding: 10,
                            position: "absolute",
                        }}
                    >
                        <DatePicker
                            androidVariant="nativeAndroid"
                            mode="date"
                            date={date}
                            onDateChange={setDate}
                            style={{ width: 250 }}
                        />
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={dismiss}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    flex: 1,
                                    borderWidth: 2,
                                    borderColor: Colors.privacypolicy_headingcolor + "50",
                                }}
                            >
                                <Text
                                    style={{
                                        // fontFamily: "Montserrat-SemiBold",
                                        textAlign: "center",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                                onPress={onConfirm}
                                style={{
                                    backgroundColor: Colors.blue_color,
                                    padding: 10,
                                    borderRadius: 5,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        // fontFamily: "Montserrat-SemiBold",
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                >
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};
