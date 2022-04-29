//
//  NSArray+RCRNCall.h
//  CocoaAsyncSocket
//
//  Created by RongCloud on 2021/7/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSArray<ObjectType> (RCRNCall)

- (NSDictionary *)indexDictionary;

- (NSArray *)mapTo:(id(^)(ObjectType obj))block;

@end

NS_ASSUME_NONNULL_END
