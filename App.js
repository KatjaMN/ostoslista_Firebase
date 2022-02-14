import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Button, TextInput } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';
//import { getAnalytics } from "firebase/analytics";

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyCOp_rcYVQyek7J3D8ZvmhuBx4SnTxsp1I",
    authDomain: "shopping-list-firebase-f1a92.firebaseapp.com",
    projectId: "shopping-list-firebase-f1a92",
    storageBucket: "shopping-list-firebase-f1a92.appspot.com",
    messagingSenderId: "268185760340",
    appId: "1:268185760340:web:5a4de205b2046f4410b3c1",
    measurementId: "G-11M5P1ZNPX"
  };

  const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app);


  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  

//Save product and amount to the list.
  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount });
      setProduct('');
      setAmount('');
  }

  useEffect( () => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    setItems(Object.values(data));
    })
    }, []);
      

        //Delete a product from list, when already bought
        const deleteItem = (key) => {
          console.log('deleteItem', key, items.find(item => item.key === key));
      remove(ref(database, 'items/' + key))
          }

  return (
      <View style={styles.container}>
          <TextInput style={styles.input} placeholder='Product' onChangeText={product => setProduct(product)} value={product} />
          <TextInput style={styles.input} placeholder='Amount' onChangeText={amount => setAmount(amount)} value={amount} />
          <View style={styles.row}>
              <View style={styles.button}>
                  <Button onPress={saveItem} title='Save' />
              </View>
          </View>
          <Text style={{ marginTop: 10, marginBottom:4, fontSize: 20, color: 'blue', fontWeight: 'bold' }}>Shopping list</Text>
          <FlatList
              style={{ marginLeft: "5%" }}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) =>
                  <View style={styles.listcontainer}>
                      <Text style={{marginBottom:3, fontSize: 15 }}>{item.product}, {item.amount} </Text>
                      <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.key)}>bought</Text>
                  </View>}
              data={items}
          />

          <StatusBar style="auto" />
      </View>
  );
}



const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 70
  },
  
  listcontainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center'
     },

  input: {
      width: '50%',
      height: 35,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 5,
      padding: 3
  },

  row: {
      flexDirection: "row",
      justifyContent: 'space-evenly',
      width: '20%',
      marginTop: 20,
      marginBottom: 30,
  },


  button: {
      marginTop: 10,
      fontWeight: 'bold'
  }

});



