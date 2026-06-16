/**
 * Settings Screen 스타일
 */

import { StyleSheet, Platform } from 'react-native';

import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 100,
  },
  headerSafeArea: {
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  inputGroup: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  charCount: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  helperText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  previewSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  previewCard: {
    marginTop: 12,
    backgroundColor: '#111',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  previewAgency: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
  },
  previewWatermarkLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  previewWatermarkRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'flex-end',
  },
  watermarkTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
