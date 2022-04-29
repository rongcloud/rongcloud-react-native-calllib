package cn.rongcloud.rn.call;

import android.view.View;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;

import cn.rongcloud.call.wrapper.RCCallIWEngine;
import cn.rongcloud.call.wrapper.config.RCCallIWBeautyOption;
import cn.rongcloud.call.wrapper.config.RCCallIWCamera;
import cn.rongcloud.call.wrapper.model.RCCallIWCallSession;
import cn.rongcloud.rtc.utils.FinLog;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

public class RCReactNativeCallModule extends ReactContextBaseJavaModule {

	private static final String TAG = "RCReactNativeCallModule";
	private final ReactApplicationContext reactContext;

    public RCReactNativeCallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return "RCReactNativeCall";
    }

	@ReactMethod
	public void init(ReadableMap config) {
		RCCallIWEngine.getInstance().setEngineListener(new RCCallIWEngineListenerImpl(reactContext));
	}

	@ReactMethod
	public void unInit() {
		RCCallIWEngine.getInstance().setEngineListener(null);
	}

	@ReactMethod
	public void setEngineConfig(ReadableMap config) {
		FinLog.d(TAG, "[setEngineConfig] ==> config:" + config);
		RCCallIWEngine.getInstance().setEngineConfig(ArgumentAdapter.toRCCallIWEngineConfig(config));
	}

	@ReactMethod
	public void setPushConfig(ReadableMap callPushConfig, ReadableMap hangupPushConfig) {
		FinLog.d(TAG, "[setPushConfig] ==> callPushConfig:" + callPushConfig + "," + "hangupPushConfig:" + hangupPushConfig);
		RCCallIWEngine.getInstance().setPushConfig(ArgumentAdapter.toRCCallIWPushConfig(callPushConfig), ArgumentAdapter.toRCCallIWPushConfig(hangupPushConfig));
	}

	@ReactMethod
	public void setAudioConfig(ReadableMap config) {
		FinLog.d(TAG, "[setAudioConfig] ==> config:" + config);
		RCCallIWEngine.getInstance().setAudioConfig(ArgumentAdapter.toRCCallIWAudioConfig(config));
	}

	@ReactMethod
	public void setVideoConfig(ReadableMap config) {
		FinLog.d(TAG, "[setVideoConfig] ==> config:" + config);
		RCCallIWEngine.getInstance().setVideoConfig(ArgumentAdapter.toRCCallIWVideoConfig(config));
	}

	@ReactMethod
	public void startSingleCall(String userId, int type, String extra, Promise promise) {
		FinLog.d(TAG, "[startSingleCall] ==> userId:" + userId + "," + "type:" + type + "," + "extra:" + extra + "," + "promise:" + promise);
		RCCallIWCallSession result = RCCallIWEngine.getInstance().startCall(userId, ArgumentAdapter.toRCCallIWMediaType(type), extra);
		promise.resolve(ArgumentAdapter.fromRCCallIWCallSession(result));
	}

	@ReactMethod
	public void startGroupCall(String groupId, ReadableArray userIds, ReadableArray observerUserIds, int type, String extra, Promise promise) {
		FinLog.d(TAG,
			"[startGroupCall] ==> groupId:" + groupId + "," + "userIds:" + userIds + "," + "observerUserIds:" + observerUserIds + "," + "type:" + type + "," + "extra:" + extra + "," + "promise:"
				+ promise);
		RCCallIWCallSession result = RCCallIWEngine.getInstance().startCall(groupId, ArgumentAdapter.toStringList(userIds), ArgumentAdapter.toStringList(observerUserIds), ArgumentAdapter.toRCCallIWMediaType(type), extra);
		promise.resolve(ArgumentAdapter.fromRCCallIWCallSession(result));
	}

	@ReactMethod
	public void accept() {
		FinLog.d(TAG, "[accept] ==> ");
		RCCallIWEngine.getInstance().accept();
	}

	@ReactMethod
	public void hangup() {
		FinLog.d(TAG, "[hangup] ==> ");
		RCCallIWEngine.getInstance().hangup();
	}

	@ReactMethod
	public void enableMicrophone(boolean enable) {
		FinLog.d(TAG, "[enableMicrophone] ==> enable:" + enable);
		RCCallIWEngine.getInstance().enableMicrophone(enable);
	}

	@ReactMethod
	public void isEnableMicrophone(Promise promise) {
		FinLog.d(TAG, "[isEnableMicrophone] ==>  ");
		boolean result = RCCallIWEngine.getInstance().isEnableMicrophone();
		promise.resolve(result);
	}

	@ReactMethod
	public void enableSpeaker(boolean enable) {
		FinLog.d(TAG, "[enableSpeaker] ==> enable:" + enable);
		RCCallIWEngine.getInstance().enableSpeaker(enable);
	}

	@ReactMethod
	public void isEnableSpeaker(Promise promise) {
		FinLog.d(TAG, "[isEnableSpeaker] ==>  ");
		boolean result = RCCallIWEngine.getInstance().isEnableSpeaker();
		promise.resolve(result);
	}

	@ReactMethod
	public void enableCamera(boolean enable, int camera) {
		FinLog.d(TAG, "[enableCamera] ==> enable:" + enable + "," + "camera:" + camera);
		RCCallIWEngine.getInstance().enableCamera(enable, ArgumentAdapter.toRCCallIWCamera(camera));
	}

	@ReactMethod
	public void isEnableCamera(Promise promise) {
		FinLog.d(TAG, "[isEnableCamera] ==>  ");
		boolean result = RCCallIWEngine.getInstance().isEnableCamera();
		promise.resolve(result);
	}

	@ReactMethod
	public void currentCamera(Promise promise) {
		FinLog.d(TAG, "[currentCamera] ==>  ");
		RCCallIWCamera result = RCCallIWEngine.getInstance().currentCamera();
		promise.resolve(result.ordinal());
	}

	@ReactMethod
	public void switchCamera() {
		FinLog.d(TAG, "[switchCamera] ==>  ");
		RCCallIWEngine.getInstance().switchCamera();
	}

	@ReactMethod
	public void setVideoView(final String userId, final int viewId, final int type, final boolean isZOrderOnTop) {
		FinLog.d(TAG, "[setVideoView] ==> userId:" + userId + "," + "viewId:" + viewId + "," + "type:" + type);
		UIManagerModule manager = reactContext.getNativeModule(UIManagerModule.class);
		assert manager != null;
		manager.addUIBlock(new UIBlock() {
			@Override
			public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
				FinLog.d(TAG, "[addUIBlock] ==> userId:" + userId + "," + "viewId:" + viewId + "," + "type:" + type);
				View view = nativeViewHierarchyManager.resolveView(viewId);
				RCCallIWEngine.getInstance().setVideoView(userId, (FrameLayout) view, ArgumentAdapter.toRCCallIWViewFitType(type), isZOrderOnTop);
			}
		});
	}

	@ReactMethod
	public void getCurrentCallSession(Promise promise) {
		RCCallIWCallSession session = RCCallIWEngine.getInstance().getCurrentCallSession();
		promise.resolve(ArgumentAdapter.fromRCCallIWCallSession(session));
	}

	@ReactMethod
	public void changeMediaType(int type) {
		FinLog.d(TAG, "[changeMediaType] ==> type:" + type);
		RCCallIWEngine.getInstance().changeMediaType(ArgumentAdapter.toRCCallIWMediaType(type));
	}

	@ReactMethod
	public void inviteUsers(ReadableArray userIds, ReadableArray observerUserIds) {
		FinLog.d(TAG, "[inviteUsers] ==> userIds:" + userIds + "," + "observerUserIds:" + observerUserIds);
		RCCallIWEngine.getInstance().inviteUsers(ArgumentAdapter.toStringList(userIds), ArgumentAdapter.toStringList(observerUserIds));
	}

	@ReactMethod
	public void setBeautyOption(boolean enable, ReadableMap option) {
		FinLog.d(TAG, "[setBeautyOption] ==> enable:" + enable + ",option" + option);
		RCCallIWEngine.getInstance().setBeautyOption(enable, ArgumentAdapter.toRCCallIWBeautyOption(option));
	}

	@ReactMethod
	public void getCurrentBeautyOption(Promise promise) {
		RCCallIWBeautyOption option = RCCallIWEngine.getInstance().getCurrentBeautyOption();
		promise.resolve(ArgumentAdapter.fromRCCallIWBeautyOption(option));
	}

	@ReactMethod
	public void setBeautyFilter(int filter) {
		FinLog.d(TAG, "[setBeautyFilter] ==> filter:" + filter);
		RCCallIWEngine.getInstance().setBeautyFilter(ArgumentAdapter.toRCCallIWBeautyFilter(filter));
	}

	@ReactMethod
	public void getCurrentBeautyFilter(Promise promise) {
    	promise.resolve(RCCallIWEngine.getInstance().getCurrentBeautyFilter().ordinal());
	}

	@ReactMethod
	public void resetBeauty() {
		RCCallIWEngine.getInstance().resetBeauty();
	}
}