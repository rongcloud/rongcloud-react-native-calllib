import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  findNodeHandle,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView
} from 'react-native'
import Slider from '@react-native-community/slider'
import {
  RCReactNativeCallVideoView,
  startSingleCall,
  startGroupCall,
  enableSpeaker,
  setVideoView,
  enableMicrophone,
  hangup,
  accept,
  changeMediaType,
  switchCamera,
  currentCamera,
  enableCamera,
  getCurrentCallSession,
  inviteUsers,

  onCallConnected,
  onCallDisconnected,
  onRemoteUserJoined,
  onRemoteUserLeft,
  onEnableCamera,
  onSwitchCamera,
  onError,
  onCallOutgoing,
  onRemoteUserRinging,
  onRemoteUserInvited,
  onRemoteUserMediaTypeChanged,
  onRemoteUserMicrophoneStateChanged,
  onNetworkQuality,
  onAudioVolume,

  removeCallConnectedListener,
  removeCallDisconnectedListener,
  removeRemoteUserJoinedListener,
  removeRemoteUserLeftListener,
  removeEnableCameraListener,
  removeSwitchCameraListener,
  removeErrorListener,
  removeCallOutgoingListener,
  removeRemoteUserRingingListener,
  removeRemoteUserInvited,
  removeRemoteUserMediaTypeChangedListener,
  removeRemoteUserDidChangeMicrophoneStateListener,
  removeRemoteUserCameraStateChangedListener,
  removeNetworkQualityListener,
  removeAudioVolumeListener,

  setBeautyFilter,
  getCurrentBeautyOption,
  getCurrentBeautyFilter,
  setBeautyOption,
  resetBeauty

} from '@rongcloud/react-native-calllib'

import { CallState, MediaType, Reason } from './defines'

class ItemButton extends Component {
  constructor (props) {
    super(props)
    this.style = props.style || {}
    this.state = {
      isSelected: props.selected || false
    }
  }

  handleClick () {
    const isSelected = !this.state.isSelected
    this.setState({
      isSelected
    })
    this.props.onclick(isSelected)
  }

