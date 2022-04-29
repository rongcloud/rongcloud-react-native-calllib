//
//  NSDictionary+RCRNCall.h
//  RCReactNativeCall
//
//  Created by RongCloud on 2021/7/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSDictionary (RCRNCall)

- (nullable id)rcrncall_getValue:(Class)vClass forKey:(NSString *)key;
- (nullable id)rcrncall_getValue:(Class)vClass forKey:(NSString *)key defaultValue:(nullable id)defaultValue;

- (BOOL)rcrncall_getBool:(NSString *)key;
- (BOOL)rcrncall_getBool:(NSString *)key defaultValue:(BOOL)defaultValue;

- (NSInteger)rcrncall_getInteger:(NSString *)key;
- (NSInteger)rcrncall_getInteger:(NSString *)key defaultValue:(NSInteger)defaultValue;

- (float)rcrncall_getFloat:(NSString *)key;
- (float)rcrncall_getFloat:(NSString *)key defaultValue:(float)defaultValue;

- (nullable NSNumber *)rcrncall_getNumber:(NSString *)key;
- (nullable NSNumber *)rcrncall_getNumber:(NSString *)key defaultValue:(nullable NSNumber *)defaultValue;

- (nullable NSString *)rcrncall_getString:(NSString *)key;
- (nullable NSString *)rcrncall_getString:(NSString *)key defaultValue:(nullable NSString *)defaultValue;

- (nullable NSDictionary *)rcrncall_getDictionary:(NSString *)key;

- (nullable NSArray *)rcrncall_getArray:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
