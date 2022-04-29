package cn.rongcloud.rn.call;

import androidx.annotation.NonNull;
import cn.rongcloud.call.wrapper.config.RCCallIWAndroidPushConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWAudioCodecType;
import cn.rongcloud.call.wrapper.config.RCCallIWAudioConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWBeautyFilter;
import cn.rongcloud.call.wrapper.config.RCCallIWBeautyOption;
import cn.rongcloud.call.wrapper.config.RCCallIWCamera;
import cn.rongcloud.call.wrapper.config.RCCallIWCameraOrientation;
import cn.rongcloud.call.wrapper.config.RCCallIWEngineConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWEngineConfig.Builder;
import cn.rongcloud.call.wrapper.config.RCCallIWIOSPushConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWImportanceHW;
import cn.rongcloud.call.wrapper.config.RCCallIWMediaType;
import cn.rongcloud.call.wrapper.config.RCCallIWPushConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWVideoBitrateMode;
import cn.rongcloud.call.wrapper.config.RCCallIWVideoConfig;
import cn.rongcloud.call.wrapper.config.RCCallIWVideoProfile;
import cn.rongcloud.call.wrapper.config.RCCallIWViewFitType;
import cn.rongcloud.call.wrapper.model.RCCallIWCallSession;
import cn.rongcloud.call.wrapper.model.RCCallIWUserProfile;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wangw on 2021/7/22.
 */
final class ArgumentAdapter {



	private static int getInt(@NonNull ReadableMap map, String key, int defaultValue) {
		if (map.hasKey(key)) {
			return map.getInt(key);
		}
		return defaultValue;
	}

	private static boolean getBoolean(@NonNull ReadableMap map, String key, boolean defaultValue) {
		if (map.hasKey(key)) {
			return map.getBoolean(key);
		}
		return defaultValue;
	}

	public static WritableMap fromRCCallIWUserProfile(@NonNull RCCallIWUserProfile rcCallIWUserProfile) {
		WritableMap arguments = Arguments.createMap();
		if (rcCallIWUserProfile == null) {
			return arguments;
		}
		arguments.putInt("userType", rcCallIWUserProfile.getUserType().ordinal());
		arguments.putString("userId", rcCallIWUserProfile.getUserId());
		arguments.putInt("mediaType", rcCallIWUserProfile.getMediaType().ordinal());
		arguments.putString("mediaId", rcCallIWUserProfile.getMediaId());
		arguments.putBoolean("enableCamera", rcCallIWUserProfile.isEnableCamera());
		arguments.putBoolean("enableMicrophone", rcCallIWUserProfile.isEnableMicrophone());
		return arguments;
	}

	public static WritableMap fromRCCallIWCallSession(@NonNull RCCallIWCallSession rcCallIWCallSession) {
		WritableMap arguments = Arguments.createMap();
		if (rcCallIWCallSession == null)
			return arguments;
		arguments.putInt("callType", rcCallIWCallSession.getCallType().ordinal());
		arguments.putInt("mediaType", rcCallIWCallSession.getMediaType().ordinal());
		arguments.putString("callId", rcCallIWCallSession.getCallId());
		arguments.putString("targetId", rcCallIWCallSession.getTargetId());
		arguments.putString("sessionId", rcCallIWCallSession.getSessionId());
		arguments.putString("extra", rcCallIWCallSession.getExtra());
		arguments.putDouble("startTime", rcCallIWCallSession.getStartTime());
		arguments.putDouble("connectedTime", rcCallIWCallSession.getConnectedTime());
		arguments.putDouble("endTime", rcCallIWCallSession.getEndTime());
		arguments.putMap("caller", fromRCCallIWUserProfile(rcCallIWCallSession.getCaller()));
		arguments.putMap("inviter", fromRCCallIWUserProfile(rcCallIWCallSession.getInviter()));
		arguments.putMap("mine", fromRCCallIWUserProfile(rcCallIWCallSession.getMine()));
		arguments.putArray("users", fromUserProfileList(rcCallIWCallSession.getUsers()));
		return arguments;
	}

	private static WritableArray fromUserProfileList(List<RCCallIWUserProfile> users) {
		WritableArray res = Arguments.createArray();
		if (users == null || users.isEmpty())
			return res;
		for (RCCallIWUserProfile user : users) {
			res.pushMap(fromRCCallIWUserProfile(user));
		}
		return res;
	}

	public static WritableMap fromRCCallIWBeautyOption(RCCallIWBeautyOption option) {

		WritableMap arguments = Arguments.createMap();
		if (option == null) {
			return arguments;
		}
		arguments.putInt("whitenessLevel", option.getWhitenessLevel());
		arguments.putInt("smoothLevel", option.getSmoothLevel());
		arguments.putInt("ruddyLevel", option.getRuddyLevel());
		arguments.putInt("brightLevel", option.getBrightLevel());
		return arguments;
	}

