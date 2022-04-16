import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  constructor(){
      this.state = {
        image : null
      }
  }

  componentDidMount(){
    this.getPermission()
  }


  getPermission  = async()=> {
    if (Platform.OS !== "web"){
      
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      
      if( status !== "granted"){
        alert("Sorry , we need camera roll permission!!!")
      }
    }
  }

  
  uploadImage = async(uri) =>{
    const data = new FormData()

    let Filename = uri.split("/")[uri.split("/").length - 1]
    
    let Type = `image/${uri.split('.')[uri.split('.').length - 1]}`
  
    const fileToUplaod = {
      uri : uri,
      name : Filename,
      type : Type
    }

    data.aappend("digit" , fileToUplaod)

    fetch("http://6e8b-2405-201-10-2a82-bcf4-3ae8-424f-c68f.ngrok.io", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })

      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };

  pickImage = async() =>{
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes : ImagePicker.MediaTypeOptions.All,
        allowsEditing : true,
        aspect : [4,3],
        quality : 1

      })
      if(!result.canceled){
        this.setState({
          image : result.data
        })

        this.uploadImage(result.data)
      }
    }

    catch(E){
      console.log(E)
    }
  }

  render(){
    let {image} = this.state  
    return(
     <View style = {{ flex: 1, alignItems: "center", justifyContent: "center" }} >

        <Button 
          onPress ={this.pickImage}
          title="Pick an Image from Camera Roll"
        />

     </View>
    )

  }

}