import poiDataSubject from '../../api/POIDataSubject';

describe('POIDataSubject', () => {
  beforeEach(() => {
    // Reset the POIDataSubject instance before each test
    poiDataSubject.data = {
      coffeeShops: [],
      restaurants: [],
      activities: [],
      lastRegion: null,
      lastFetchTime: 0,
    };
    poiDataSubject.observers = [];
    poiDataSubject.isLoading = false;
  });

  describe('subscribe', () => {
    test('should add observer and immediately notify with current data', () => {
      const mockObserver = jest.fn();
      poiDataSubject.subscribe(mockObserver);
      
      expect(mockObserver).toHaveBeenCalledWith(poiDataSubject.data, false);
      expect(poiDataSubject.observers).toContain(mockObserver);
    });

    test('should return unsubscribe function that removes observer', () => {
      const mockObserver = jest.fn();
      const unsubscribe = poiDataSubject.subscribe(mockObserver);
      
      expect(poiDataSubject.observers).toHaveLength(1);
      unsubscribe();
      expect(poiDataSubject.observers).toHaveLength(0);
    });

    test('should handle invalid observer gracefully', () => {
      const invalidObserver = 'not a function';
      const unsubscribe = poiDataSubject.subscribe(invalidObserver);
      
      expect(poiDataSubject.observers).toHaveLength(0);
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('updateData', () => {
    test('should update data and notify observers', () => {
      const mockObserver1 = jest.fn();
      const mockObserver2 = jest.fn();
      poiDataSubject.subscribe(mockObserver1);
      poiDataSubject.subscribe(mockObserver2);

      const newData = {
        coffeeShops: [{ id: 1, name: 'Test Coffee' }],
      };

      poiDataSubject.updateData(newData);

      expect(poiDataSubject.data.coffeeShops).toEqual(newData.coffeeShops);
      expect(mockObserver1).toHaveBeenCalledWith(poiDataSubject.data, false);
      expect(mockObserver2).toHaveBeenCalledWith(poiDataSubject.data, false);
    });
  });

  describe('setLoading', () => {
    test('should update loading state and notify observers', () => {
      const mockObserver = jest.fn();
      poiDataSubject.subscribe(mockObserver);

      poiDataSubject.setLoading(true);
      
      expect(poiDataSubject.isLoading).toBe(true);
      expect(mockObserver).toHaveBeenLastCalledWith(poiDataSubject.data, true);

      poiDataSubject.setLoading(false);
      
      expect(poiDataSubject.isLoading).toBe(false);
      expect(mockObserver).toHaveBeenLastCalledWith(poiDataSubject.data, false);
    });
  });

  describe('getData', () => {
    test('should return current data', () => {
      const testData = {
        coffeeShops: [{ id: 1 }],
        restaurants: [{ id: 2 }],
      };
      poiDataSubject.updateData(testData);
      
      const result = poiDataSubject.getData();
      
      expect(result).toEqual(expect.objectContaining(testData));
    });
  });

  describe('hasRegionChanged', () => {
    test('should return true when no lastRegion exists', () => {
      const newRegion = { latitude: 45.0, longitude: -73.0 };
      expect(poiDataSubject.hasRegionChanged(newRegion)).toBe(true);
    });

    test('should return true when region change exceeds threshold', () => {
      poiDataSubject.data.lastRegion = { latitude: 45.0, longitude: -73.0 };
      const newRegion = { latitude: 45.006, longitude: -73.0 }; // > 0.005 difference
      
      expect(poiDataSubject.hasRegionChanged(newRegion)).toBe(true);
    });

    test('should return false when region change is within threshold', () => {
      poiDataSubject.data.lastRegion = { latitude: 45.0, longitude: -73.0 };
      const newRegion = { latitude: 45.004, longitude: -73.0 }; // < 0.005 difference
      
      expect(poiDataSubject.hasRegionChanged(newRegion)).toBe(false);
    });

    test('should return true when newRegion is null', () => {
      poiDataSubject.data.lastRegion = { latitude: 45.0, longitude: -73.0 };
      expect(poiDataSubject.hasRegionChanged(null)).toBe(true);
    });
  });
});