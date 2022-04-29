
/**
 * 通话媒体类型
 */
 enum RCCallIWMediaType {
  /**
   * 音频通话
   */
  AUDIO = 0,
  /**
   * 视频通话
   */
  AUDIO_VIDEO = 1
}

/**
 *通话结束原因
 */
 enum RCCallIWCallDisconnectedReason {
  // 己方取消已发出的通话请求
  CANCEL = 0,

  // 己方拒绝收到的通话请求
  REJECT = 1,

  // 己方挂断
  HANGUP = 2,

  // 己方忙碌
  BUSY_LINE = 3,

  // 己方未接听
  NO_RESPONSE = 4,

  // 己方不支持当前引擎
  ENGINE_UNSUPPORTED = 5,

  // 己方网络出错
  NETWORK_ERROR = 6,

  // 己方获取媒体资源失败
  RESOURCE_GET_ERROR = 7,

  // 己方发布资源失败
  RESOURCE_PUBLISH_ERROR = 8,

  // 己方订阅资源失败
  RESOURCE_SUBSCRIBE_ERROR = 9,

  // 对方取消已发出的通话请求
  REMOTE_CANCEL = 10,

  // 对方拒绝收到的通话请求
  REMOTE_REJECT = 11,

  // 通话过程对方挂断
  REMOTE_HANGUP = 12,

  // 对方忙碌
  REMOTE_BUSY_LINE = 13,

  // 对方未接听
  REMOTE_NO_RESPONSE = 14,

  // 对方不支持当前引擎
  REMOTE_ENGINE_UNSUPPORTED = 15,

  // 对方网络错误
  REMOTE_NETWORK_ERROR = 16,

  // 对方获取媒体资源失败
  REMOTE_RESOURCE_GET_ERROR = 17,

  // 对方发布资源失败
  REMOTE_RESOURCE_PUBLISH_ERROR = 18,

  // 对方订阅资源失败
  REMOTE_RESOURCE_SUBSCRIBE_ERROR = 19,

  // 己方其他端已加入新通话
  KICKED_BY_OTHER_CALL = 20,

  // 己方其他端已在通话中
  IN_OTHER_CALL = 21,

  // 己方已被禁止通话
  KICKED_BY_SERVER = 22,

  // 对方其他端已加入新通话
  REMOTE_KICKED_BY_OTHER_CALL = 23,

  // 对方其他端已在通话中
  REMOTE_IN_OTHER_CALL = 24,

  // 对方已被禁止通话
  REMOTE_KICKED_BY_SERVER = 25,

  // 己方其他端已接听
  ACCEPT_BY_OTHER_CLIENT = 26,

  // 己方其他端已挂断
  HANGUP_BY_OTHER_CLIENT = 27,

  // 己方被对方加入黑名单
  REJECTED_BY_BLACKLIST = 28,

  // 音视频服务已关闭
  SERVICE_NOT_OPENED = 29,

  // 己方被降级为观察者
  DROP_TO_OBSERVER = 30,

  // 己方摄像头初始化错误，可能是没有打开使用摄像头权限
  INIT_VIDEO_ERROR = 31,

  // 其他端已经接听
  OTHER_DEVICE_HAD_ACCEPTED = 32,

  // im ipc服务已断开
  SERVICE_DISCONNECTED = 33

};

/**
 * 用户身份类型
 */
 enum RCCallIWUserType {
  /**
   * 普通身份
   */

  NORMAL = 0,

  /**
   * 观察者身份
   */
  OBSERVER =1
};

/**
 * 相机类型
 */
 enum RCCallIWCamera {
  /**
   * 未指定
   */
   NONE = 0,

  /**
   * 前置相机
   */
  FRONT = 1,

  /**
   * 后置相机
   */
  BACK = 2,
};

/**
 * 网络质量
 */
 enum RCCallIWNetworkQuality {
  /**
   * 未知
   */

  UNKNOWN =0,
  /**
   * 极好
   */
  EXCELLENT = 1,
  /**
   * 好
   */
  GOOD = 2,
  /**
   * 一般
   */
  POOR = 3,
  /**
   * 差
   */
  BAD = 4,
  /**
   * 极差
   */
  TERRIBLE = 5
};

/**
 * 通话类型
 */
 enum RCCallIWCallType {
  /**
   * 单聊通话
   */
  SINGLE = 0,
  /**
   * 群聊通话
   */
  GROUP = 1
};

/**
 * 音频编解码类型 当音频编解码类型设置为RCRTCParamsType.AudioCodecType.PCMU时，设置的音频比特率(setAudioBitrate(int)) 不能低于64，低于64默认为64。
 */
enum RCCallIWAudioCodecType {
  PCMU = 0,
  OPUS = 1
}

/**
 通话视频参数
 */
