import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import CheckMark from '../../../assets/CheckMark.png';

const HomeFeedbackSubmitted = ({cardName, closeModal}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.cardContainer}>
          <View style={styles.imageContainer}>
            <Image source={CheckMark} style={styles.checkMarkImage} />
            <Text style={styles.ratingText}>{cardName} Submitted!</Text>
          </View>
          {closeModal && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.goHomeButton}
                onPress={closeModal}>
                <Text style={styles.goHomeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop:10
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '90%', // Adjust the width as needed
    maxWidth: 400, // Optional: set a max width
    alignItems: 'center', // Center content horizontally
  },
  completionText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  checkMarkImage: {
    width: 140,
    height: 140,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    color: '#3DDE15',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  goHomeButton: {
    paddingHorizontal: 20,
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: '#000000',
  },
  nextValueButton: {
    paddingHorizontal: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#000000',
  },
  goHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeFeedbackSubmitted;
