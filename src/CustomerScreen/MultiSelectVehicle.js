import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
} from "react-native";
import Colors from "../../Constants/Colors";
import CheckBox from "react-native-check-box";
import {
  bookingType,
  changeStack,
  ON_DEMAND,
} from "../Navigation/NavigationService";
import LoadingView from "../Components/LoadingView";
import { BookingContext } from "../Providers/BookingProvider";
import { ERROR, LOADING } from "../Providers";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native";
import FastImage from "react-native-fast-image";
import { Button } from "react-native-elements";

const MultiSelectVehicle = ({navigation}) => {
  const [types, setTypes] = useState([
    // {
    //   category_id: 1,
    //   category_name: "Car or Truck",
    //   sub_category_id: 1,
    //   sub_category_name: "Audi",
    //   image: undefined,
    // },
    // {
    //   category_id: 1,
    //   category_name: "Car or Truck",
    //   sub_category_id: 2,
    //   sub_category_name: "BMW",
    //   image: undefined,
    // },
    // {
    //   category_id: 1,
    //   category_name: "Car or Truck",
    //   sub_category_id: 3,
    //   sub_category_name: "Mercedes",
    //   image: undefined,
    // },
    {
      category_id: 3,
      category_name: "Boats",
      sub_category_id: 20,
      sub_category_name: "BOATS UNDER 20 FEET",
      image: undefined,
    },
    {
      category_id: 3,
      category_name: "Boats",
      sub_category_id: 21,
      sub_category_name: "BOATS OVER 20 FEET",
      image: undefined,
    },
    {
      category_id: 2,
      category_name: "Tractor",
      sub_category_id: 16,
      sub_category_name: "BIG RIGS",
      image: undefined,
    },
    {
      category_id: 2,
      category_name: "Tractor",
      sub_category_id: 17,
      sub_category_name: "VACUM/CEMENT",
      image: undefined,
    },
    {
      category_id: 2,
      category_name: "Tractor",
      sub_category_id: 28,
      sub_category_name: "BOX & FLEET",
      image: undefined,
    },
    {
      category_id: 4,
      category_name: "Motorcycle",
      sub_category_id: 9,
      sub_category_name: "Motorcycle",
      image: undefined,
    },
    {
      category_id: 6,
      category_name: "Heavy Equipment",
      sub_category_id: 10,
      sub_category_name: "Heavy Equipment",
      image: undefined,
    },
    {
      category_id: 5,
      category_name: "RV's, Bus, M.H.",
      sub_category_id: 11,
      sub_category_name: "RV's, Bus, M.H.",
      image: undefined,
    },
    {
      category_id: 7,
      category_name: "Business Wash",
      sub_category_id: 12,
      sub_category_name: "Business Wash",
      image: undefined,
    },
  ]);
  const [category, setCategory] = useState([
    {
      category_id: 1,
      image: undefined,
      category_name: "Car or Truck",
    },
    {
      category_id: 3,
      image: undefined,
      category_name: "Boats",
    },
    {
      category_id: 2,
      image: undefined,
      category_name: "Tractor",
    },

    {
      category_id: 4,
      image: undefined,
      category_name: "Motorcycle",
    },
    {
      category_id: 6,
      image: undefined,
      category_name: "Heavy Equipment",
    },
    {
      category_id: 5,
      image: undefined,
      category_name: "RV's, Bus, M.H.",
    },
    {
      category_id: 7,
      image: undefined,
      category_name: "Business Wash",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectTypes, setSelectTypes] = useState([]);
  const [selectCategorys, setSelectCategorys] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [filterData, setFilterDate] = useState([]);
  const { getVehicles, vehicles, setCurrentBooking } = useContext(BookingContext)

  useEffect(() => getVehicles(), [])

  useEffect(() => {
    if(vehicles.length > 0){
        console.log('vehicles : ', vehicles)
        var allType = types
        vehicles.forEach(element => {
            element.sub_category_id = element.vehicle_id
            element.sub_category_name = element.make + ' ' + element.model
            allType.push(element)
        });
        console.log('All  : ', allType)
        
    }
  }, [vehicles])

  const setSelectedVehicle = (item, dataType) => {
    if (!dataType) {
      if (selectTypes.includes(item))
        setSelectTypes((cv) =>
          cv.filter((v) => v.sub_category_id != item.sub_category_id)
        );
      else if (selectTypes.length < 3) setSelectTypes((cv) => [...cv, item]);
      else Alert.alert("At least select only 3 vehicle.");
    } else {
      if (selectCategorys.includes(item))
        setSelectCategorys((cv) =>
          cv.filter((v) => v.category_id != item.category_id)
        );
      else setSelectCategorys((cv) => [...cv, item]);
    }
  };

  const onSelectCategory = () => {
    if (selectCategorys.length > 0) {
      var category_id = selectCategorys.map((cv) => {
        return cv.category_id;
      });
      var type = types.filter((t) => {
        return category_id.includes(t.category_id);
      });
      setFilterDate(type);
    } else {
      setFilterDate([]);
    }
  };

  const List = ({ vehicles, dataType }) => {
    
    return (
      <FlatList
        keyExtractor={(item, index) => index}
        style={{ width: "100%" }}
        data={vehicles}
        ItemSeparatorComponent={() => <View style={{ margin: -15 }} />}
        ListFooterComponent={() => <View style={{ height: 200 }} />}
        renderItem={({ item, index }) => (
          <RenderItem
            dataType={dataType}
            item={item}
            onClick={() => {
              setSelectedVehicle(item, dataType);
            }}
            checked={
              dataType
                ? selectCategorys.includes(item)
                : selectTypes.includes(item)
            }
          />
        )}
      />
    );
  };

  const onClickFilter = () => {
    setFilterModal(!filterModal);
    // onSelectCategory();
  };

  const FilterOption = () => {
    return (
      <View style={styles.modalView}>
        <View
          style={{
            display: "flex",
            backgroundColor: Colors.blue_color,
            height: 50,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "70%", padding: 10, fontWeight: "bold" }}>
            <Text style={{ fontSize: 15, color: 'white' }}>Vehicle Type</Text>
          </View>
          <View style={{ width: "20%" }}>
            <TouchableOpacity
              onPress={() => {
                onClickFilter();
              }}
            >
              <FastImage
                tintColor={'white'}
                source={require("../../Assets/error.png")}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <List vehicles={category} dataType={true} />
        <View style={{display: 'flex', width: '100%', flexDirection: 'row'}}>
            <View style={{width: '50%'}}>
                <TouchableOpacity style={[{ width: '100%', padding: 12, backgroundColor: 'red' }]} onPress={onClickFilter}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={{width: '50%'}}>
                <TouchableOpacity style={[{ width: '100%', padding: 12,  backgroundColor: Colors.blue_color }]} onPress={onSelectCategory}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Filter</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  };

  const onNext = async () => {
    if (selectTypes.length == 0)
      Alert.alert("Select Vehicle", "Please select a vehicle to continue.");
    else {
        var vehicle_id = selectTypes.map(st => {if(st.category_id == 1) return st.vehicle_id})
        console.log('vehicle_id : ', vehicle_id)
        console.log('type : ', selectTypes)
      setCurrentBooking((cv) => ({
        ...cv,
        // vehicle_id: selectState[0]?.vehicle_id,
        // vehicle: `${selectState[0].make} ${selectState[0].year} ${selectState[0].model}`,
        vehicle_id: vehicle_id,
        vehicle: selectTypes,
      }));
      if (bookingType.current == ON_DEMAND) {
        navigation.navigate("Packages", {
          packageParams: { vendor_id: currentBooking?.washer_id },
        });
      } else navigation.navigate("Select a Vendor");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blue_color }}>
      <ImageBackground
        style={{ width: "100%", height: "100%", flex: 1 }}
        source={require("../../Assets/bg_img.png")}
      >
        <LoadingView loading={loading}>
          <View style={{ alignItems: "center", width: "100%" }}>
            <List
              vehicles={filterData.length > 0 ? filterData : types}
              dataType={false}
            />
          </View>
        </LoadingView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setFilterModal(!filterModal);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000008",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {FilterOption()} */}
            <FilterOption />
          </View>
        </Modal>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "flex-end",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
            }}
          >
            <View style={{ width: "45%" }}>
              <TouchableOpacity
                elevation={5}
                onPress={() => {
                  navigation.navigate("Add New Vehicle");
                }}
                style={styles.add_btn}
                underlayColor="gray"
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: Colors.buton_label,
                  }}
                >
                  + Add New Vehicle
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "45%" }}>
              <TouchableOpacity
                elevation={5}
                onPress={() => {
                  onClickFilter();
                }}
                style={styles.add_btn}
                underlayColor="gray"
                activeOpacity={0.8}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FastImage
                    source={require("../../Assets/filter.png")}
                    style={{ width: 20, height: 20 }}
                    tintColor="white"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: Colors.buton_label,
                      marginLeft: 10,
                    }}
                  >
                    Filter
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* <Text
            style={{
              color: "#fff",
              fontSize: 17,
              textAlign: "center",
              marginHorizontal: 20,
              marginVertical: 5,
            }}
          >
            Pricing based on loacation{" "}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 17,
              textAlign: "center",
              marginHorizontal: 20,
              marginVertical: 5,
            }}
          >
            and vehicle make/model
          </Text> */}

          <View style={{ alignItems: "center", marginTop: "auto" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                elevation={5}
                onPress={onNext}
                style={styles.auth_btn}
                underlayColor="gray"
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: Colors.buton_label,
                    fontWeight: "bold",
                  }}
                >
                  Next
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                elevation={5}
                // onPress={() => changeStack("CustomerHomeStack")}
                style={styles.auth_btn}
                underlayColor="gray"
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: Colors.buton_label,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default MultiSelectVehicle;

