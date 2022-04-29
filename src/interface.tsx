
import {
  RCCallIWMediaType,
  RCCallIWUserType,
  RCCallIWCallType,
  RCCallIWAudioCodecType,
  RCCallIWVideoProfile,
  RCCallIWCamera,
  RCCallIWCameraOrientation
} from './enum'

/**
 * 引擎配置
 */
 interface IRCCallIWEngineConfig {
  // android only 启用自动重新连接, 默认true
  enableAutoReconnect?: boolean;

  // android only 状态报告间隔 单位毫秒, 默认1000ms(1s)。 注意 interval 值太小会影响 SDK 性能，如果小于 100 配置无法生效
  statusReportInterval?: number;

  // ios only 开启通话记录 默认NO
  enableCallSummary?: boolean;
}

interface RCCallIWIOSPushConfig {
  /**
  * iOS 平台通知栏分组 ID
  * 相同的 thread-id 推送分为一组
  * iOS10 开始支持
  */
  threadId?: string;

  /**
   * iOS 标识推送的类型
   * 如果不设置后台默认取消息类型字符串，如 RC:TxtMsg
   */
  category?: string;

  /**
   * iOS 平台通知覆盖 ID
   * apnsCollapseId 相同时，新收到的通知会覆盖老的通知，最大 64 字节
   * iOS10 开始支持
   */
  apnsCollapseId?: string;

  /**
   * iOS 富文本推送内容
   */
  richMediaUri?: string;
}

interface RCCallIWAndroidPushConfig {

/**
 * Android 平台 Push 唯一标识
 * 目前支持小米、华为推送平台，默认开发者不需要进行设置，当消息产生推送时，消息的 messageUId 作为 notificationId 使用。
 */
 notificationId?: string;

 /**
  * 小米的渠道 ID
  * 该条消息针对小米使用的推送渠道，如开发者集成了小米推送，需要指定 channelId 时，可向 Android 端研发人员获取，channelId 由开发者自行创建。
  */
 channelIdMi?: string;

 /**
  * 华为的渠道 ID
  * 该条消息针对华为使用的推送渠道，如开发者集成了华为推送，需要指定 channelId 时，可向 Android 端研发人员获取，channelId 由开发者自行创建。
  */
  channelIdHW?: string;

 /**
  * OPPO 的渠道 ID
  * 该条消息针对 OPPO 使用的推送渠道，如开发者集成了 OPPO 推送，需要指定 channelId 时，可向 Android 端研发人员获取，channelId 由开发者自行创建。
  */
  channelIdOPPO?: string;

 /*
  * VIVO 推送通道类型
  * 开发者集成了 VIVO 推送，需要指定推送类型时，可进行设置。
  * 目前可选值 "0"(运营消息) 和  "1"(系统消息)
  */
  typeVivo?: string;

 /**
  * FCM 通知类型推送时所使用的分组 id
  */
 collapseKeyFCM: string;

 /**
  * FCM 通知类型的推送所使用的通知图片 url
  */
 imageUrlFCM: string;
}

/**
 *  推送配置
 */
interface IRCCallIWPushConfig {
  /**
   * 是否屏蔽通知标题
   * YES:  不显示通知标题
   * NO: 显示通知标题

  * @discussion 默认情况下融云单聊消息通知标题为用户名、群聊消息为群名称，设置后不会再显示通知标题。
  * @discussion 此属性只针目标用户为 iOS 平台时有效，Android 第三方推送平台的通知标题为必填项，所以暂不支持。
  */
   disableTitle?: boolean;

  /**
   * 推送标题
   * 如果没有设置，会使用下面的默认标题显示规则
   * 默认标题显示规则：
   *   内置消息：单聊通知标题显示为发送者名称，群聊通知标题显示为群名称。
   *   自定义消息：默认不显示标题。
   */
   title?: string;