	public static RCCallIWEngineConfig toRCCallIWEngineConfig(ReadableMap config) {
		if (config == null)
			return null;
		Builder builder = Builder.create();
		if (config.hasKey("enableAutoReconnect")) {
			builder.withEnableAutoReconnect(config.getBoolean("enableAutoReconnect"));
		}
		if (config.hasKey("statusReportInterval")) {
			builder.withStatusReportInterval(config.getInt("statusReportInterval"));
		}
		return builder.build();
	}

	public static RCCallIWIOSPushConfig toRCCallIWIOSPushConfig(ReadableMap map) {
		if (map == null) {
			return null;
		}

		RCCallIWIOSPushConfig.Builder builder = RCCallIWIOSPushConfig.Builder.create();
		if (map.hasKey("threadId")) {
			builder.withThreadId(map.getString("threadId"));
		}
		if (map.hasKey("apnsCollapseId")) {
			builder.withApnsCollapseId(map.getString("apnsCollapseId"));
		}
		if (map.hasKey("category")) {
			builder.withCategory(map.getString("category"));
		}
		if (map.hasKey("richMediaUri")) {
			builder.withRichMediaUri(map.getString("richMediaUri"));
		}
		return builder.build();
	}

	public static RCCallIWAndroidPushConfig toRCCallIWAndroidPushConfig(ReadableMap map) {
		if (map == null) {
			return null;
		}

		RCCallIWAndroidPushConfig.Builder builder = RCCallIWAndroidPushConfig.Builder.create();
		if (map.hasKey("notificationId")) {
			builder.withNotificationId(map.getString("notificationId"));
		}
		if (map.hasKey("channelIdMi")) {
			builder.withChannelIdMi(map.getString("channelIdMi"));
		}
		if (map.hasKey("channelIdHW")) {
			builder.withChannelIdHW(map.getString("channelIdHW"));
		}
		if (map.hasKey("channelIdOPPO")) {
			builder.withChannelIdOPPO(map.getString("channelIdOPPO"));
		}
		if (map.hasKey("typeVivo")) {
			builder.withTypeVivo(map.getString("typeVivo"));
		}
		if (map.hasKey("collapseKeyFCM")) {
			builder.withCollapseKeyFCM(map.getString("collapseKeyFCM"));
		}
		if (map.hasKey("imageUrlFCM")) {
			builder.withImageUrlFCM(map.getString("imageUrlFCM"));
		}
		if (map.hasKey("importanceHW")) {
			builder.withImportanceHW(toRCCallIWImportanceHW(map.getInt("importanceHW")));
		}
		return builder.build();
	}

	public static RCCallIWImportanceHW toRCCallIWImportanceHW(int index) {
		return RCCallIWImportanceHW.values()[index];
	}

	public static RCCallIWPushConfig toRCCallIWPushConfig(ReadableMap map) {
		if (map == null) {
			return null;
		}

		RCCallIWPushConfig.Builder builder = RCCallIWPushConfig.Builder.create();
		if (map.hasKey("templateId")) {
			builder.withTemplateId(map.getString("templateId"));
		}
		if (map.hasKey("title")) {
			builder.withTitle(map.getString("title"));
		}
		if (map.hasKey("content")) {
			builder.withContent(map.getString("content"));
		}
		if (map.hasKey("data")) {
			builder.withData(map.getString("data"));
		}
		if (map.hasKey("disableTitle")) {
			builder.withDisableTitle(map.getBoolean("disableTitle"));
		}
		if (map.hasKey("forceShowDetailContent")) {
			builder.withForceShowDetailContent(map.getBoolean("forceShowDetailContent"));
		}
		if (map.hasKey("iOSConfig")) {
			builder.withIOSConfig(toRCCallIWIOSPushConfig(map.getMap("iOSConfig")));
		}
		if (map.hasKey("androidConfig")) {
			builder.withAndroidConfig(toRCCallIWAndroidPushConfig(map.getMap("androidConfig")));
		}
		return builder.build();

	}

	public static RCCallIWAudioConfig toRCCallIWAudioConfig(ReadableMap map) {
		if (map == null) {
			return null;
		}

		RCCallIWAudioConfig.Builder builder = RCCallIWAudioConfig.Builder.create();
		if (map.hasKey("enableMicrophone")) {
			builder.withEnableMicrophone(map.getBoolean("enableMicrophone"));
		}
		if (map.hasKey("enableStereo")) {
			builder.withEnableStereo(map.getBoolean("enableStereo"));
		}
		if (map.hasKey("audioSource")) {
			builder.withAudioSource(map.getInt("audioSource"));
		}
		if (map.hasKey("audioBitrate")) {
			builder.withAudioBitrate(map.getInt("audioBitrate"));
		}
		if (map.hasKey("audioSampleRate")) {
			builder.withAudioSampleRate(map.getInt("audioSampleRate"));
		}
		if (map.hasKey("type")) {
			builder.withType(toRCCallIWAudioCodecType(map.getInt("type")));
		}
		return builder.build();

	}