enum RCCallIWVideoProfile {
  /**
   144x256, 15fps, 120~240kbps
   */
  VIDEO_PROFILE_144_256 = 0,
  /**
   240x240, 15fps, 120~280kbps
   */
  VIDEO_PROFILE_240_240 = 1,
  /**
   240x320, 15fps, 120~400kbps
   */
  VIDEO_PROFILE_240_320 = 2,
  /**
   360x480, 15fps, 150~650kbps
   */
  VIDEO_PROFILE_360_480 = 3,
  /**
   360x640, 15fps, 180~800kbps
   */
  VIDEO_PROFILE_360_640 = 4,
  /**
   480x640, 15fps, 200~900kbps
   */
  VIDEO_PROFILE_480_640 = 5,
  /**
   480x720, 15fps, 200~1000kbps
   */
  VIDEO_PROFILE_480_720 = 6,
  /**
   720x1280, 15fps, 250~2200kbps
   */
  VIDEO_PROFILE_720_1280 = 7,
  /**
   1080x1920, 15fps, 400~4000kbps
   */
  VIDEO_PROFILE_1080_1920 = 8,
  /**
   144x256, 30fps, 240~480kbps
   */
  VIDEO_PROFILE_144_256_HIGH = 9,
  /**
   240x240, 30fps, 240~360kbps
   */
  VIDEO_PROFILE_240_240_HIGH = 10,
  /**
   240x320, 30fps, 240~800kbps
   */
  VIDEO_PROFILE_240_320_HIGH = 11,
  /**
   360x480, 30fps, 300~1300kbps
   */
  VIDEO_PROFILE_360_480_HIGH = 12,
  /**
   360x640, 30fps, 360~1600kbps
   */
  VIDEO_PROFILE_360_640_HIGH = 13,
  /**
   480x640, 30fps, 400~1800kbps
   */
  VIDEO_PROFILE_480_640_HIGH = 14,
  /**
   480x720, 30fps, 400~2000kbps
   */
  VIDEO_PROFILE_480_720_HIGH = 15,
  /**
   720x1080, 30fps, 500~4400kbps
   */
  VIDEO_PROFILE_720_1280_HIGH = 16,
  /**
   1080x1920, 30fps, 800~8000kbps
   */
  VIDEO_PROFILE_1080_1920_HIGH = 17,
};

/**
 * 摄像机方向
 * 值与 AVCaptureVideoOrientation 一致
 */
 enum RCCallIWCameraOrientation {
  RCCallIWCameraOrientationPortrait = 0,
  RCCallIWCameraOrientationPortraitUpsideDown = 1,
  RCCallIWCameraOrientationLandscapeRight = 2,
  RCCallIWCameraOrientationLandscapeLeft = 3,
};

/**
 * 视频显示模式
 */
 enum RCCallIWViewFitType {
   // 拉伸全屏
  VIEW_FIT_TYPE_FILL = 0,

  // 满屏显示， 等比例填充， 直到填充满整个试图区域，其中一个维度的部分区域会被裁剪
  VIEW_FIT_TYPE_COVER = 1,

  // 完整显示， 填充黑边， 等比例填充，直达一个维度到达区域边界
  VIEW_FIT_TYPE_CENTER = 2
};

/**
 * Engine:OnError
 */

enum RCRNCallErrorCode {

  // 成功
  SUCCESS = 0,

  // android only 开通的音视频服务没有及时生效或音视频服务已关闭，请等待3-5小时后重新安装应用或开启音视频服务再进行测试
  ENGINE_NOT_FOUND = 1,

  // ios only 网络不可用
  NETWORK_UNAVAILABLE = 2,

  // ios only 已经处于通话中了
  ONE_CALL_EXISTED = 3,

  // ios only 无效操作
  OPERATION_UNAVAILABLE = 4,

  // ios only 参数错误
  INVALID_PARAM = 5,

  // ios only 网络不稳定
  NETWORK_UNSTABLE = 6,

  // ios only 媒体服务请求失败
  MEDIA_REQUEST_FAILED = 7,

  // ios only 媒体服务初始化失败
  MEDIA_SERVER_NOT_READY = 8,

  // ios only  媒体服务未初始化
  MEDIA_SERVER_NOT_INITIALIZED = 9,

  // ios only  媒体服务请求超时
  MEDIA_REQUEST_TIMEOUT = 10,

  // ios only  未知的媒体服务错误
  MEDIA_UNKOWN_ERROR = 11,

  // ios only  已被禁止通话
  MEDIA_KICKED_BY_SERVER_ERROR = 12,

  // ios only 音视频服务已关闭
  MEDIA_SERVER_CLOSED_ERROR = 13,

  // ios only 音视频发布资源失败
  MEDIA_SERVER_PUBLISH_ERROR = 14,

  // ios only 音视频订阅资源失败
  MEDIA_SERVER_SUBSCRIBE_ERROR = 15,

  // ios only 其他端已在通话中错误
  MEDIA_JOIN_ROOM_REFUSE_ERROR = 16

}

enum RCCallIWBeautyFilterType {

  // 无美颜滤镜
  NONE = 0,

  // 唯美
  ESTHETIC = 1,

  // 清新
  FRESH = 2,

  // 浪漫
  ROMANTIC = 3
}

export {
  RCCallIWMediaType,
  RCCallIWCallDisconnectedReason,
  RCCallIWUserType,
  RCCallIWCamera,
  RCCallIWNetworkQuality,
  RCCallIWCallType,
  RCCallIWAudioCodecType,
  RCCallIWVideoProfile,
  RCCallIWCameraOrientation,
  RCCallIWViewFitType,
  RCRNCallErrorCode,
  RCCallIWBeautyFilterType
}
