package cn.rongcloud.rn.call;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.FrameLayout;

/**
 * @author panmingda
 * @date 2021/8/4
 */
public class RCReactNativeFrameLayout extends FrameLayout {

    public RCReactNativeFrameLayout(Context context) {
        super(context);
    }

    public RCReactNativeFrameLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public RCReactNativeFrameLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(new Runnable() {
            @Override
            public void run() {
                measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
                layout(getLeft(), getTop(), getRight(), getBottom());
            }
        });
    }
}