  render () {
    var imageSource = null
    if (this.props.selectedImage) {
      imageSource = this.state.isSelected ? this.props.selectedImage : this.props.image
    } else {
      imageSource = this.props.image
    }
    return (
      <View style={this.style}>
        <TouchableOpacity style={styles.itemButton} onPress={this.handleClick.bind(this)}>
          <Image style={styles.btnButton} source={imageSource} />
          <Text style={styles.itemTitle}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Room extends Component {
  constructor (props) {
    super(props)
    // 是否已接通
    this.isCallConnected = false
    this.viewInfo = {
      largeViewInfo: {
        userId: 0,
        viewId: null
      },
      smallViewInfo: []
    }

    let callState = null
    let mediaType = null

    // 0 为单聊  1为群聊
    let callType = 0

    // 如果没有callSession表示呼出的场景
    if (!props.route.params.options.callSession) {
      callState = CallState.callout
      mediaType = props.route.params.options.mediaType
      if (props.route.params.options.userIds.length > 1) {
        callType = 1
      }
    } else {
      callState = CallState.callin
      mediaType = props.route.params.options.callSession.mediaType
      callType = props.route.params.options.callSession.callType
    }

    const beautyList = this.getBeautyDefaultData()
    this.state = {
      showMenus: true,
      mediaType,
      callState,
      config: {
        mute: false,
        handFree: true,
        disableCamera: false
      },

      // [{userId,tag}]
      smallUserIds: [],
      largeViewUserId: null,
      largeViewUserTag: 0,
      callType,

      // 是否显示邀请的输入框
      isShowInvite: false,

      inviteUserTxt: '',

      // 是否显业设置滤镜
      isShowBeauty: false,

      // 是否打开了美颜
      isOpenedBeauty: false,

      beautyList
    }
  }

  getBeautyDefaultData () {
    // {"brightLevel":5,"smoothLevel":0,"ruddyLevel":0,"whitenessLevel":0}
    return [
      {
        name: 'filter',
        txt: '滤镜',
        selected: false,
        child: [
          {
            txt: '原画',
            value: 0,
            selected: false
          },
          {
            txt: '唯美',
            value: 1,
            selected: false
          },
          {
            txt: '清新',
            value: 2,
            selected: false
          },
          {
            txt: '浪漫',
            value: 3,
            selected: false
          }
        ]
      },
      {
        name: 'whitenessLevel',
        txt: '美白',
        value: 0,
        selected: false
      },
      {
        name: 'ruddyLevel',
        txt: '红润',
        value: 0,
        selected: false
      },
      {
        name: 'smoothLevel',
        txt: '磨皮',
        value: 0,
        selected: false
      },
      {
        name: 'brightLevel',
        txt: '亮度',
        value: 5,
        selected: false
      }
    ]
  }

  componentDidUpdate (prevProps) {
  }

  async componentDidMount () {
    // 添加通话监听
    this.addListener()

    if (this.state.callState === CallState.callout) {
      try {
        this.startCall(this.props.route.params.options)
      } catch (e) {
        alert(e.message)
      }
    }
  }

  componentWillUnmount () {
    // 移除通话监听
    this.removeListener()
  }

  /**
   * 执行呼叫
   */
  async startCall (options) {
    const userIds = options.userIds
    if (userIds.length === 0) {
      return
    }
    console.log(`[startCall] userIds -> ${JSON.stringify(userIds)}  mediaType -> ${this.state.mediaType}`)
    let callSession

    // 如果是群聊
    if (this.state.callType === 1) {
      const groupId = options.groupId
      callSession = await startGroupCall(groupId, userIds, null, this.state.mediaType, '')
    } else {
      callSession = await startSingleCall(userIds[0], this.state.mediaType, '')
    }

    // 接通之前大视图的user,设置成当前用户
    this.viewInfo.largeViewInfo.userId = callSession.mine.userId
    this.setViews()
  }

  /**
   * 当主动呼叫或来电后设置视图
   */
  setViews () {
    if (this.viewInfo.largeViewInfo.userId && this.viewInfo.largeViewInfo.viewId) {
      setVideoView(this.viewInfo.largeViewInfo.userId, this.viewInfo.largeViewInfo.viewId, 0, false)
    }
    this.viewInfo.smallViewInfo.forEach((value) => {
      setVideoView(value.userId, value.viewId, 0, true)
    })
  }

  /**
   * 回退到上一页面
   */
  goBack () {
    this.props.navigation.goBack()
  }

  /**
   * 静音
   */
  handleMute (isSelected) {
    this.state.config.mute = isSelected

    // 调用 RN sdk 的方法
    enableMicrophone(!isSelected)
  }

  /**
   * 挂断
   */
  handleHangup () {
    console.log('hangup')

    // 调用 RN sdk 的方法
    hangup()

    // 挂断后主动回退页面
    // this.goBack();
  }

  /**
   * 免提
   */
  handleHandFree (isSelected) {
    this.state.config.handFree = isSelected

    console.log('enableSpeaker')

    // 调用 RN sdk 的方法
    enableSpeaker(isSelected)
  }

  /**
   * 接听
   */
  handleAccept () {
    console.log('accept')

    // 调用 RN sdk 的方法
    accept()

    // 调用 RN sdk 的方法
    enableSpeaker(this.state.config.handFree)
  }

  /**
   * 邀请
   */
  handleInvite () {
    // inviteUsers()
    this.setState({ isShowInvite: true })
  }

  /**
   * 取消邀请
   */
  handleCancelInvite () {
    this.setState({ isShowInvite: false })
  }

  /**
   * 确定邀请
   */
  handleConfimInvite () {
    console.log('confrim ' + this.state.inviteUserTxt)
    const userIds = this.state.inviteUserTxt.split(',')

    inviteUsers(userIds, [])
    this.setState({ isShowInvite: false })
  }

  /**
   * 改变邀请的userId的txt
   */
  handleChangeInviteUser (txt) {
    this.state.inviteUserTxt = txt
  }

  /**
   * 降为音频通话
   */
  handleChangeMediaType () {
    console.log('changeMediaType')

    // 关闭美颜
    this.setState({ isShowBeauty: false })

    // 调用 RN sdk 的方法
    changeMediaType(MediaType.audio)

    this.setAudioView()

    // 开启免提
    enableSpeaker(this.state.config.handFree)
  }

  setAudioView () {
    const largeViewUserTag = this.state.largeViewUserTag + 1
    const smallUserIds = this.state.smallUserIds.map(user => {
      return { ...user, tag: user.tag + 1 }
    })
    this.setState({
      largeViewUserTag,
      smallUserIds,
      mediaType: MediaType.audio
    })
  }

  /**
   * 切换摄像头
   */
  handleSwitchCamera () {
    console.log('switchCamera')

    // 调用 RN sdk 的方法
    switchCamera()
  }

  /**
   * 开启、关闭摄像头
   */
  async handleDisableCamera (isSelected) {
    this.state.config.disableCamera = isSelected

    console.log('currentCamera')

    // 调用 RN sdk 的方法
    const camera = await currentCamera()

    // 调用 RN sdk 的方法
    enableCamera(!isSelected, camera)
  }

  /**
   * 打开并设置美颜
   */
  setBeauty (bool = true) {
    const beautyValues = {}
    this.state.beautyList.forEach(item => {
      if (item.name !== 'filter') {
        beautyValues[item.name] = item.value
      }
    })

    // 先根据上次的设置打开美颜，如果没置过，取预设的默认值
    setBeautyOption(bool, beautyValues)
  }

  /**
   * 设置滤镜
   */
  setFilter () {
    const beauty = this.state.beautyList.find(item => item.name === 'filter')
    const filter = beauty.child.find(item => item.selected)
    filter && setBeautyFilter(filter.value)
  }

  handleShowBeauty () {
    const isShowBeauty = !this.state.isShowBeauty
    this.setState({ isShowBeauty })
  }

  /**
   * 打开美颜、关闭美颜
   */
  handleOpenBeauty () {
    const isOpenedBeauty = !this.state.isOpenedBeauty
    this.setState({ isOpenedBeauty })
    if (isOpenedBeauty) {
      // 返回filter的数据，是选中的
      const beautyList = this.getFitstSelectedFilterData()
      this.setState({ beautyList })

      // 打开并设置美颜
      this.setBeauty(true)
      this.setFilter()
    } else {
      this.resetBeauty()
      this.setState({ beautyList: this.getBeautyDefaultData() })
      this.setBeauty(false)
    }
  }

  /**
   * 返回filter的数据，是选中的
   */
  getFitstSelectedFilterData () {
    const beautyList = this.state.beautyList.map(item => {
      if (item.name === 'filter') {
        item.child.forEach(obj => {
          obj.selected = (obj.value === 0)
        })
        return { ...item, selected: true }
      } else {
        const value = (item.name === 'brightLevel') ? 5 : 0
        return { ...item, selected: false, value }
      }
    })
    return beautyList
  }

  /**
   * 选择美颜
   * @param name 美颜的英文标识
   */
  handleSelectBeauty (name) {
    const beautyList = this.state.beautyList.map(item => {
      item.selected = (item.name === name)
      return item
    })
    this.setState({ beautyList }, () => {
      // 打开并设置美颜
      this.setBeauty()
    })
  }

  /**
   * 选择滤镜
   * @param value 滤镜的枚举
   */
  handleSelectFilter (value) {
    this.state.beautyList[0].child = this.state.beautyList[0].child.map(item => {
      item.selected = (item.value === value)
      return item
    })
    this.setState({ beautyList: [...this.state.beautyList] }, () => {
      this.setFilter()
    })
  }

  /**
   * 重置美颜
   */
  resetBeauty () {
    // 返回filter的数据，是选中的
    const beautyList = this.getFitstSelectedFilterData()
    this.setState({ beautyList }, () => {
      // 重置美颜
      resetBeauty()
    })
  }

  /**
   * 设置通话中的视图
   */
  async setConversationView () {
    try {
      // 获得当前通知的session
      const callSession = await getCurrentCallSession()

      if (!callSession) {
        return
      }

      // mine表示当前用户信息，mine.userId表示当前用户的userId
      const mineId = callSession.mine.userId

      // 当前用户归为小视图
      const smallUserIds = [{ userId: mineId, tag: mineId }]

      // 此处标记当前还未设置大视图
      let isHasBigView = false

      // 遍历当前通话的全部用户列表
      callSession.users.forEach((user) => {
        console.log(`callSession userId -> ${user.userId}`)
        // 如果不是当前用户(当前用户不处理)
        if (user.userId !== mineId) {
          // 如果还未设置大视图
          if (!isHasBigView) {
            // 排除当前用户后，赶上的第一个userId采用大视图
            this.viewInfo.largeViewInfo.userId = user.userId

            // 大视图userId已设置后，标记为已设置
            isHasBigView = true
          } else {
            // 如果已设置过大视图，其余的userId都归为小视图列表
            smallUserIds.push({ userId: user.userId, tag: user.userId })
          }
        }
      })

      console.log('callSession.mediaType ->' + callSession.mediaType)

      this.setState({
        largeViewUserId: this.viewInfo.largeViewInfo.userId,
        largeViewUserTag: this.viewInfo.largeViewInfo.userId,
        smallUserIds,
        callState: CallState.call,
        mediaType: callSession.mediaType
      }, () => {
        setTimeout(() => {
          this.setViews()
        }, 200)
      })
    } catch (e) {
      alert(e)
    }
  }

  /**
   * 监听到通话已结束时执行的方法
   * @param reason 通话结束的原因
   */
  callDisconnectListener (reason) {
    this.resetBeauty()
    this.setState({ beautyList: this.getBeautyDefaultData() })
    this.setBeauty(false)

    console.log('reason = ' + reason)
    this.isCallConnected = false

    alert(Reason[reason])

    this.goBack()
  }

  /**
   * 添加监听
   */
  addListener () {
    // 调用 RN sdk 的方法 监听——通话已接通
    onCallConnected(() => {
      console.log('callConnectListener')
      this.isCallConnected = true

      // 开启免提
      enableSpeaker(this.state.config.handFree)
    })

    // 调用 RN sdk 的方法 监听——通话已结
    onCallDisconnected(this.callDisconnectListener.bind(this))

    // 对端用户加入了通话
    onRemoteUserJoined((user) => {
      // 已接通的情况下
      if (this.isCallConnected) {
        // 设置通话中的视图
        this.setConversationView()
      }
    })

    // 对端用户挂断
    onRemoteUserLeft((user, reason) => {
      // 已接通的情况下
      if (this.isCallConnected) {
        // 设置通话中的视图
        this.setConversationView()
      }
    })

    // 开启关闭摄像头
    onEnableCamera((camera) => {
      // console.log(`[demo onEnableCamera] camera -> ${camera}`)
    })

    // 切换摄像头回调
    onSwitchCamera((camera) => {
      // console.log(`[demo onSwitchCamera] camera -> ${camera}`)
    })
    // 通话出现错误的回调
    onError((code) => {
      // console.log(`addErrorListener code->${code}`)
    })

    // 开始呼叫通话的回调
    onCallOutgoing(() => {
      // console.log('onCallOutgoing')
    })

    // 对端用户正在振铃
    onRemoteUserRinging((userId) => {
    })

    // 有用户被邀请加入通话
    onRemoteUserInvited((userId, mediaType) => {
    })

    // 对端用户切换了媒体类型
    onRemoteUserMediaTypeChanged((userId, mediaType) => {
      // 设置通话中的视图
      this.setAudioView()
    })
    // 对端用户开启或关闭了麦克风的状态
    onRemoteUserMicrophoneStateChanged((userId, enable) => {
    })

    // 对端用户开启或关闭了摄像头的状态
    onRemoteUserMicrophoneStateChanged((userId, enable) => {
    })

    // // 当前通话网络状态的回调，该回调方法每秒触发一次
    // onNetworkQuality((userId, quality) => {
    //   // console.log(`[demo onNetworkQuality] userId->${userId} quality->${quality}`)
    // })

    // // 当前通话某用户声音音量回调
    // onAudioVolume((userId, volume) => {
    //   // console.log(`[demo onAudioVolume] userId->${userId} volume->${volume}`)
    // })
  }

  /**
   * 移除监听
   */
  removeListener () {
    // 调用 RN sdk 的方法 移除监听——通话已接通
    removeCallConnectedListener()

    // 调用 RN sdk 的方法 移除监听——通话已结束
    removeCallDisconnectedListener()

    // 移除监听——对端用户加入了通话
    removeRemoteUserJoinedListener()

    // 移除监听——对端用户挂断
    removeRemoteUserLeftListener()

    // 移除监听——开启关闭摄像头
    removeEnableCameraListener()

    // 移除监听——切换摄像头回调
    removeSwitchCameraListener()

    // 移除监听——通话出现错误的回调
    removeErrorListener()

    // 移除监听——开始呼叫通话的回调
    removeCallOutgoingListener()

    // 移除监听——对端用户正在振铃
    removeRemoteUserRingingListener()

    // 移除监听——有用户被邀请加入通话
    removeRemoteUserInvited()

    // 移除监听——对端用户切换了媒体类型
    removeRemoteUserMediaTypeChangedListener()

    // 移除监听——对端用户开启或关闭了麦克风的状态
    removeRemoteUserDidChangeMicrophoneStateListener()

    // 移除监听——对端用户开启或关闭了摄像头的状态
    removeRemoteUserCameraStateChangedListener()
    // removeNetworkQualityListener()
    // removeAudioVolumeListener()
  }

  bottomView () {
    if (this.state.callState === CallState.callin) {
      return (
        <View style={[styles.bottomView, { justifyContent: 'space-around' }]}>
          <ItemButton
            title="挂断"
            image={require('./images/hang_up.png')}
            onclick={this.handleHangup.bind(this)}
          />
          <ItemButton
            title="接听"
            image={this.state.mediaType === MediaType.video ? require('./images/answervideo.png') : require('./images/answer.png')}
            onclick={this.handleAccept.bind(this)}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.bottomView}>

          <ItemButton
            title="静音"
            selected={this.state.config.mute}
            image={require('./images/mute.png')}
            selectedImage={require('./images/mute_hover.png')}
            onclick={this.handleMute.bind(this)}
          />
          <ItemButton
            title="挂断"
            image={require('./images/hang_up.png')}
            onclick={this.handleHangup.bind(this)}
          />
          <View>
            {this.state.callType === 1 && <View>
              <ItemButton
                style={{ marginBottom: 25 }}
                title="邀请"
                image={require('./images/add.png')}
                onclick={this.handleInvite.bind(this)}
              />
            </View>}
            {this.state.mediaType === MediaType.video && (
              <View>
                {this.isCallConnected &&
                  <ItemButton
                    style={{ marginBottom: 25 }}
                    title="音频通话"
                    image={require('./images/audio.png')}
                    onclick={this.handleChangeMediaType.bind(this)}
                  />
                }
                <ItemButton
                  style={{ marginBottom: 25 }}
                  title="切换像机"
                  image={require('./images/camera.png')}
                  onclick={this.handleSwitchCamera.bind(this)}
                />
                <ItemButton
                  style={{ marginBottom: 25 }}
                  title="摄像头"
                  selected={this.state.config.disableCamera}
                  image={require('./images/video.png')}
                  selectedImage={require('./images/video_hover.png')}
                  onclick={this.handleDisableCamera.bind(this)}
                />
                <ItemButton
                  style={{ marginBottom: 25 }}
                  title="美颜"
                  selected={this.state.config.disableCamera}
                  image={require('./images/beauty.png')}
                  selectedImage={require('./images/beauty-hover.png')}
                  onclick={this.handleShowBeauty.bind(this)}
                />
              </View>
            )}
            <ItemButton
              title="免提"
              selected={this.state.config.handFree}
              image={require('./images/handfree.png')}
              selectedImage={require('./images/handfree_hover.png')}
              onclick={this.handleHandFree.bind(this)}
            />
          </View>
        </View>
      )
    }
  }

  smallVideoViews () {
    const smallUserIds = this.state.smallUserIds

    this.viewInfo.smallViewInfo = []
    return (
      <View>
        {smallUserIds.map((user) => {
          return (
            <View style={styles.smallVideo} key={user.tag}>
              <RCReactNativeCallVideoView
                key={user.tag}
                style={{ width: '100%', height: '100%' }}
                ref={(ref) => {
                  findNodeHandle(ref) && this.viewInfo.smallViewInfo.push({
                    viewId: findNodeHandle(ref),
                    userId: user.userId
                  })
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }

  render () {
    const smallUserIds = this.state.smallUserIds
    const selectedBeauty = this.state.beautyList.find(obj => obj.selected)
    return (
      <View style={styles.container}>
        <View style={styles.bigVideo}>
          <RCReactNativeCallVideoView
            key={this.state.largeViewUserTag}
            style={{ width: '100%', height: '100%' }}
            ref={(ref) => {
              this.viewInfo.largeViewInfo.viewId = findNodeHandle(ref)
            }}
          ></RCReactNativeCallVideoView>
        </View>
        <View style={styles.content}>
          <SafeAreaView style={{ flex: 1 }}>

            {this.state.isShowInvite && <View style={styles.inviteArea}>
              <TextInput
                onChangeText={this.handleChangeInviteUser.bind(this)}
                placeholder={'请输用户ID，多个用英文逗号隔开'}
              />
              <View style={styles.inviteOperation}>
                <View style={styles.inviteAreaButtonCancel}>
                  <TouchableOpacity onPress={this.handleCancelInvite.bind(this)}>
                    <Text style={styles.inviteAreaButtonText}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inviteAreaButtonConfim}>
                  <TouchableOpacity onPress={this.handleConfimInvite.bind(this)}>
                    <Text style={styles.inviteAreaButtonText}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>}

            {this.state.isShowBeauty && <View style={styles.beauty}>
              <View style={styles.beautyButtons}>
                {this.state.isOpenedBeauty && <View style={styles.beautyOperateReset}>
                  <TouchableOpacity onPress={this.resetBeauty.bind(this)}>
                    <Text style={styles.beautyBtnText}>重置</Text>
                  </TouchableOpacity>
                </View>}
                <View style={styles.beautyOperateOpen}>
                  <TouchableOpacity onPress={this.handleOpenBeauty.bind(this)}>
                    <Text style={styles.beautyBtnText}>{this.state.isOpenedBeauty ? '关闭美颜' : '开启美颜'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {selectedBeauty && <View style={styles.beautyButtons}>
                {(selectedBeauty.name === 'filter') ? selectedBeauty.child.map(item => {
                  return (<View style={item.selected ? styles.beautyBtnSelected : styles.beautyBtn}>
                    <TouchableOpacity key={item.value} onPress={this.handleSelectFilter.bind(this, item.value)}>
                      <Text style={styles.beautyBtnText}>{item.txt}</Text>
                    </TouchableOpacity>
                  </View>)
                }) : <Slider
                  key={selectedBeauty.name}
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={9}
                  minimumTrackTintColor="#003333"
                  maximumTrackTintColor="#000000"
                  value={selectedBeauty.value}
                  onValueChange={(value) => {
                    selectedBeauty.value = value
                    this.setBeauty()
                  }}
                />}
              </View>}

              {this.state.isOpenedBeauty && 
              <View style={styles.beautyButtons}>
                {this.state.beautyList.map((item) => {
                  return (<View style={item.selected ? styles.beautyBtnSelected : styles.beautyBtn}>
                    <TouchableOpacity key={item.name} onPress={this.handleSelectBeauty.bind(this, item.name)}>
                      <Text style={styles.beautyBtnText}>{item.txt}</Text>
                    </TouchableOpacity>
                  </View>)
                })}
              </View>
              }

            </View>}

            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ showMenus: !this.state.showMenus })
                }}
              >
                <View style={styles.topView}>
                  {this.state.showMenus ? this.bottomView() : null}
                </View>
              </TouchableWithoutFeedback>
              <View pointerEvents="box-none" style={styles.videosView}>
                <View pointerEvents="box-none" style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {this.state.largeViewUserId === null ? '' : 'UserID: ' + this.state.largeViewUserId}
                  </Text>
                </View>
                <ScrollView
                  bounces={smallUserIds.length > 3}
                  showsVerticalScrollIndicator={false}
                  style={styles.videoScrollview}
                >
                  {this.smallVideoViews()}
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bigVideo: {
    backgroundColor: '#000',
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  content: {
    height: '100%',
    width: '100%'
  },
  videosView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10
  },
  videoScrollview: {
    width: 110,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 170
  },
  topView: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    zIndex: 1
  },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20
  },
  itemButton: {
    alignItems: 'center'
  },
  btnButton: {
    width: 65,
    height: 65
  },
  itemTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  smallVideo: {
    backgroundColor: 'black',
    width: 110,
    aspectRatio: 0.7,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#aaaaaa',
    overflow: 'hidden'
  },

  inviteArea: {
    top: 0,
    width: '100%',
    zIndex: 50,
    backgroundColor: '#ffffff',
    padding: 10
  },
  inviteOperation: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row'
  },
  inviteAreaButtonCancel: {
    flex: 1,
    backgroundColor: '#d0d2d5',
    borderRadius: 5,
    marginRight: 10
  },
  inviteAreaButtonConfim: {
    flex: 1,
    backgroundColor: '#1989fa',
    borderRadius: 5,
    marginLeft: 10
  },

  inviteAreaButtonText: {
    textAlign: 'center',
    lineHeight: 42,
    color: '#ffffff'
  },

  beauty: {
    top: 0,
    width: '100%',
    zIndex: 50,
    backgroundColor: '#ffffff',
    padding: 10
  },

  beautyButtons: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row'
  },

  beautyOperateReset: {
    flex: 1,
    backgroundColor: '#1989fa',
    borderRadius: 5,
    marginLeft: 5
  },

  beautyOperateOpen: {
    flex: 1,
    backgroundColor: '#1989fa',
    borderRadius: 5,
    marginLeft: 5
  },

  beautyBtnSelected: {
    flex: 1,
    backgroundColor: '#1989fa',
    borderRadius: 5,
    marginLeft: 10
  },

  beautyBtn: {
    flex: 1,
    backgroundColor: '#d0d2d5',
    borderRadius: 5,
    marginLeft: 10
  },

  beautyBtnText: {
    textAlign: 'center',
    lineHeight: 42,
    color: '#ffffff'
  }

})

export default Room
