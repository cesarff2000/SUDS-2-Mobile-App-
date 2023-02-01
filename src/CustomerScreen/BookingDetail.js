import { useNetInfo } from "@react-native-community/netinfo";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal } from "react-native";
import { TextInput } from "react-native";
import { Image } from "react-native";
import { Alert } from "react-native";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Icon, Rating } from "react-native-elements";
import Colors from "../../Constants/Colors";
import Divider from "../Components/Divider";
import ListEmpty from "../Components/ListEmpty";
import { ERROR, LOADING } from "../Providers";
import { BookingContext, WASH_COMPLETED } from "../Providers/BookingProvider";
import { changeStack } from '../Navigation/NavigationService';
import { useNavigation } from "@react-navigation/native";


const BookingDetails = ({ route }) => {
  console.log('BookingDetails',BookingDetails)
  const netInfo = useNetInfo();
  const [booking, setBooking] = useState();
  console.log('booking',booking)
  const [tips] = useState(["$10", "$15", "$20", "Custom"]);
  const [selectedTip, setSelectedTip] = useState();
  const { getSingleBookingDetails } = useContext(BookingContext);
  const booking_id = useMemo(() => route.params?.id, []);
  const [reviewPopupVisible, setReviewPopupVisibility] = useState(false);

  useEffect(() => getSingleBookingDetails(booking_id, setBooking), []);

  useEffect(() => {
    if (booking?.tip !== "0") {
      setSelectedTip(booking?.tip);
    }
    console.log(booking);
  }, [booking]);
  
  const getBooking = () => {
    getSingleBookingDetails(booking_id, setBooking)
  };

  const RedirectDashboard = () => {
    changeStack('CustomerHomeStack')
  }

  const Body = () => {
    switch (booking) {
      case LOADING:
        return (
          <ActivityIndicator
            size="large"
            color={Colors.blue_color}
            style={{ alignSelf: "center", height: "100%" }}
          />
        );
      case ERROR:
        return (
          <ListEmpty
            retry={() => getSingleBookingDetails(booking_id, setBooking)}
            opacity={0.5}
            color={Colors.blue_color}
            netInfo={netInfo}
            emptyMsg="Error loading request details."
          />
        );

      default:
        return (
          <ScrollView style={styles.container}>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              Wash Location
            </Text>
            <Text style={[styles.text]}>{booking?.wash_location}</Text>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Detail
              bold
              title={booking?.vehicledetails[0]?.model || booking?.vehicle_type}
              detail={"$" + WashPrice(booking).toFixed(2)}
            />
            {booking?.extraaddonsdetails?.map((ext) => (
              <Detail
                key={ext.id}
                title={ext.add_ons_name}
                detail={"" + parseFloat(ext.add_ons_price).toFixed(2)}
              />
            ))}
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Detail
              bold
              detailColored
              title="Total :"
              detail={"$" + parseFloat(booking?.total).toFixed(2)}
            />
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Text
              style={[
                styles.text,
                {
                  fontWeight: "bold",
                  textAlign: "center",
                  color: Colors.dark_orange,
                  paddingVertical: 0,
                },
              ]}
            >
              {booking?.booking_date}, {booking?.booking_time}
            </Text>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            {booking?.tip !== '0' ? (
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 0,
                  },
                ]}
              >
                TIP
              </Text>
            ) : null}

            {booking?.tip !== '0' ? (
              <View style={{ flexDirection: "row" }}>
                {tips.map((v, i) => (
                  <TipItem
                    amount={v}
                    key={i}
                    onPress={() => setSelectedTip(v)}
                    selected={v == selectedTip}
                  />
                ))}
              </View>
            ) : null}

            {booking?.rating > 0 && (
              <Text
                style={[
                  styles.text,
                  {
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 10,
                  },
                ]}
              >
                Your rating on this job
              </Text>
            )}
            {booking?.rating > 0 && (
              <View
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  borderRadius: 20,
                  alignItems: "center",
                }}
              >
                <Rating
                  showRating
                  readonly
                  imageSize={24}
                  startingValue={booking?.rating}
                />
                <Text
                  style={{
                    color: "#777",
                    marginTop: 15,
                    padding: 15,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    width: "100%",
                  }}
                >
                  {booking?.review}
                </Text>
              </View>
            )}
            {/* {!booking?.rating || booking.rating == '0' && type.current == CUSTOMER && ( */}
            {/* {type.current == CUSTOMER && ( */}
            {(booking?.tip !== "0" || booking?.rating !== "0" || booking?.review !== "") ? (
              <View style={{ paddingVertical: 10, width: "100%" }}>
                <TouchableOpacity
                  onPress={RedirectDashboard}
                  style={{
                    backgroundColor: Colors.blue_color,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 18,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                  >
                    {" "}
                    Go to Dashboard{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            ) :
              <View style={{ paddingVertical: 10, width: "100%" }}>
                <TouchableOpacity
                  onPress={() => setReviewPopupVisibility(true)}
                  style={{
                    backgroundColor: Colors.blue_color,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 18,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                  >
                    Tip and Add a Review
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {/* {booking?.booking_status == WASH_COMPLETED && (
              <View style={{ paddingVertical: 10, width: "100%" }}>
                <TouchableOpacity
                  onPress={() => setReviewPopupVisibility(true)}
                  style={{
                    backgroundColor: Colors.blue_color,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 18,
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", color: "white", fontSize: 16 }}
                  >
                    {" "}
                    Tip and Add a Review{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}
            {/* )} */}
            {booking?.booking_status == WASH_COMPLETED && (
              <View style={{ paddingBottom: 20 }}>
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Wash Images
                </Text>
                {Object.values(booking.image[0]).map((v, i) => (
                  <Image
                    key={i}
                    style={{ borderRadius: 10, height: 200, marginBottom: 10 }}
                    source={{ uri: v }}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        );
    }
  };

  return (
    <ImageBackground
      style={styles.imgBg}
      source={require("../../Assets/bg_img.png")}
    >
      {reviewPopupVisible && (
        <ReviewPopup
          refreshDetail={getBooking}
          booking={booking}
          dismiss={() => setReviewPopupVisibility(false)}
          tips={tips}
          setSelectedTip={setSelectedTip}
          selectedTip={selectedTip}
        />
      )}
      <Body />
    </ImageBackground>
  );
};

export default BookingDetails;

const Detail = ({ title, detail, bold, detailColored }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <Text style={[styles.text, { fontWeight: bold ? "bold" : "normal" }]}>
      {title}
    </Text>
    <Text
      style={[
        styles.text,
        {
          fontWeight: bold ? "bold" : "normal",
          color: detailColored ? Colors.blue_color : "white",
        },
      ]}
    >
      {detail}
    </Text>
  </View>
);

const TipItem = ({ amount, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={1}
    style={{
      padding: 5,
      backgroundColor: selected ? Colors.blue_color : "white",
      borderRadius: 10,
      flex: 1,
      alignItems: "center",
      margin: 5,
    }}
    onPress={() => onPress(amount)}
  >
    <Text style={{ color: selected ? "white" : "black", fontWeight: "bold" }}>
      {amount}
    </Text>
  </TouchableOpacity>
);

const WashPrice = (booking) =>{
  console.log('WashPrice',WashPrice,booking)
return booking?.total -
(booking?.extraaddonsdetails
  ?.map((ext) => ext.add_ons_price)
  .reduce((p, c) => parseFloat(p) + parseFloat(c), []) || 0);
}
  

const styles = StyleSheet.create({
  imgBg: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    padding: 15,
  },
  text: {
    fontSize: 16,
    color: "white",
    paddingVertical: 7,
  },
});

const ReviewPopup = ({
  dismiss,
  booking,
  refreshDetail,
  tips,
  setSelectedTip,
  selectedTip,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const { addReview } = useContext(BookingContext);

  const onDone = () => {

    if (selectedTip !== undefined || review.trim().length !== 0 || rating !== 0) {
      // Alert.alert("sss")
      addReview(
        {
          washer_id: booking?.washer_id,
          request_id: booking?.booking_id,
          review,
          rating,
          tip: selectedTip,
        },
        () => {
          dismiss();
          refreshDetail();
        }
      );
    }
    else {
      return Alert.alert("Invalid", "Please insert both review and rating and tip");
    }
    // if (selectedTip == undefined)

  };

  // const onDone = () =>{
  //   dismiss();
  //   refreshDetail();
  // }


  const cancel = () => {
    dismiss();
    refreshDetail();
  }

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
              backgroundColor: "white",
              borderRadius: 20,
              position: "absolute",
              width: "85%",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e5e5e5",
                padding: 16,
                width: "100%",
              }}
            >
              <Icon name="rate-review" />
              <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>
                Rate & Review / Tips
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#cfcfcf",
                padding: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  padding: 16,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    paddingHorizontal: 16,
                    textAlign: "center",
                  }}
                >
                  Tips
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {tips.map((v, i) => (
                  <TipItem
                    amount={v}
                    key={i}
                    onPress={() => setSelectedTip(v)}
                    selected={v == selectedTip}
                  />
                ))}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                padding: 16,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  paddingHorizontal: 16,
                  textAlign: "center",
                }}
              >
                Rate & Review
              </Text>
            </View>
            <Rating
              showRating
              onFinishRating={setRating}
              startingValue={rating}
              fractions={1}
              jumpValue={0.5}
              style={{ paddingVertical: 10 }}
            />

            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Type your review here..."
              textAlignVertical="top"
              style={{
                padding: 10,
                margin: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ddd",
                minHeight: 100,
              }}
            />
            <TouchableOpacity
              onPress={onDone}
              style={{
                padding: 16,
                margin: 10,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0,
                backgroundColor: Colors.blue_color,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancel}
              style={{
                padding: 16,
                margin: 10,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0,
                backgroundColor: "red",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
