package cn.rongcloud.rn.call;

import android.widget.FrameLayout;

import androidx.annotation.Nullable;

import cn.rongcloud.rtc.utils.FinLog;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

/**
 * Created by wangw on 2021/7/22.
 */
public class RCReactNativeCallViewManager extends SimpleViewManager<RCReactNativeFrameLayout> {

    private static final String TAG = "RCReactNativeCallViewManager";

    @Override
    public String getName() {
        return "RCReactNativeCallVideoView";
    }

    @Override
    protected RCReactNativeFrameLayout createViewInstance(ThemedReactContext themedReactContext) {
        RCReactNativeFrameLayout frameLayout = new RCReactNativeFrameLayout(themedReactContext);
        FinLog.d(TAG, "[createViewInstance] ==> frameLayout:" + frameLayout);
        return frameLayout;
    }

}
