import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { init, disconnect, connect, setServerInfo } from '@rongcloud/react-native-imlib'
import sha1 from 'crypto-js/sha1'
import storage from './storage'
import config from './config'
const requestPermission = async () => {
  try {
    const grantedCamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: '请求摄像头许可'

      }
    )
    if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera')
    } else {
      console.log('Camera permission denied')
    }

    const grantedAudio = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: '请求录制音频许可'

      }
    )
    if (grantedAudio === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Audio')
    } else {
      console.log('Audio permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appKey: config.APP_KEY,
      secret: config.APP_SECRET,
      apiServer: config.apiServer,
      naviServer: config.naviServer,
      userId: '',
      isConnecting: false,

      // 最近一次连接记录的tag
      preRecordTag: 'js',

      // 连接的记录
      connectionRecord: []
    }
  }

  componentDidMount () {
    // 获得之前输入的连接用到的信息
    storage.getAllDataForKey('connectionRecord').then(data => {
      console.log('get Success')
      console.log(data)
      this.setState({ connectionRecord: data })
    }).catch(err => {
      console.log('get Error')
      // 如果没有找到数据且没有sync方法，
      // 或者有其他异常，则在catch中返回
      console.warn(err.message)
    })

    requestPermission()
  }

  setLoading (loading) {
    this.setState({ isConnecting: loading })
  }

  dismissKeyboard () {
    Keyboard.dismiss()
  }

  gotoJoinRoom (userId) {
    this.props.navigation.navigate('JoinRoom', { userId })
  }

  async handleConnect () {
    this.dismissKeyboard()

    // 设置navi
    if (this.state.naviServer) {
      console.log('[demo]' + this.state.naviServer)
      setServerInfo(this.state.naviServer, '')
    }

    // 初始化IM
    init(this.state.appKey)

    this.setLoading(true)

    disconnect()

    try {
      const token = await this.requestToken()
      connect(
        token,
        (userId) => {
          console.log(`IM连接成功 userId -> ${userId}`)

          // 边接成功输入的信息存储到本地
          storage.save({
            key: 'connectionRecord',
            id: this.state.userId,
            data: {
              tag: this.state.appKey + this.state.userId,
              appKey: this.state.appKey,
              secret: this.state.secret,
              apiServer: this.state.apiServer,
              naviServer: this.state.naviServer,
              userId: this.state.userId
            },

            // 如果不指定过期时间，则会使用defaultExpires参数
            // 如果设为null，则永不过期
            expires: null
          })
          this.gotoJoinRoom(userId)
        },
        (code) => {
          console.log(`连接失败  code -> ${code}`)
        },
        () => { console.log('token incorrect')}
      )
    } catch (e) {
      alert(e.toString())
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * 获得userId对应的token
   */
  async requestToken () {
    const response = await fetch(`${this.state.apiServer}/user/getToken.json`, {
      method: 'POST',
      headers: this.getRequestHeaders(),
      body: new Blob([`userId=${this.state.userId}&name=${this.state.userId}&portraitUri=(null)`])
    })
    if (!response.ok) {
      console.log(response);
      throw Error(response.status)
    }
    const json = await response.json()
    console.log(`userId -> ${this.state.userId} token -> ${json.token}`)
    return json.token
  }

  /**
   * 生成请求头
   */
  getRequestHeaders () {
    const nonce = Math.floor(Math.random() * 1000000000) + ''
    const timestamp = new Date().getTime() + ''
    const signature = sha1(this.state.secret + nonce + timestamp).toString()
    return {
      'App-Key': this.state.appKey,
      'RC-Nonce': nonce,
      'RC-Timestamp': timestamp,
      Signature: signature,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  handlePick (preRecordTag, itemIndex) {
    const selectedRecord = this.state.connectionRecord.find(item => item.tag === preRecordTag)

    if (!selectedRecord) {
      return
    }
    this.setState({
      preRecordTag,
      appKey: selectedRecord.appKey,
      secret: selectedRecord.secret,
      apiServer: selectedRecord.apiServer,
      naviServer: selectedRecord.naviServer,
      userId: selectedRecord.userId

    })
  }

  render () {
    const userId = this.state.userId
    var behavior = Platform.OS === 'ios' ? 'padding' : null
    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={behavior} enabled>
          <ScrollView>
            <Picker
              selectedValue={this.state.preRecordTag}
              onValueChange={this.handlePick.bind(this)}>

              {[...this.state.connectionRecord.map(item => {
                return (<Picker.Item key={item.tag} label={item.tag} value={item.tag} />)
              })]}
            </Picker>

            <View style={styles.container}>
              <Text style={styles.subTitle}>请输入appKey:</Text>
              <TextInput
                style={styles.input}
                value={this.state.appKey}
                onChangeText={(txt) => {
                  this.setState({ appKey: txt })
                }}
                keyboardType="default"
              />
              <Text style={styles.subTitle}>请输入appSecret:</Text>
              <TextInput
                style={styles.input}
                value={this.state.secret}
                onChangeText={(txt) => {
                  this.setState({ secret: txt })
                }}
                keyboardType="default"
              />
              <Text style={styles.subTitle}>请输入用户apiServer:</Text>
              <TextInput
                style={styles.input}
                value={this.state.apiServer}
                onChangeText={(txt) => {
                  this.setState({ apiServer: txt })
                }}
                keyboardType="default"
              />
              <Text style={styles.subTitle}>请输入用户naviServer:</Text>
              <TextInput
                style={styles.input}
                value={this.state.naviServer}
                onChangeText={(txt) => {
                  this.setState({ naviServer: txt })
                }}
                keyboardType="default"
              />
              <Text style={styles.subTitle}>请输入用户ID:</Text>
              <Text style={styles.description}>
                应用内唯一标识，重复的用户 Id 将被当作为同一用户，支持大小写英文字母、数字、部分特殊符号
                + = - _ 的组合方式，最大长度 64 字节。
              </Text>
              <TextInput
                style={styles.input}
                value={this.state.userId}
                onChangeText={(txt) => {
                  this.setState({ userId: txt })
                }}
                keyboardType="default"
              />
              <TouchableOpacity
                style={[styles.btn, { opacity: userId.length > 0 ? 1 : 0.5 }]}
                onPress={this.handleConnect.bind(this)}
                disabled={userId.length === 0}
              >
                <ActivityIndicator
                  style={styles.btnIndicator}
                  animating={this.state.isConnecting}
                  hidesWhenStopped={true}
                  color="white"
                />
                <Text style={styles.btnText}>连接 IM 服务</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
    backgroundColor: '#F3F8F9'
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 50
  },
  subTitle: {
    marginTop: 10,
    fontSize: 17
  },
  description: {
    fontSize: 13,
    color: 'gray',
    marginVertical: 15
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5
  },
  btn: {
    marginTop: 40,
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
  },
  btnIndicator: {
    position: 'relative',
    right: 60
  }
})

export default Home
