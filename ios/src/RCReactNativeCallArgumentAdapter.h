//
//  RCReactNativeCallArgumentAdapter.h
//  RCReactNativeCall
//
//  Created by RongCloud on 2021/7/23.
//

#ifndef __RCRNReturn__
#define __RCRNReturn__

#define RCRNReturnValue(f, ...)  \
if (f) {                         \
    return __VA_ARGS__;          \
}

#define RCRNReturnIfNeed(f, ...) RCRNReturnValue(f, __VA_ARGS__)

#endif


#ifndef ArgumentAdapter_h
#define ArgumentAdapter_h

#import <RongCallWrapper/RongCallWrapper.h>

#ifdef __cplusplus
extern "C" {
#endif

/*
 * ENUM...
 */
RCCallIWUserType toCallIWUserType(int type);

RCCallIWCallType toCallIWCallType(int type);

RCCallIWMediaType toCallIWMediaType(int type);

RCCallIWCamera toCallIWCamera(int type);

RCCallIWNetworkQuality toCallIWNetworkQuality(int type);

RCCallIWViewFitType toCallIWViewFitType(int type);

RCCallIWVideoProfile toCallIWVideoProfile(int type);

RCCallIWCameraOrientation toCallIWCameraOrientation(int type);

RCCallIWDisconnectReason toCallIWDisconnectReason(int type);

RCCallIWBeautyFilter toCallIWBeautyFilter(int filter);

NSInteger fromCallIWMediaType(RCCallIWMediaType type);

NSInteger fromCallIWCamera(RCCallIWCamera camera);

NSInteger fromCallIWDisconnectReason(RCCallIWDisconnectReason reason);

NSInteger fromCallIWNetworkQuality(RCCallIWNetworkQuality quality);

NSInteger fromCallIWBeautyFilter(RCCallIWBeautyFilter filter);

/*
 * DICTIONARY TO MODEL...
 */
RCCallIWEngineConfig *toCallIWEngineConfig(NSDictionary *arguments);

RCCallIWPushConfig *toCallIWPushConfig(NSDictionary *arguments);

RCCallIWIOSPushConfig *toCallIWIOSPushConfig(NSDictionary *arguments);

RCCallIWAndroidPushConfig *toCallIWAndroidPushConfig(NSDictionary *arguments);

RCCallIWAudioConfig *toCallIWAudioConfig(NSDictionary *arguments);

RCCallIWVideoConfig *toCallIWVideoConfig(NSDictionary *arguments);

RCCallIWUserProfile *toCallIWUserProfile(NSDictionary *arguments);

RCCallIWBeautyOption *toCallIWBeautyOption(NSDictionary *arguments);

/*
 * MODEL TO DICTIONARY...
 */
NSDictionary *fromCallIWEngineConfig(RCCallIWEngineConfig *config);

NSDictionary *fromCallIWPushConfig(RCCallIWPushConfig *config);

NSDictionary *fromCallIWIOSPushConfig(RCCallIWIOSPushConfig *config);

NSDictionary *fromCallIWAndroidPushConfig(RCCallIWAndroidPushConfig *config);

NSDictionary *fromCallIWAudioConfig(RCCallIWAudioConfig *config);

NSDictionary *fromCallIWVideoConfig(RCCallIWVideoConfig *config);

NSDictionary *fromCallIWUserProfile(RCCallIWUserProfile *profile);

NSDictionary *fromCallIWCallSession(RCCallIWCallSession *session);

NSDictionary *fromCallIWBeautyOption(RCCallIWBeautyOption *option);

#ifdef __cplusplus
}
#endif

#endif


