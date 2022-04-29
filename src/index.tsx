import {
  NativeModules,
  requireNativeComponent,
  NativeEventEmitter,
  DeviceEventEmitter,
  Platform
} from 'react-native'

import {
  RCCallIWMediaType,
  RCCallIWCallType,
  RCCallIWCallDisconnectedReason,
  RCCallIWCamera,
  RCCallIWNetworkQuality,
  RCCallIWViewFitType,
  RCRNCallErrorCode,
  RCCallIWBeautyFilterType
} from './enum'

import {
  IRCCallIWEngineConfig,
  IRCCallIWUserProfile,
  IRCCallIWPushConfig,
  IRCCallIWAudioConfig,
  IRCCallIWVideoConfig,
  IRCCallIWCallSession,
  IRCCallIWBeautyOption
} from './interface'
import logger from './logger'

const LINKING_ERROR =
  `The package '@rongcloud/react-native-calllib' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const RCReactNativeCall = NativeModules.RCReactNativeCall
  ? NativeModules.RCReactNativeCall
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );
const RCReactNativeEventEmitter = Platform.OS === 'android' ? DeviceEventEmitter : new NativeEventEmitter(RCReactNativeCall)
const RCReactNativeCallVideoView = requireNativeComponent('RCReactNativeCallVideoView')

logger.log('已进入index.js')

/**
 * 初始化
 */
function init() {
  logger.log(`init Platform.OS->${Platform.OS}`)
  RCReactNativeCall.init({})
}

/**
 * 反初始化
 */
function unInit() {
  logger.log(`unInit Platform.OS->${Platform.OS}`)
  RCReactNativeCall.unInit()
}

/**
 * 引擎配置 android平台的参数根据 https://www.rongcloud.cn/docs/api/android/calllib_v5/io/rong/calllib/RongCallClient.html#getInstance-- 的setRTCConfig(cn.rongcloud.rtc.api.RCRTCConfig.Builder builder) 转https://www.rongcloud.cn/docs/api/android/rtclib_v5/
 * @param {IRCCallIWEngineConfig} config
 */
function setEngineConfig(config: IRCCallIWEngineConfig) {
  logger.log(`setEngineConfig config->${config} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.setEngineConfig(config)
}

/**
 * 推送配置
 * @param {IRCCallIWPushConfig} callPushConfig
 * @param {IRCCallIWPushConfig} hangupPushConfig
 * @param enableApplePushKit 设置是否使用苹果 PushKit 推送， true 使用,  false 不使用 , 默认关闭
 */
function setPushConfig(callPushConfig: IRCCallIWPushConfig = {}, hangupPushConfig: IRCCallIWPushConfig = {}, enableApplePushKit = false) {
  logger.log(`setPushConfig callPushConfig->${callPushConfig} hangupPushConfig->${hangupPushConfig} enableApplePushKit->${enableApplePushKit} Platform.OS->${Platform.OS}`)
  const params = Platform.OS === 'android' ? [callPushConfig, hangupPushConfig] : [callPushConfig, hangupPushConfig, enableApplePushKit]
  RCReactNativeCall.setPushConfig.apply(RCReactNativeCall, params)
}

/**
 * 音频配置
 * @param {IRCCallIWAudioConfig} config
 */
