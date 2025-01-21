import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ValuesCompletedCard = ({yourScore,managerScore,title}) => {
    let remark = ''
    let remarkColor = '';
  
    const difference = Math.abs(yourScore - managerScore);
  
    if (difference <= 1) {
      remark = 'EXCELLENT';
      remarkColor = '#3DDE15'; // Green
    } else if (difference > 1 && difference < 2) {
      remark = 'ACCEPTABLE';
      remarkColor = '#F89E18'
    }else if(difference > 2 && difference < 3) {
      remark='NEEDS ATTENTION'
      remarkColor = '#FFB72C'
    }else {
        remark = 'ALARMING';
        remarkColor='#F83718'
      }
  return (
    <View style={styles.card}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.remark,{backgroundColor:remarkColor}]}>{remark}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.scoreSection}>
          <Text style={styles.score}>{yourScore}</Text>
          <Text style={styles.subTitle}>Your Score</Text>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.scoreSection}>
          <Text style={styles.score}>{managerScore}</Text>
          <Text style={styles.subTitle}>Manager Score</Text>
        </View>
      </View>
    </View>
  );
};

export default ValuesCompletedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
    width:'100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreSection: {
    flex: 1,
    alignItems: 'center',
    padding:15
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#ccc',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color:'#7C7C7C'
  },
  remark: {
    fontSize: 10,
    color: '#ffffff',
    backgroundColor: '#3DDE15',
    borderRadius: 16,
    padding: 5,
    paddingHorizontal: 15,
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color:'#7C7C7C'
  },
  subTitle: {
    fontSize: 10,
    fontWeight: '300',
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    borderColor: '#D9D9D9',
    padding: 2,
    paddingHorizontal: 15,
    marginTop: 10,
    color:'#0B0B0B'
  },
});