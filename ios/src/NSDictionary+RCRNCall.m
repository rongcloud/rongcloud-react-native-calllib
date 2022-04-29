//
//  NSDictionary+RCRNCall.m
//  RCReactNativeCall
//
//  Created by RongCloud on 2021/7/23.
//

#import "NSDictionary+RCRNCall.h"

@implementation NSDictionary (RCRNCall)

- (nullable id)rcrncall_getValue:(Class)vClass forKey:(NSString *)key {
    return [self rcrncall_getValue:vClass forKey:key defaultValue:nil];
}

- (nullable id)rcrncall_getValue:(Class)vClass forKey:(NSString *)key defaultValue:(nullable id)defaultValue {
    
    if (![self.allKeys containsObject:key]) {
        return defaultValue;
    }
    
    id value = [self valueForKey:key];
    
    if (!value || ![value isKindOfClass:vClass]) {
        return defaultValue;
    }
    
    return value;
}

- (BOOL)rcrncall_getBool:(NSString *)key {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(NO)] boolValue];
}

- (BOOL)rcrncall_getBool:(NSString *)key defaultValue:(BOOL)defaultValue {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(defaultValue)] boolValue];
}

- (NSInteger)rcrncall_getInteger:(NSString *)key {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(0)] integerValue];
}

- (NSInteger)rcrncall_getInteger:(NSString *)key defaultValue:(NSInteger)defaultValue {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(defaultValue)] integerValue];
}

- (float)rcrncall_getFloat:(NSString *)key {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(0)] floatValue];
}

- (float)rcrncall_getFloat:(NSString *)key defaultValue:(float)defaultValue {
    return [[self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:@(defaultValue)] floatValue];
}

- (nullable NSNumber *)rcrncall_getNumber:(NSString *)key {
    return [self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:nil];
}

- (nullable NSNumber *)rcrncall_getNumber:(NSString *)key defaultValue:(nullable NSNumber *)defaultValue {
    return [self rcrncall_getValue:[NSNumber class] forKey:key defaultValue:defaultValue];
}

- (nullable NSString *)rcrncall_getString:(NSString *)key {
    return [self rcrncall_getValue:[NSString class] forKey:key defaultValue:nil];
}

- (nullable NSString *)rcrncall_getString:(NSString *)key defaultValue:(nullable NSString *)defaultValue {
    return [self rcrncall_getValue:[NSString class] forKey:key defaultValue:defaultValue];
}

- (nullable NSDictionary *)rcrncall_getDictionary:(NSString *)key {
    return [self rcrncall_getValue:[NSDictionary class] forKey:key defaultValue:[NSDictionary new]];
}

- (nullable NSArray *)rcrncall_getArray:(NSString *)key {
    return [self rcrncall_getValue:[NSArray class] forKey:key defaultValue:nil];
}


@end
