import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import styles from "../styles/CharacterSelectStyles.js";
import LottieView from "lottie-react-native";
import Images from "../assets/Images";
import { Render } from "matter-js";

class CharacterSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unlockedCharacters: [],
      unlockedLevels: [],
      keys: 0,
    };
  }

  userID = this.props.route.params.user.id;

  componentDidMount() {
    fetch(`http://localhost:3000/api/v1/users/${this.userID}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((user) => {
        this.setState((state) => ({
          unlockedCharacters: user.unlocked_characters,
          unlockedLevels: user.unlocked_levels,
          keys: user.keys,
        }));
      });
  }

  selectionHandler = (name) => {
    if (this.state.unlockedCharacters.includes(name)) {
      this.props.navigation.push("Map", {
        user: this.props.route.params.user,
        character: name,
        unlockedLevels: this.state.unlockedLevels,
      });
    } else if (
      !this.state.unlockedCharacters.includes(name) &&
      this.state.keys > 0
    ) {
      fetch(`http://localhost:3000/api/v1/users/${this.userID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          unlocked_characters: [...this.state.unlockedCharacters, name],
          keys: this.state.keys - 1,
        }),
      });
      this.setState((state) => ({
        keys: state.keys - 1,
        unlockedCharacters: [...state.unlockedCharacters, name],
      }));
    } else {
      alert(
        name +
          " is trapped! Find a key to unlock " +
          (name === "Ariana" || name === "Loquacious" ? "her." : "him.")
      );
    }
  };

  renderCharacterImage = (name) => {
    return (
      <TouchableOpacity
        style={styles.characterBox}
        onPress={() => this.selectionHandler(name)}
        activeOpacity={0.6}
      >
        <Image
          style={
            this.state.unlockedCharacters.includes(name)
              ? styles.photo
              : [styles.photo, styles.lockedCharacter]
          }
          source={Images[name.split(" ").join("_").toLowerCase()]}
          resizeMode="contain"
        />
        <Text style={styles.characterName}>{name}</Text>
        {!this.state.unlockedCharacters.includes(name) && this.renderLock()}
      </TouchableOpacity>
    );
  };

  renderLock = () => {
    console.log(this.state.keys);
    if (this.state.keys === 0) {
      return (
        <LottieView
          style={styles.lock}
          source={require("../assets/img/animations/lock.json")}
          resizeMode="contain"
        />
      );
    } else if (this.state.keys > 0) {
      return (
        <LottieView
          style={styles.lock}
          source={require("../assets/img/animations/lock.json")}
          autoPlay
          resizeMode="contain"
        />
      );
    }
  };

  render() {
    return (
      <View style={styles.CharacterSelectView}>
        <Text style={styles.heading}>SELECT A SWIMMER</Text>
        <View style={styles.boxes}>
          {this.renderCharacterImage("Nemo")}
          {this.renderCharacterImage("Ignatius")}
          {this.renderCharacterImage("Tummy Rub")}
          {this.renderCharacterImage("Ariana")}
          {this.renderCharacterImage("Loquacious")}
          {this.renderCharacterImage("Garrett")}
          {this.renderCharacterImage("Doug")}
          {this.renderCharacterImage("Roger Stan Smith")}
        </View>
        <View style={styles.keyInfoContainer}>
          <View style={styles.keyBox}>
            <View style={styles.keyContainer}>
              <Image
                style={styles.key}
                source={Images.key}
                resizeMode="contain"
              />
              <Text style={styles.keyText}>x{this.state.keys}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default CharacterSelect;