const styles = StyleSheet.create({
  auth_textInput: {
    alignSelf: "center",
    width: "93%",
    borderBottomWidth: 1,
    height: 40,
    color: Colors.text_color,
    marginTop: 10,
  },
  auth_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.buttom_color,
    flex: 1,
    width: "100%",
    height: 60,
    justifyContent: "center",
  },
  add_btn: {
    backgroundColor: "#e28c39",
    alignItems: "center",
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderRadius: 20,
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "50%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

const RenderItem = ({ dataType, item, onClick, checked }) => (
  <TouchableOpacity
    onPress={onClick}
    style={{
      padding: 10,
      flex: 1,
      margin: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      paddingVertical: 10,
    }}
  >
    <View style={{ flexDirection: "row", borderBottomWidth: dataType ? 2 : 0 }}>
      {!dataType && (
        <View
          style={{
            overflow: "hidden",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#00000030",
          }}
        >
          <Image
            style={{
              height: 60,
              width: 60,
              padding: 5,
              resizeMode: item.image != "undefined" ? "cover" : "contain",
            }}
            source={
              item.image != "undefined"
                ? { uri: "http://suds-2-u.com/public/vehicle/" + item.image }
                : require("../../Assets/car_default.png")
            }
          />
        </View>
      )}

      <View>
        <Text style={{ marginHorizontal: 5, fontSize: 18, flex: 1 }}>{`${
          dataType ? item.category_name : item.sub_category_name
        }`}</Text>
        {!dataType && (
          <Text
            style={{ marginHorizontal: 5, fontSize: 14, flex: 1 }}
          >{`${item.category_name}`}</Text>
        )}
      </View>

      <CheckBox
        style={{ padding: 5, alignSelf: "center", marginLeft: "auto" }}
        onClick={onClick}
        isChecked={checked}
        checkedImage={
          <Image
            source={require("../../Assets/icon/checked.png")}
            style={{ width: 22, height: 22 }}
          />
        }
        unCheckedImage={
          <Image
            source={require("../../Assets/icon/unchecked.png")}
            style={{ width: 22, height: 22 }}
          />
        }
      />
    </View>
  </TouchableOpacity>
);