function setAudioConfig(config: IRCCallIWAudioConfig = {}) {
  logger.log(`setAudioConfig config->${config} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.setAudioConfig(config)
}

/**
 * 视频配置
 * @param {IRCCallIWVideoConfig} config
 */
function setVideoConfig(config: IRCCallIWVideoConfig = {}) {
  logger.log(`setVideoConfig config->${config} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.setVideoConfig(config)
}

/**
 * 拨打电话-单聊, 如果type为音视频，直接打开默认（前置）摄像头。
 * @param userId 被叫端UserId
 * @param mediaType 发起的通话媒体类型
 * @param extra  附加信息
 *
 */
function startSingleCall(userId: string, mediaType: RCCallIWMediaType, extra: string = ''): Promise<IRCCallIWCallSession> {
  logger.log(`startSingleCall userId->${userId} mediaType->${mediaType} extra->${extra} Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.startSingleCall(userId, mediaType, extra)
}

/**
 * 拨打电话-群聊, 如果type为音视频，直接打开默认（前置）摄像头
 * @param groupId 群组Id
 * @param userIds 被叫端的用户ID列表, 数组中仅填写被叫端UserId, 请不要填写主叫端UserId, 否则无法发起呼叫
 * @param observerUserIds 主叫端指定需要以观察者身份加入房间的用户ID列表, 如果主叫端需要以观察者身份加入房间也需要填写主叫端UserId
 * @param mediaType 发起的通话媒体类型
 * @param extra  附加信息
 */
function startGroupCall(groupId: string, userIds: string[], observerUserIds: Array<string> | null, mediaType: RCCallIWMediaType, extra: string = ''): Promise<IRCCallIWCallSession> {
  logger.log(`startGroupCall groupId->${groupId} userIds->${userIds} observerUserIds->${observerUserIds} callType->${mediaType} Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.startGroupCall(groupId, userIds, observerUserIds, mediaType, extra)
}

/**
 * 获取当前call session
 */
function getCurrentCallSession(): Promise<IRCCallIWCallSession> {
  logger.log(`getCurrentCallSession Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.getCurrentCallSession()
}

/**
 * 接听
 */
function accept() {
  logger.log(`accept Platform.OS->${Platform.OS}`)
  RCReactNativeCall.accept()
}

/**
 * 挂断
 */
function hangup() {
  logger.log(`hangup Platform.OS->${Platform.OS}`)
  RCReactNativeCall.hangup()
}

/**
 * 麦克风控制,开启、关闭麦克风
 * @param enable true开启 false关闭
 */
function enableMicrophone(enable: boolean) {
  logger.log(`enableMicrophone enable->${enable} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.enableMicrophone(enable)
}

/**
 * 扬声器控制 开启、关闭扬声器
 * @param enable true开启 false关闭
 */
function enableSpeaker(enable: boolean) {
  logger.log(`enableSpeaker enable->${enable} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.enableSpeaker(enable)
}

/**
 * 获取当前扬声器状态,当前扬声器是否开启
 */
function isEnableSpeaker(): Promise<boolean> {
  logger.log(`isEnableSpeaker Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.isEnableSpeaker()
}

/**
 * 摄像头控制
 * @param enable true 开启摄像头，false 关闭摄像头
 * @param camera 指定摄像头
 */
function enableCamera(enable: boolean, camera: RCCallIWCamera) {
  logger.log(`enableCamera enable->${enable} camera->${camera} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.enableCamera(enable, camera)
}

/**
 * 获取当前摄像头状态, 是否已开启摄像头
 * @param resolve
 */
function isEnableCamera(): Promise<boolean> {
  logger.log(`isEnableCamera Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.isEnableCamera()
}

/**
 * 获取当前摄像头
 */
function currentCamera(): Promise<RCCallIWCamera> {
  logger.log(`currentCamera Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.currentCamera()
}

/**
 * 切换摄像头
 */
function switchCamera() {
  logger.log('switchCamera')
  RCReactNativeCall.switchCamera()
}
/**
 * 设置预览窗口，此方法需要在视图更新渲染完成后执行
 * @param userId 用户Id
 * @param viewId videoView的容器的引用
 * @param type 视频显示模式
 * @param isZorderOnTop android only 是否置顶
 */
function setVideoView(userId: string, viewId: number, type: RCCallIWViewFitType, isZOrderOnTop: boolean = false) {
  logger.log(`setVideoView userId->${userId} viewId->${viewId} type->${type} isZOrderOnTop->${isZOrderOnTop} Platform.OS->${Platform.OS}`)
  const params = Platform.OS === 'android' ? [userId, viewId, type, isZOrderOnTop] : [userId, viewId, type]
  RCReactNativeCall.setVideoView.apply(RCReactNativeCall, params)
}

/**
 * 修改通话类型
 * @param type
 */
function changeMediaType(type: RCCallIWMediaType) {
  logger.log(`inviteUsers type->${type} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.changeMediaType(type)
}

/**
 * 邀请用户
 * @param userIds 被邀请用户id列表
 * @param observerUserIds 被邀请观察者id列表 (只能听或看，不能推流的用户)
 */
function inviteUsers(userIds: string[], observerUserIds: string[]) {
  logger.log(`inviteUsers userIds->${userIds} observerUserIds->${observerUserIds} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.inviteUsers(userIds, observerUserIds)
}

/**
 * 设置滤镜
 * @param filter 滤镜
 */
function setBeautyFilter(filter: RCCallIWBeautyFilterType) {
  logger.log(`setBeautyFilter filter->${filter} Platform.OS->${Platform.OS}`)
  RCReactNativeCall.setBeautyFilter(filter)
}

/**
* 获取当前的滤镜
*/
function getCurrentBeautyFilter(): Promise<RCCallIWBeautyFilterType> {
  logger.log(`getCurrentBeautyFilter Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.getCurrentBeautyFilter()
}

/**
* 设置美颜参数
* @param enable 默认关闭
* @param option 美颜参数
*/
function setBeautyOption(enable: boolean = false, option: IRCCallIWBeautyOption = {
  whitenessLevel: 0,
  smoothLevel: 0,
  ruddyLevel: 0,
  brightLevel: 5
}) {
  logger.log(`setBeautyOption enable->${enable} option.whitenessLevel->${option.whitenessLevel} option.smoothLevel->${option.smoothLevel} option.ruddyLevel->${option.ruddyLevel}  option.brightLevel->${option.brightLevel} Platform.OS->${Platform.OS}`)
  if (typeof option !== 'object') {
    logger.log('setBeautyOption options parameter error')
    return
  }
  RCReactNativeCall.setBeautyOption(enable, option)
}

/**
* 获取当前的美颜参数
* 默认不传参数
*/
function getCurrentBeautyOption(): Promise<IRCCallIWBeautyOption> {
  logger.log(`getCurrentBeautyOption Platform.OS->${Platform.OS}`)
  return RCReactNativeCall.getCurrentBeautyOption()
}

/**
* 重置美颜参数和滤镜
* 默认不传参数
*/
function resetBeauty() {
  logger.log(`resetBeauty Platform.OS->${Platform.OS}`)
  RCReactNativeCall.resetBeauty()
}

/**
 * 呼出端事件的顺序
 * Engine:OnCallOutgoing
 * Engine:OnEnableCamera
 * Engine:OnRemoteUserRinging
 * Engine:OnCallConnected
 * Engine:OnRemoteUserJoined
 * Engine:OnRemoteUserCameraStateChanged
 *
 *
 * 呼入端事件顺序
 * Engine:OnCallReceived
 * Engine:OnCallConnected
 * Engine:OnEnableCamera
 * Engine:OnRemoteUserJoined
 *
 * 远端有被邀请的情况
 * Engine:OnRemoteUserInvited
 * Engine:OnRemoteUserRinging
 * OnRemoteUserJoined
 *
 *
 */

/**
 * 接收到通话呼入
 */
function onCallReceived(listener: (session: IRCCallIWCallSession) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnCallReceived', (session: IRCCallIWCallSession) => {
    logger.log(`Engine:OnCallReceived session.sessionId->${session?.sessionId} Platform.OS->${Platform.OS}`)

    listener(session)
  })
}

/**
 * 通话已接通
 */
function onCallConnected(listener: () => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnCallConnected', () => {
    logger.log(`Engine:OnCallConnected Platform.OS->${Platform.OS}`)
    listener()
  })
}

/**
 * 通话已结束
 * @param 挂断原因
 */
function onCallDisconnected(listener: (reason: RCCallIWCallDisconnectedReason) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnCallDisconnected', (reason: RCCallIWCallDisconnectedReason) => {
    logger.log(`Engine:OnCallDisconnected reaseon->${reason} Platform.OS->${Platform.OS}`)
    listener(reason)
  })
}

/**
 * 对端用户加入了通话
 * @param user 对端用户信息
 */
function onRemoteUserJoined(listener: (user: IRCCallIWUserProfile) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserJoined', (user: IRCCallIWUserProfile) => {
    logger.log(`Engine:OnRemoteUserJoined user.userId->${user.userId} Platform.OS->${Platform.OS}`)

    listener(user)
  })
}

