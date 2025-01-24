import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';

const IdeaCard = ({ title, description, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerBanner}>
        <Text style={styles.headerText}>Win Amazon Vouchers!</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaText}>Learn More</Text>
      </View>
    </Pressable>
  );
};

export default IdeaCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  headerBanner: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF5722',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 20,
    paddingTop: 40,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 24,
  },
  ctaBanner: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

