import {useNetInfo} from '@react-native-community/netinfo';
import React, {useContext, useEffect, useMemo} from 'react';
import {Text, View, Image, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import Colors from '../../Constants/Colors';
import ListEmpty from '../Components/ListEmpty';
import Rating from '../Components/Rating';
import {ACTIONS, RatingContext} from '../Providers/RatingProvider';

const ReviewRating = () => {
  const netInfo = useNetInfo();
  const {
    state: {data, loading, hasLoadedAllItems, refreshing, type, ratingData},
    dispatch,
  } = useContext(RatingContext);

  useEffect(() => dispatch({type: ACTIONS.Start}), []);

  return (
    <View style={{flex: 1}}>
      {(!loading || data.length > 0) && <Overview ratingData={ratingData} />}
      <FlatList
        keyExtractor={item => item.id}
        style={{width: '100%', height: 200}}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#ddd'}} />}
        ListEmptyComponent={!loading && <ListEmpty retry={() => dispatch({type: ACTIONS.Start})} netInfo={netInfo} emptyMsg="No Reviews Yet" />}
        ListFooterComponent={(loading || (!hasLoadedAllItems && type !== ACTIONS.OnFail)) && ListFooter}
        onEndReached={!hasLoadedAllItems && (() => dispatch({type: ACTIONS.LoadMore}))}
        onEndReachedThreshold={0.1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => dispatch({type: ACTIONS.Refresh})} />}
      />
    </View>
  );
};
export default ReviewRating;

const renderItem = ({item, index}) => (
  <View style={{padding: 17}}>
    <View style={{flexDirection: 'row', paddingBottom: 10}}>
      <Image style={{height: 40, width: 40, marginRight: 10, borderRadius: 35}} source={{uri: item.userImage}} />
      <View>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.userdetails[0].name}</Text>
        <Rating rating={item.rating} />
      </View>
      <Text style={{marginLeft: 'auto', color: '#999'}}>{item.created_date}</Text>
    </View>
    <Text numberOfLines={3} style={{color: '#999', lineHeight: 25}}>
      {item.comment.trim()}
    </Text>
  </View>
);

const ListFooter = () => (
  <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', padding: 8}}>
    <ActivityIndicator color={Colors.blue_color} size="large" />
  </View>
);

const Overview = ({ratingData}) => {
  const totalReviews = useMemo(() => ratingData.map(v => v.count).reduce((p, c) => p + c), [ratingData]);
  const largestReview = useMemo(() => ratingData.map(v => v.count).reduce((p, c) => (p > c ? p : c)), [ratingData]);
  const avarageRating = useMemo(() => (totalReviews ? ratingData.map(v => v.count).reduce((p, c, ci) => p + c * (ci + 1)) / totalReviews : 0), [
    ratingData,
  ]);
  return (
    <View style={{flexDirection: 'row', padding: 15, borderBottomColor: '#ddd', borderBottomWidth: 1}}>
      <View style={{width: '50%', alignItems: 'center', justifyContent: 'center', height: 100}}>
        <Text style={{color: Colors.blue_color, fontSize: 30}}>{avarageRating.toFixed(1)}</Text>
        <Rating rating={avarageRating} />
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Image style={{width: 16, height: 16, tintColor: '#777'}} source={require('../../Assets/icon/user.png')} />
          <Text style={{marginHorizontal: 3, color: '#999'}}>{totalReviews} Total</Text>
        </View>
      </View>
      <View style={{width: '50%'}}>
        {[...ratingData].reverse().map((rating, i) => (
          <Percent key={i} rate={rating.ratingStars} percent={(rating.count / largestReview) * 100} count={rating.count} />
        ))}
      </View>
    </View>
  );
};

const Percent = ({rate, percent, count}) => (
  <View style={{padding: 0}}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image style={{width: 16, height: 16, tintColor: '#aaa'}} source={require('../../Assets/review.png')} />
      <Text style={{marginHorizontal: 3, color: '#999'}}>{rate}</Text>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', height: 4, backgroundColor: '#dedede'}}>
        <View style={{width: percent + '%', height: '100%', backgroundColor: Colors.dark_orange}} />
      </View>
    </View>
    <Text style={{textAlign: 'right', fontSize: 10, color: '#777', lineHeight: 10}}>{count}</Text>
  </View>
);
