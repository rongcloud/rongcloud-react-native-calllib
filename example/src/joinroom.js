import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  FlatList,
  Switch
} from 'react-native'

import { disconnect } from '@rongcloud/react-native-imlib'
import {
  init,
  setEngineConfig,
  setPushConfig,
  setAudioConfig,
  setVideoConfig,
  unInit,
  onCallReceived,
  removeCallReceivedListener
} from '@rongcloud/react-native-calllib'
import { MediaType } from './defines'

class UserCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  render () {
    return (
      <View style={styles.cardContainer}>
        <TextInput
          style={styles.cardInput}
          defaultValue={this.state.value}
          onChangeText={(txt) => this.props.onChangeText(txt, this.props.index)}
          placeholder={'请输入对方ID'}
        />
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => this.props.onDelete(this.props.index)}
        >
          <Image style={styles.headerImg} source={require('./images/delete.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

class JoinRoom extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userIds: [{ key: 0, userId: '' }],
      isVideo: true,
      groupId: ''
    }
    this.keyCount = 1
  }

  /**
   * 隐藏键盘
   */
  dismissKeyboard () {
    Keyboard.dismiss()
  }

  /**
   * 点左上角回退按钮
   */
  async handleGoBack () {
    disconnect()
    this.props.navigation.goBack()
  }

  /**
   * 添加userId输入框
   */
  handleAddUser () {
    const userIds = this.state.userIds
    userIds.push({ key: this.keyCount, userId: '' })
    this.setState({
      userIds
    })
    this.keyCount++
  }

  /**
   * 点击‘开始单聊、群聊’
   */
  handleJoinRoon () {
    const userIds = this.state.userIds
    if (!userIds.every(({ userId }) => userId.length > 0)) {
      alert('请输入对方ID')
      return
    }
    if (userIds.length > 1 && !this.state.groupId.trim().length) {
      alert('请输入组ID')
      return
    }

    this.handleGoToCallRoom(
      true
    )
  }

  /**
   * 跳转到加房间
   * @param isCallOut 是否为呼出场景
   * @param session callSession
   */
  handleGoToCallRoom (isCallOut, session) {
    const options = { isCallOut }
    if (isCallOut) {
      options.userIds = this.state.userIds.map(({ userId }) => userId)
      if (this.state.userIds.length > 1) {
        options.groupId = this.state.groupId
      }
      options.mediaType = this.state.isVideo ? MediaType.video : MediaType.audio
    } else {
      options.callSession = session
    }
    this.props.navigation.navigate('Room', { options })
  }

  handleCardChangeText (txt, idx) {
    const userIds = this.state.userIds.map((user, index) => {
      if (index === idx) {
        user.userId = txt
        return user
      }
      return user
    })

    this.setState({
      userIds
    })
  }

  handleChangeGroupId (txt) {
    this.setState({
      groupId: txt
    })
  }

  /**
   * 删除一个userId的输入框
   */
  handleCardDelete (idx) {
    this.dismissKeyboard()

    var userIds = this.state.userIds
    userIds.splice(idx, 1)
    this.setState({
      userIds
    })
  }

  componentDidMount () {
    // 初始化callLib
    init()
    console.log('init')

    /**
     * 监听呼入
     */
    onCallReceived((session) => {
      console.log('[ReceivedListener] CallReceived')
      this.handleGoToCallRoom(false, session)
    })

    setEngineConfig({

      statusReportInterval: 3000

    })

    setPushConfig({
      templateId: '111'
    })

    setAudioConfig({
      type: 1
    })

    // setVideoConfig({
    //   defaultCamera: 2
    // })
  }

  componentWillUnmount () {
    unInit()
    console.log('unInit')

    /**
     * 移除监听呼入
     */
    removeCallReceivedListener()
  }

  toggleSwitch () {
    this.setState({
      isVideo: !this.state.isVideo
    })
  }

  render () {
    const userIds = this.state.userIds
    const userCount = userIds.length

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerBtn} onPress={this.handleGoBack.bind(this)}>
                <Image style={styles.headerImg} source={require('./images/user.png')} />
              </TouchableOpacity>
              <Text style={styles.title}>UserID: {this.props.route.params.userId}</Text>
              <TouchableOpacity style={styles.headerBtn} onPress={this.handleAddUser.bind(this)}>
                <Image style={styles.headerImg} source={require('./images/add.png')} />
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
              data={userIds}
              renderItem={({ item, index }) => {
                return (
                  <UserCard
                    key={item.key}
                    index={index}
                    value={item.userId}
                    onChangeText={this.handleCardChangeText.bind(this)}
                    onDelete={this.handleCardDelete.bind(this)}
                  />
                )
              }}
            />

            {userIds.length > 1 && <View style={styles.cardContainer}>
              <TextInput
                style={styles.cardInput}
                defaultValue={this.state.value}
                onChangeText={this.handleChangeGroupId.bind(this)}
                placeholder={'请输入组ID'}
              />
            </View>
            }
            <View style={styles.switchView}>
              <Switch
                style={styles.switch}
                trackColor={{ false: '#cccccc', true: '#1DB7FF' }}
                thumbColor={'width'}
                ios_backgroundColor="#cccccc"
                onValueChange={this.toggleSwitch.bind(this)}
                value={this.state.isVideo}
              />
              <Text style={styles.switchText}>{this.state.isVideo ? '视频通话' : '语音通话'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.btn, { opacity: userCount > 0 ? 1 : 0.5 }]}
              onPress={this.handleJoinRoon.bind(this)}
              disabled={userCount === 0}
            >
              <Text style={styles.btnText}>{userCount > 1 ? '开始群聊' : '开始单聊'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    padding: 30,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerImg: {
    width: 24,
    height: 24
  },
  headerBtn: {
    width: 24,
    height: 24
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginRight: 10
  },
  flatList: {
    backgroundColor: '#F3F8F9',
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  switchView: {
    marginHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  switch: {
    marginVertical: 20
  },
  switchText: {
    fontSize: 17,
    marginLeft: 10
  },
  btn: {
    marginHorizontal: 30,
    marginBottom: 20,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DB7FF',
    borderRadius: 5,
    letterSpacing: 10
  },
  btnText: {
    position: 'absolute',
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    width: 100
  }
})

export default JoinRoom