	public static RCCallIWAudioCodecType toRCCallIWAudioCodecType(int index) {
		return RCCallIWAudioCodecType.values()[index];
	}

	public static RCCallIWVideoConfig toRCCallIWVideoConfig(ReadableMap map) {
		if (map == null) {
			return null;
		}

		RCCallIWVideoConfig.Builder builder = RCCallIWVideoConfig.Builder.create();
		if (map.hasKey("enableHardwareDecoder")) {
			builder.withEnableHardwareDecoder(map.getBoolean("enableHardwareDecoder"));
		}
		if (map.hasKey("hardwareDecoderColor")) {
			builder.withHardwareDecoderColor(map.getInt("hardwareDecoderColor"));
		}
		if (map.hasKey("enableHardwareEncoder")) {
			builder.withEnableHardwareEncoder(map.getBoolean("enableHardwareEncoder"));
		}
		if (map.hasKey("enableHardwareEncoderHighProfile")) {
			builder.withEnableHardwareEncoderHighProfile(map.getBoolean("enableHardwareEncoderHighProfile"));
		}
		if (map.hasKey("enableEncoderTexture")) {
			builder.withEnableEncoderTexture(map.getBoolean("enableEncoderTexture"));
		}
		if (map.hasKey("hardWareEncoderColor")) {
			builder.withHardWareEncoderColor(map.getInt("hardWareEncoderColor"));
		}
		if (map.hasKey("hardWareEncoderFrameRate")) {
			builder.withHardWareEncoderFrameRate(map.getInt("hardWareEncoderFrameRate"));
		}
		if (map.hasKey("hardwareEncoderBitrateMode")) {
			builder.withHardwareEncoderBitrateMode(toRCCallIWVideoBitrateMode(map.getInt("hardwareEncoderBitrateMode")));
		}
		if (map.hasKey("profile")) {
			builder.withProfile(toRCCallIWVideoProfile(map.getInt("profile")));
		}
		if (map.hasKey("defaultCamera")) {
			builder.withDefaultCamera(toRCCallIWCamera(map.getInt("defaultCamera")));
		}
		if (map.hasKey("cameraOrientation")) {
			builder.withCameraOrientation(toRCCallIWCameraOrientation(map.getInt("cameraOrientation")));
		}
		if (map.hasKey("isPreviewMirror")) {
			builder.withPreviewMirror(map.getBoolean("isPreviewMirror"));
		}
		return builder.build();
	}

	public static RCCallIWCameraOrientation toRCCallIWCameraOrientation(int index) {
		return RCCallIWCameraOrientation.values()[index];
	}

	public static RCCallIWCamera toRCCallIWCamera(int index) {
		return RCCallIWCamera.values()[index];
	}

	public static RCCallIWVideoProfile toRCCallIWVideoProfile(int index) {
		return RCCallIWVideoProfile.values()[index];
	}

	public static RCCallIWVideoBitrateMode toRCCallIWVideoBitrateMode(int index) {
		return RCCallIWVideoBitrateMode.values()[index];
	}

	public static RCCallIWMediaType toRCCallIWMediaType(int index) {
		return RCCallIWMediaType.values()[index];
	}

	public static List<String> toStringList(ReadableArray userIds) {
		if (userIds == null)
			return null;
		ArrayList<String> list = new ArrayList<>();
		for (int i = 0; i < userIds.size(); i++) {
			list.add(userIds.getString(i));
		}
		return list;
	}

	public static RCCallIWViewFitType toRCCallIWViewFitType(int index) {
		return RCCallIWViewFitType.values()[index];
	}

	public static RCCallIWBeautyOption toRCCallIWBeautyOption(ReadableMap option) {
		if (option == null) {
			return null;
		}
		RCCallIWBeautyOption beautyOption = new RCCallIWBeautyOption();
		if (option.hasKey("whitenessLevel")) {
			beautyOption.setWhitenessLevel(option.getInt("whitenessLevel"));
		}
		if (option.hasKey("smoothLevel")) {
			beautyOption.setSmoothLevel(option.getInt("smoothLevel"));
		}
		if (option.hasKey("ruddyLevel")) {
			beautyOption.setRuddyLevel(option.getInt("ruddyLevel"));
		}
		if (option.hasKey("brightLevel")) {
			beautyOption.setBrightLevel(option.getInt("brightLevel"));
		}
		return beautyOption;
	}

	public static RCCallIWBeautyFilter toRCCallIWBeautyFilter(@NonNull int filter) {
		return RCCallIWBeautyFilter.values()[filter];
	}
}
