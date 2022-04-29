//
//  RCReactNativeCallVideoViewManager.m
//  CocoaAsyncSocket
//
//  Created by RongCloud on 2021/7/26.
//

#import "RCReactNativeCallVideoViewManager.h"
#import "RCReactNativeCallVideoView.h"

@implementation RCReactNativeCallVideoViewManager

RCT_EXPORT_MODULE(RCReactNativeCallVideoView);

- (UIView *)view {
    return [[RCReactNativeCallVideoView alloc] init];
}

@end
