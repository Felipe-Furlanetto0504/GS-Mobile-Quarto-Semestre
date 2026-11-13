import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { molas } from '../theme';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

export function Pressionavel({
  style,
  escala = 0.97,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...props
}) {
  const apertado = useSharedValue(1);
  const estiloAnimado = useAnimatedStyle(() => ({ transform: [{ scale: apertado.value }] }));

  return (
    <PressableAnimado
      {...props}
      disabled={disabled}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      accessibilityState={{ disabled: !!disabled, ...props.accessibilityState }}
      onPressIn={(e) => {
        apertado.value = withSpring(escala, molas.toque);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        apertado.value = withSpring(1, molas.toque);
        onPressOut?.(e);
      }}
      style={[style, estiloAnimado]}
    >
      {children}
    </PressableAnimado>
  );
}
