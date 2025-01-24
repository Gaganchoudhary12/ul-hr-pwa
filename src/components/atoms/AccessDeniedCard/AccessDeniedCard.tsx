import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import DeniedImage from '../../../assets/denied.svg'

const AccessDeniedCard = ({ title, onButtonPress }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
      <DeniedImage width={120} height={120} />
      <Text style={styles.text}>Complete your rating to view</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>Okay</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AccessDeniedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderColor: '#F89E18',
    shadowColor: '#F89E18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    padding: 15,
    alignSelf:'center',
    marginBottom:20,
    width:330,
    height: 400,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    top: 20,
    color:'#7C7C7C'
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 20,
    fontWeight:'400',
    marginBottom: 20,
    color: '#F89E18',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    backgroundColor: '#1F2429',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#ffffff",
  },
});
