import { StyleSheet,View} from "react-native";
import colors from "../constants/colors";

const PageContainer = props =>{
	return <View style={{...styles.container,...props.style}}>
		{props.children}
	</View>
}

const styles = StyleSheet.create({
	container:{
		paddingHorizontal:20,
		flex:1,
		backgroundColor:'white'
	}
})
export default PageContainer;