/**
 * 对端用户挂断 (实际测试，只在群聊时用触发)
 * @param user 对端用户信息
 * @param reason 挂断原因
 */
function onRemoteUserLeft(listener: (user: string, reason: RCCallIWCallDisconnectedReason) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserLeft', (data: { userId: string; reason: RCCallIWCallDisconnectedReason }) => {
    logger.log(`Engine:OnRemoteUserLeft user->${data.userId} reason->${data.reason}  Platform.OS->${Platform.OS}`)
    listener(data.userId, data.reason)
  })
}

/**
 * 开启或关闭摄像头的回调
 */
function onEnableCamera(listener: (camera: RCCallIWCamera, enable: boolean) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnEnableCamera', (data: { camera: RCCallIWCamera; enable: boolean }) => {
    logger.log(`Engine:OnEnableCamera camera->${data.camera} enable->${data.enable}  Platform.OS->${Platform.OS}`)

    listener(data.camera, data.enable)
  })
}

/**
 * 切换摄像头回调
 */
function onSwitchCamera(listener: (camera: RCCallIWCamera) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnSwitchCamera', (camera: RCCallIWCamera) => {
    logger.log(`Engine:OnSwitchCamera camera->${camera}  Platform.OS->${Platform.OS}`)

    listener(camera)
  })
}

/**
 * 通话出现错误的回调
 */
