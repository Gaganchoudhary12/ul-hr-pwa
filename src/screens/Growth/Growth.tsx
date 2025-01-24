// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { Header } from '../../components/organism/Header';
// import MultiColumnDropdown from '../../components/molecules/DropDown/DropDown';
// import ValuesCompletedCard from '../../components/atoms/ValuesCompletedCard/ValuesCompletedCard';
// import { useSelectedDate } from '../../state/SelectedDateContext';

// const Growth = ({route}) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const {selectedValue, setSelectedValue} = useSelectedDate();
//   const data = [
//     {
//       title: 'TRANSPARENCY',
//       managerScore: 7,
//       yourScore: 10,
//     },
//     {
//       title: 'AGILITY',
//       managerScore: 7,
//       yourScore: 10,
//     },
//     {
//       title: 'ADAPTABILITY',
//       managerScore: 7,
//       yourScore: 10,
//     },
//     {
//       title: 'COMMUNICATION',
//       managerScore: 7,
//       yourScore: 10,
//     },
//   ];

//   const calculateScores = data => {
//     const vs =
//       data.reduce((acc, item) => acc + item.yourScore, 0) / data.length;
//     const vsr =
//       data.reduce((acc, item) => acc + item.managerScore, 0) / data.length;
//     return {vs: vs.toFixed(2), vsr: vsr.toFixed(2)};
//   };

//   const getDeviationCategory = (vs, vsr) => {
//     const deviation = Math.abs(vs - vsr);
//     if (deviation <= 1) {
//       return 'Excellent';
//     } else if (deviation <= 2) {
//       return 'Acceptable';
//     } else if (deviation <= 3) {
//       return 'Needs Attention';
//     } else {
//       return 'Alarming';
//     }
//   };

//   const {vs, vsr} = calculateScores(data);
//   const deviationCategory = getDeviationCategory(vs, vsr);
  
//   return (
//     <View style={{flex: 1}}>
//       <Header />
//       <TouchableOpacity
//         style={styles.dropdownButton}
//         onPress={() => setDropdownOpen(true)}
//         disabled={true}>
//         <Text style={styles.dropdownText}>{selectedValue}</Text>
//       </TouchableOpacity>
//       <MultiColumnDropdown
//         open={dropdownOpen}
//         setOpen={setDropdownOpen}
//         value={selectedValue}
//         setValue={setSelectedValue}
//       />
//       <FlatList
//         data={data}
//         renderItem={({item}) => (
//           <ValuesCompletedCard
//             title={item.title}
//             managerScore={item.managerScore}
//             yourScore={item.yourScore}
//           />
//         )}
//         keyExtractor={item => item.title}
//       />
//       <View style={styles.scoresContainer}>
//         <Text style={styles.scoreText}>Your Value Score (VS): {vs}</Text>
//         <Text style={styles.scoreText}>Manager Value Score (VSR): {vsr}</Text>
//         <Text style={styles.scoreText}>Deviation: {deviationCategory}</Text>
//       </View>
//     </View>
//   )
// }

// export default Growth

// const styles = StyleSheet.create({
//   dropdownButton: {
//     padding: 10,
//     backgroundColor: '#fff',
//     width: 330,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   dropdownText: {
//     fontSize: 18,
//     color: '#828282',
//   },
//   scoresContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   scoreText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color:"#000000"
//   },
//   // deviationText: {
//   //   fontSize: 18,
//   //   color: deviationCategory  === 'Excellent' ? 'green' : deviationCategory === 'Acceptable' ? 'orange' : 'red',
//   // },
// })
import React from 'react'

function Growth() {
  return (
    <div>Growth</div>
  )
}

export default Growth