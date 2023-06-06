import React from "react";
import ProfileImage from './ProfileImage';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import colors from "../constants/colors";
import { Ionicons,AntDesign } from "@expo/vector-icons";

const imageSize = 40;

const DataItem = props =>{

	const { title,subTitle,image,type,isChecked,icon,date,day} = props;	

	const hideImage = props.hideImage && props.hideImage===true;
	
	let showDay;
	const itemContainer= {...styles.container,...styles.buttonContainer};

	if(type==='notice'){
		itemContainer.backgroundColor = "#deeded";
	  itemContainer.shadowRadius = 1;
		itemContainer.shadowOffset = {
      width: 0,
      height: 0
    };
		itemContainer.borderRadius = 15;
		itemContainer.margin = 5;
	}

	switch(day){
		case 0:
			showDay="Monday";
			break;
		case 1:
			showDay="Tuesday";
			break;
		case 2:
			showDay="Wednesday"
			break;
		case 3:
			showDay="Thursday"
			break;
		case 4:
			showDay="Friday"
			break;
		case 5:
			showDay="Saturday"
			break;
		case 6:
			showDay="Sunday"
			break;
	}
	

	return <TouchableWithoutFeedback onPress={props.onPress} >
		 <View style={itemContainer}>

				{
					type==="notice" &&<View>
			   	  <Text>{showDay}</Text>
					  <Text>{date}</Text>
					</View>
					
				}
		    {
					icon &&
					<View style={styles.leftIconContainer}>
						<AntDesign name={icon} size={20} color={colors.blue}/>
						</View>	
				}
				{
					!icon && !hideImage &&
		      <ProfileImage 
					 uri={image}
					 size={imageSize}/>
				}	
 				{
				<View style={styles.textContainer}>
			<Text
				style={{... styles.title,...{color:type==="button" ? colors.blue : colors.textColor}}}>
				{title}
			</Text>
			{
			subTitle &&
			<Text 
				style={styles.subTitle}>
				{subTitle}
			</Text>
			}
			</View> 
			}	
			{
					type ==="checkbox" &&
					<View style={{...styles.iconContainer,... isChecked && styles.checkedStyle}}>
						<Ionicons name="checkmark" size={18} color="white"/>
					</View>
				}
				{
					type ==="link" &&
					<View> 
						<Ionicons name="chevron-forward-outline" size={18} color={colors.grey}/>
					</View>
				}


		 </View>
	</TouchableWithoutFeedback>

}

const styles = StyleSheet.create({
	container:{
		flexDirection:'row',
		paddingVertical:7,
		borderBottomColor:colors.extraLightGreyd,
		borderBottomWidth:1,
		alignItems:'center',
		minHeight:50
	},
	textContainer:{
		marginLeft:14,
		flex:1
	},
	title:{
		fontFamily:'medium',
		fontSize:16,
		letterSpacing:0.3
	},
	subTitle:{ 
		fontFamily:'regular',
		color:colors.textColor,
		letterSpacing:0.3
	},
	iconContainer:{
		borderWidth:1,
		borderRadius:50,
		borderColor:colors.lightGrey,
		backgroundColor:'white'
	},
	checkedStyle:{
		backgroundColor:colors.primary,
		borderColor:'transparent'
	},
	leftIconContainer:{
		backgroundColor:colors.extraLightGrey,
		borderRadius:50,
		alignItems:'center',
		justifyContent:'center',
		width:imageSize,
		height:imageSize
	},
	buttonContainer:{
		backgroundColor:colors.darkYellow,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
		margin:10
}
});

export default DataItem;