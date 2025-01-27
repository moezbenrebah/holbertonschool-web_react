import { getFilteredNotifications } from '../selectors/notificationSelector';


describe('getFilteredNotifications selector', () => {
  const mockState = {
    notifications: {
      notifications: [
        {
          id: '1',
          type: 'urgent',
          isRead: false,
          value: 'System shutdown scheduled'
        },
        {
          id: '3',
          type: 'default',
          isRead: false,
          value: 'New course available'
        },
        {
          id: '5',
          type: 'urgent',
          isRead: false,
          value: 'Network outage detected'
        }
      ]
    }
  };

  test('returns all notifications when filter is "all"', () => {
    const result = getFilteredNotifications(mockState, 'all');
    expect(result).toEqual([
      expect.objectContaining({ id: '1' }),
      expect.objectContaining({ id: '3' }),
      expect.objectContaining({ id: '5' })
    ]);
  });

  test('returns only urgent notifications when filter is "urgent"', () => {
    const result = getFilteredNotifications(mockState, 'urgent');
    expect(result).toEqual([
      expect.objectContaining({ id: '1', type: 'urgent' }),
      expect.objectContaining({ id: '5', type: 'urgent' })
    ]);
  });

  test('returns only default notifications when filter is "default"', () => {
    const result = getFilteredNotifications(mockState, 'default');
    expect(result).toEqual([
      expect.objectContaining({ id: '3', type: 'default' })
    ]);
  });

  test('returns empty array when no notifications match filter', () => {
    const emptyState = { notifications: { notifications: [] } };
    const result = getFilteredNotifications(emptyState, 'all');
    expect(result).toEqual([]);
  });

  test('memoizes results properly', () => {
    const result1 = getFilteredNotifications(mockState, 'urgent');
    const result2 = getFilteredNotifications(mockState, 'urgent');
    expect(result1).toBe(result2);

    const result3 = getFilteredNotifications(mockState, 'default');
    expect(result1).not.toBe(result3);
  });
});