function onError(listener: (code: RCRNCallErrorCode) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnError', (code: RCRNCallErrorCode) => {
    logger.log(`[RCRNCallLib Engine:OnError] code->${code}  Platform.OS->${Platform.OS}`)

    listener(code)
  })
}

/**
 * 开始呼叫通话的回调
 */
function onCallOutgoing(listener: () => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnCallOutgoing', () => {
    logger.log(' Engine:OnCallOutgoing')
    listener()
  })
}

/**
 * 对端用户正在振铃
 */
function onRemoteUserRinging(listener: (userId: string) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserRinging', (userId: string) => {
    logger.log(`Engine:OnRemoteUserRinging userId->${userId}  Platform.OS->${Platform.OS}`)
    listener(userId)
  })
}

/**
 * 有用户被邀请加入通话 顺序：Engine:OnRemoteUserInvited -> Engine:OnRemoteUserRinging
 */
function onRemoteUserInvited(listener: (userId: string, mediaType: RCCallIWMediaType) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserInvited', (data: { userId: string; mediaType: RCCallIWMediaType }) => {
    logger.log(`Engine:OnRemoteUserInvited userId->${data.userId} mediaType->${data.mediaType}  Platform.OS->${Platform.OS}`)
    listener(data.userId, data.mediaType)
  })
}

/**
 * 对端用户切换了媒体类型
 */
function onRemoteUserMediaTypeChanged(listener: (user: IRCCallIWUserProfile, mediaType: RCCallIWMediaType) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserMediaTypeChanged', (data: { user: IRCCallIWUserProfile; mediaType: RCCallIWMediaType }) => {
    logger.log(`Engine:OnRemoteUserMediaTypeChanged user.userId->${data.user.userId} mediaType->${data.mediaType}  Platform.OS->${Platform.OS}`)
    listener(data.user, data.mediaType)
  })
}

/**
 * 对端用户开启或关闭了麦克风的状态
 */
function onRemoteUserMicrophoneStateChanged(listener: (user: IRCCallIWUserProfile, enable: boolean) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserMicrophoneStateChanged', (data: { user: IRCCallIWUserProfile; enable: boolean }) => {
    logger.log(`Engine:OnRemoteUserMicrophoneStateChanged user.userId->${data.user.userId} enable->${data.enable}  Platform.OS->${Platform.OS}`)
    listener(data.user, data.enable)
  })
}

/**
 * 对端用户开启或关闭了摄像头的状态
 */
function onRemoteUserCameraStateChanged(listener: (user: IRCCallIWUserProfile, enable: boolean) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnRemoteUserCameraStateChanged', (data: { user: IRCCallIWUserProfile; enable: boolean }) => {
    logger.log(`Engine:OnRemoteUserCameraStateChanged user.userId->${data.user.userId} enable->${data.enable}  Platform.OS->${Platform.OS}`)
    listener(data.user, data.enable)
  })
}

/**
 * 当前通话网络状态的回调，该回调方法每秒触发一次
 * @param user    用户信息
 * @param quality 网络质量
 * @discussion
 * 如果user是本端用户, quality代表上行网络质量
 * 如果user是远端用户, quality代表下行网络质量
 */
function onNetworkQuality(listener: (user: IRCCallIWUserProfile, quality: RCCallIWNetworkQuality) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnNetworkQuality', (data: { user: IRCCallIWUserProfile; quality: RCCallIWNetworkQuality }) => {
    logger.log(`Engine:OnNetworkQuality user.userId->${data.user.userId} quality->${data.quality}  Platform.OS->${Platform.OS}`)
    listener(data.user, data.quality)
  })
}

/**
 * 当前通话某用户声音音量回调
 * @param user    用户信息
 * @param volume  声音音量
 * @discussion
 * 声音级别: 0~9, 0为无声, 依次变大
 * 如果user是本端用户, volume代表发送音量
 * 如果user是远端用户, volume代表接收音量
 */
function onAudioVolume(listener: (user: IRCCallIWUserProfile, volume: number) => void) {
  RCReactNativeEventEmitter.addListener('Engine:OnAudioVolume', (data: { user: IRCCallIWUserProfile, volume: number }) => {
    logger.log(`Engine:OnAudioVolume user.userId->${data.user.userId} volume->${data.volume}  Platform.OS->${Platform.OS}`)
    listener(data.user, data.volume)
  })
}

/**
 * 移除监听-接收到通话呼入
 */
function removeCallReceivedListener() {
  logger.log('remove onCallReceived')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnCallReceived')
}

/**
 * 移除监听-通话已接通
 */