  /**
   * 推送内容
   * 优先使用 MessagePushConfig 的 pushContent，如果没有，则使用 sendMessage 或者 sendMediaMessage 的 pushContent。
   */
   content?: string;

  /**
   * 远程推送附加信息
   * 优先使用 MessagePushConfig 的 pushData，如果没有，则使用 sendMessage 或者 sendMediaMessage 的 pushData。
   */
   data?: string;

  /**
   * 是否强制显示通知详情
   * 当目标用户通过 RCPushProfile 中的 updateShowPushContentStatus 设置推送不显示消息详情时，可通过此参数，强制设置该条消息显示推送详情。
   */
   forceShowDetailContent?: boolean;

  /**
   * 推送模板 ID，设置后根据目标用户通过 SDK RCPushProfile 中的 setPushLauguageCode 设置的语言环境，匹配模板中设置的语言内容进行推送，未匹配成功时使用默认内容进行推送，模板内容在“开发者后台-自定义推送文案”中进行设置。
   * 注：RCMessagePushConfig 中的 Title 和 PushContent 优先级高于模板 ID（templateId）中对应的标题和推送内容。
   */
   templateId?: string;

  iOSConfig?: RCCallIWIOSPushConfig;

  androidConfig?: RCCallIWAndroidPushConfig;
}

interface IRCCallIWAudioConfig {
  /**
   * android only
   * 是否启用麦克风 不启用麦克风则不创建 AudioRecoder 实例，RTCLib 加入房间 或 CallLib 开始通话 后无法再操作麦克风。默认 true
   */
  enableMicrophone?: boolean;

  /**
   * android only
   * 设置音频是否支持立体声 默认 true
   */
  enableStereo?: boolean;

  /**
   * android only
   * 设置 android.media.AudioRecord采集音源 适用于 SDK 中默认设置的音源在设备上 AudioRecord 采集音频异常场景。 默认 MediaRecorder.AudioSource#VOICE_COMMUNICATION 详见 https://www.rongcloud.cn/docs/api/android/rtclib_v5/cn/rongcloud/rtc/api/RCRTCConfig.Builder.html
   */
  audioSource?: number;

  /**
   * android only
   * Deprecated from 5.1.0 设置音频码率 当音频编解码类型设置为RCRTCParamsType.AudioCodecType.PCMU时，设置的音频比特率(setAudioBitrate(int)) 不能低于64，低于64默认为64。
   */
  audioBitrate?: number;

  /**
   * android only
   * 音频采样率,  支持的音频采样率有：8000，16000， 32000， 44100， 48000。 默认为 16000。
   */
  audioSampleRate?: number;

  /**
   * android only
   * 音频编解码类型 当音频编解码类型设置为RCRTCParamsType.AudioCodecType.PCMU时，设置的音频比特率(setAudioBitrate(int)) 不能低于64，低于64默认为64。
   */
  type?: RCCallIWAudioCodecType;
}

interface IRCCallIWVideoConfig {

  /**
   * android only
   * 是否使用硬解码，SDK 会根据硬件支持情况创建硬解码器，如果创建失败会使用软解。 默认是 true
   */
  enableHardwareDecoder?: boolean;

  /**
   * android only
   * 设置硬解码颜色空间 该值必须是本设备H264解码器所支持的值,可以通过 获取本机所支持的编解码器、颜色空间信息。 默认 0 为采用 SDK 中设置的颜色空间逻辑
   */
  hardwareDecoderColor?: number;

  /**
   * android only
   * 是否使用硬编码，SDK 会根据硬件支持情况创建硬编码器，如果创建失败会使用软编。默认是 true
   */
  enableHardwareEncoder?: boolean;

