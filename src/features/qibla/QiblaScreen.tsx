import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../../theme';
import { calculateQiblaAngle, calculateDistanceToKaaba } from './qiblaUtils';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.75;

export default function QiblaScreen() {
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const lastHeading = useRef(0);

  useEffect(() => {
    let subscription: any;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni gerekli');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setQiblaAngle(calculateQiblaAngle(latitude, longitude));
      setDistance(calculateDistanceToKaaba(latitude, longitude));

      const isAvailable = await Magnetometer.isAvailableAsync();
      if (!isAvailable) {
        setErrorMsg('Bu cihazda pusula sensörü bulunamadı');
        return;
      }

      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (Platform.OS === 'ios') {
          angle = angle + 90;
        }
        angle = (angle + 360) % 360;
        setHeading(Math.round(angle));
      });
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const target = -heading;
    let delta = target - lastHeading.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const newVal = lastHeading.current + delta;
    lastHeading.current = newVal;

    Animated.spring(animatedRotation, {
      toValue: newVal,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [heading]);

  const rotation = animatedRotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const isAligned =
    qiblaAngle !== null && Math.abs(heading - qiblaAngle) < 5;

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}°</Text>
      {qiblaAngle !== null && (
        <Text style={styles.qiblaInfo}>Kıble açısı: {Math.round(qiblaAngle)}°</Text>
      )}

      <View style={styles.compassWrapper}>
        <Animated.View
          style={[
            styles.compass,
            { transform: [{ rotate: rotation }] },
          ]}
        >
          <View style={styles.compassInner}>
            <Text style={styles.north}>N</Text>
            <View style={styles.compassCenter}>
              <Text style={styles.east}>E</Text>
              <View style={styles.dot} />
              <Text style={styles.west}>W</Text>
            </View>
            <Text style={styles.south}>S</Text>
          </View>

          {qiblaAngle !== null && (
            <View
              style={[
                styles.qiblaIndicator,
                {
                  transform: [
                    { rotate: `${qiblaAngle}deg` },
                    { translateY: -COMPASS_SIZE / 2 + 20 },
                  ],
                },
              ]}
            >
              <Text style={styles.kaaba}>🕋</Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.needleWrapper}>
          <View style={styles.needle} />
        </View>
      </View>

      {isAligned && (
        <Text style={styles.aligned}>Kıble yönündesiniz!</Text>
      )}

      {distance !== null && (
        <Text style={styles.distance}>
          Kabe'ye uzaklık: {distance.toLocaleString('tr-TR')} km
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  error: { ...typography.body, color: colors.error, textAlign: 'center' },
  heading: { ...typography.h1, color: colors.primary, marginBottom: spacing.xs },
  qiblaInfo: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  compassWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  compassInner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  north: { ...typography.h2, color: colors.primary, fontWeight: '700', position: 'absolute', top: 12 },
  south: { ...typography.body, color: colors.textSecondary, position: 'absolute', bottom: 12 },
  compassCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: COMPASS_SIZE - 60,
  },
  east: { ...typography.body, color: colors.textSecondary },
  west: { ...typography.body, color: colors.textSecondary },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  qiblaIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaaba: { fontSize: 28 },
  needleWrapper: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: COMPASS_SIZE,
  },
  needle: {
    width: 3,
    height: 24,
    backgroundColor: colors.error,
    borderRadius: 2,
  },
  aligned: {
    ...typography.h3,
    color: colors.success,
    marginTop: spacing.lg,
    fontWeight: '700',
  },
  distance: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