function removeCallConnectedListener() {
  logger.log('remove onCallConnected')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnCallConnected')
}

/**
 * 移除监听-通话已结束
 * @param 挂断原因
 */
function removeCallDisconnectedListener() {
  logger.log('remove onCallDisconnected')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnCallDisconnected')
}

/**
 * 移除监听-对端用户加入了通话
 */
function removeRemoteUserJoinedListener() {
  logger.log('remove onRemoteUserJoined')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserJoined')
}

/**
 * 移除监听-对端用户挂断
 */
function removeRemoteUserLeftListener() {
  logger.log('remove onRemoteUserLeft')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserLeft')
}

/**
 * 移除监听-开启或关闭摄像头的回调
 */
function removeEnableCameraListener() {
  logger.log('remove onEnableCamera')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnEnableCamera')
}

/**
 * 移除监听-切换摄像头回调
 */
function removeSwitchCameraListener() {
  logger.log('remove onSwitchCamera')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnSwitchCamera')
}

/**
 * 移除监听-通话出现错误的回调
 */
function removeErrorListener() {
  logger.log('remove onError')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnError')
}

/**
 * 移除监听-开始呼叫通话的回调
 */
function removeCallOutgoingListener() {
  logger.log('remove onCallOutgoing')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnCallOutgoing')
}

/**
 * 移除监听-对端用户正在振铃
 */
function removeRemoteUserRingingListener() {
  logger.log('remove onRemoteUserRinging')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserRinging')
}

/**
 * 移除监听-有用户被邀请加入通话
 */
function removeRemoteUserInvited() {
  logger.log('remove onRemoteUserInvited')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserInvited')
}

/**
 * 移除监听-对端用户切换了媒体类型
 */
function removeRemoteUserMediaTypeChangedListener() {
  logger.log('remove onRemoteUserMediaTypeChanged')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserMediaTypeChanged')
}

/**
 * 对端用户开启或关闭了麦克风的状态
 */
function removeRemoteUserDidChangeMicrophoneStateListener() {
  logger.log('removeRemoteUserDidChangeMicrophoneStateListener')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserMicrophoneStateChanged')
}

/**
 * 对端用户开启或关闭了摄像头的状态
 */
function removeRemoteUserCameraStateChangedListener() {
  logger.log('remove onRemoteUserCameraStateChanged')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnRemoteUserCameraStateChanged')
}

/**
 * 移除监听-当前通话网络状态的回调，该回调方法每秒触发一次
 */
function removeNetworkQualityListener() {
  logger.log('remove onNetworkQuality')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnNetworkQuality')
}

/**
 * 移除监听-当前通话某用户声音音量回调
 */
function removeAudioVolumeListener() {
  logger.log('remove onAudioVolume')
  RCReactNativeEventEmitter.removeAllListeners('Engine:OnAudioVolume')
}

export {
  // RCReactNativeCall,
  // RCReactNativeEventEmitter,
  RCReactNativeCallVideoView,

  init,
  unInit,
  setEngineConfig,
  setPushConfig,
  setAudioConfig,
  setVideoConfig,
  startSingleCall,
  startGroupCall,
  accept,
  hangup,
  enableMicrophone,
  enableSpeaker,
  isEnableSpeaker,
  enableCamera,
  isEnableCamera,
  currentCamera,
  switchCamera,
  setVideoView,
  getCurrentCallSession,
  changeMediaType,
  inviteUsers,
  setBeautyFilter,
  getCurrentBeautyFilter,
  setBeautyOption,
  getCurrentBeautyOption,
  resetBeauty,

  onCallReceived,
  onCallConnected,
  onCallDisconnected,
  onRemoteUserJoined,
  onRemoteUserLeft,

  // test android已触发，要用真机测下ios
  onEnableCamera,
  onSwitchCamera,

  // test 没触发
  onError,
  onCallOutgoing,
  onRemoteUserRinging,

  // test 没触发
  onRemoteUserInvited,

  onRemoteUserMediaTypeChanged,
  onRemoteUserMicrophoneStateChanged,
  onRemoteUserCameraStateChanged,
  onNetworkQuality,
  onAudioVolume,

  removeCallReceivedListener,
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

  RCCallIWCallType,
  RCCallIWMediaType,
  RCCallIWCallDisconnectedReason,
  RCCallIWCamera,
  RCCallIWNetworkQuality,
  RCCallIWViewFitType,

  IRCCallIWEngineConfig,
  IRCCallIWUserProfile,
  IRCCallIWPushConfig,
  IRCCallIWAudioConfig,
  IRCCallIWVideoConfig,
  IRCCallIWCallSession

}