  /**
   * android only
   * 设置硬编码压缩等级是否为 MediaCodecInfo.CodecProfileLevel.AVCProfileHigh
   * ProfileHigh 比 AVCProfileBaseline 压缩率更高，但是 AVCProfileBaseline 兼容性更好， AVCProfileHigh 压缩等级为 MediaCodecInfo.CodecProfileLevel.AVCLevel3
   * enabled - 默认为 false ，true 代表 MediaCodecInfo.CodecProfileLevel.AVCProfileHigh
   */
  enableHardwareEncoderHighProfile?: boolean;

  /**
   * android only
   * 视频流采集方式，设置视频流是否采用 texture 采集。一般安卓5.0以下系统建议使用YUV采集，以避免低版本系统texture的兼容性问题。
   * enabled - 默认 true : texture 方式采集，false : yuv 方式采集
   */
  enableEncoderTexture?: boolean;

  /**
   * android only
   * 设置硬解码颜色空间
   * 该值必须是本设备H264解码器所支持的值,可以通过 获取本机所支持的编解码器、颜色空间信息
   * 默认 0 为采用 SDK 中设置的颜色空间逻辑
   */
  hardWareEncoderColor?: number;

  /**
   * android only
   * 系统硬编码器的编码帧率
   * 取值范围 (0 - 30) 默认 30 FPS
   */
  hardWareEncoderFrameRate?: number;

  /**
   * android only
   * 设置硬编码码率控制模式
   * 仅 Android 系统 5.0 及以上版本设置有效 默认 RongRTCConfig.VideoBitrateMode.CBR
   */
  hardwareEncoderBitrateMode?: number;

  /*
   * 视频配置
   * 默认值 RCCallIW_VIDEO_PROFILE_720_1280
   */
  profile?: RCCallIWVideoProfile;

  /*
   * 摄像头
   * 默认值 RCCallIWCameraFront
   */
  defaultCamera?: RCCallIWCamera;
  /*
   相机方向
   默认值 RCCallIWCameraOrientationPortrait
   */
  cameraOrientation?: RCCallIWCameraOrientation;
}

/**
* user
*/
interface IRCCallIWUserProfile {
 // 用户身份类型
 userType: RCCallIWUserType;

 // 通话媒体类型
 mediaType: RCCallIWMediaType;

 // 用户id
 userId: string;

 // 用户的通话媒体连接ID
 mediaId: string;

 // 用户是否开启摄像头
 enableCamera: boolean;

 // 用户是否开启麦克风
 enableMicrophone: boolean;

}

interface IRCCallIWCallSession {
  // 通话类型
  callType: RCCallIWCallType;

  // 通话媒体类型
  mediaType: RCCallIWMediaType;

  // 通话id
  callId: string;

  // 通话目标id
  targetId: string;

  // RTC会话唯一标识, 用于 Server API
  sessionId: string;

  // 通话的扩展信息
  extra: string;

  // 通话开始的时间
  startTime: number;

  // 通话接通时间
  connectedTime: number;

  // 通话结束时间
  endTime: number;

  // 当前通话发起者
  caller: IRCCallIWUserProfile;

  // 邀请当前用户到当前通话的邀请者
  inviter: IRCCallIWUserProfile;

  // 当前用户
  mine: IRCCallIWUserProfile;

  // 当前通话的全部用户列表
  users: IRCCallIWUserProfile[];

}

/**
 * 配置美颜的参数
 */
interface IRCCallIWBeautyOption {
  // 美白 取值范围 [0 ~ 9] 默认值 0
  whitenessLevel: number;

  // 磨皮 取值范围 [0 ~ 9] 默认值 0
  smoothLevel: number;

  // 红润 取值范围 [0 ~ 9] 默认值 0
  ruddyLevel: number;

  // 亮度 取值范围 [0 ~ 9] 默认值 5
  brightLevel: number;
}
export {
  IRCCallIWEngineConfig,
  IRCCallIWPushConfig,
  IRCCallIWAudioConfig,
  IRCCallIWVideoConfig,
  IRCCallIWUserProfile,
  IRCCallIWCallSession,
  IRCCallIWBeautyOption
}
