import {database, firebase} from '@react-native-firebase/database';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  LogBox,
} from 'react-native';
import {useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import {Center} from 'native-base';

const AllUsers = ({navigation}, props, data) => {
  //  const {userData} =useSelector(state=>state.User)
  // console.log('ndiobnce=====>',props)
  const [allUser, setallUser] = useState([]);
  const [Data, setData] = useState([]);
  const [allUserBackup, setallUserBackup] = useState([]);
  const [filterUser, setfilterUser] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  // const [time,setTime]=useState();

  const {userData} = useSelector(state => state.User);
  // const lastmes=props.route.params.lstms
  // console.log('dfb------------------->', userData);
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // getAllGroups();
  }, []);

  useEffect(() => {
    getAllUser();
    // chlist();
    // console.log(allUser);
  }, [allUser]);

  const getAllUser = () => {
    firebase
      .database()
      .ref('/users/')
      .once('value')
      .then(snapshot => {
        // console.log('alluser Data:', userData);
        setallUser(
          Object.values(snapshot.val()).filter(it => it.id !== userData.id),
        );
        setallUserBackup(
          Object.values(snapshot.val()).filter(it => it.id !== userData.id),
        );
      });
  };

  const SearchBtn =
    // alert(search)
    allUser.filter(val => {
      if (search == '') {
        return val;
      } else if (val.Name.toLowerCase().includes(search.toLowerCase())) {
        return val;
      }
    });

  const createChatList = data => {
    firebase
      .database()
      .ref('/chatlist/' + userData.id + '/' + data.id)
      .once('value')
      .then(snapshot => {
        // console.log('User data: ', snapshot.val());

        if (snapshot.val() == null) {
          let roomId = uuid.v4();
          let myData = {
            roomId,
            id: userData.id,
            Name: userData.Name,
            phoneNumber: userData.phoneNumber,
            img: userData.img,
            about: userData.about,
            lastMsg: '',
          };
          firebase
            .database()
            .ref('/chatlist/' + data.id + '/' + userData.id)
            .update(myData);
          // .then(() => console.log('Data updated.'));

          // delete data['password'];
          data.lastMsg = '';
          data.roomId = roomId;
          firebase
            .database()
            .ref('/chatlist/' + userData.id + '/' + data.id)
            .update(data);
          // .then(() => console.log('Data updated.'));

          navigation.navigate('Chat', {receiverData: data});
        } else {
          navigation.navigate('Chat', {receiverData: snapshot.val()});
        }
      });
  };
  const getAllGroups = async () => {
    firebase
      .database()
      .ref('/Groups/')
      .on('value', snapshot => {
        setData(Object.values(snapshot.val()));
      });
  };

  const renderItem = ({item}) => {
    const chatList = () => {
      createChatList(item);
    };

    return (
      <View style={{flexDirection: 'row', marginTop: 40}}>
        <View
          style={{
            marginLeft: 20,
          }}>
          <Image
            source={{
              uri: 'https://media.gettyimages.com/photos/tesla-ceo-elon-musk-speaks-during-the-unveiling-of-the-new-tesla-y-picture-id1130598318?s=2048x2048',
            }}
            style={{
              justifyContent: 'flex-start',
              height: 50,
              width: 50,
              borderRadius: 100,
              borderWidth: 5,
            }}
          />
        </View>
        <TouchableOpacity onPress={() => chatList()}>
          <View style={{marginLeft: 40}}>
            <Text style={{fontWeight: 'bold'}}>{item.Name}</Text>
            {/* <View>
              <Text style={{color: '#000'}}>{chlist()}</Text>
            </View> */}
          </View>
          <View style={{marginLeft: 250, flexDirection: 'row', marginTop: -20}}>
            <Image source={require('../../Assets/msgLogo.png')}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const [result, setResult] = useState('');
  return (
    <ScrollView>
      <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
        <Text style={{color: '#2994FF', fontWeight: 'bold', fontSize: 30}}>
          All Users
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            backgroundColor: '#f3f2f3',
            overflow: 'hidden',
            alignItems: 'center',
            flexDirection: 'row',
            height: 60,
            width: '90%',
            borderRadius: 6,
            backgroundColor: '#f2f3f2',
            marginHorizontal: 10,
            marginVertical: 20,
            borderWidth: 1
          }}>
          <Image
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}
            source={require('../../Assets/search.png')}
          />
          <TextInput
            style={{flexWrap: 'wrap', flex: 1, }}
            placeholder="Search"
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
          />
        </View>
        {/* <View
          style={{
            justifyContent: 'center',
            marginLeft: 7,
            marginTop: 22,
            backgroundColor: '#2994FF',
            width: 55,
            height: 55,
            borderRadius: 5,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
            <Image
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 20,
                width: 20,
                marginLeft: 18,
              }}
              source={require('../../Assets/+.png')}
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <View>
        <FlatList
          nestedScrollEnabled
          data={SearchBtn}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity
          style={{marginTop: 380, justifyContent: 'center', marginLeft: 140}}
          onPress={() => navigation.navigate('ChatList', {receiverData: data})}>
          <Text>ChatList</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AllUsers;
