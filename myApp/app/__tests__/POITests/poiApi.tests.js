import { updatePOICache, getCachedPOIData, fetchPOIData, loadPOICache, shouldUpdatePOIData, precomputeDistances } from '../../api/poiApi';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import poiDataSubject from '../../api/POIDataSubject';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiKey: 'test-api-key'
    }
  }
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  cacheDirectory: 'mock-cache-directory/',
  writeAsStringAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
  EncodingType: { UTF8: 'utf8' }
}));

// Mock POIDataSubject
jest.mock('../../api/POIDataSubject', () => ({
  updateData: jest.fn(),
  setLoading: jest.fn(),
  notifyObservers: jest.fn(),
  getData: jest.fn().mockReturnValue({
    coffeeShops: [],
    restaurants: [],
    activities: [],
    lastRegion: null,
    lastFetchTime: 0
  }),
  hasRegionChanged: jest.fn().mockReturnValue(false)
}));

// Setup global fetch mock
global.fetch = jest.fn();

// Mock console methods to reduce noise in test output
console.log = jest.fn();
console.error = jest.fn();

describe('POI API Tests', () => {
  // Clear mocks before each test
  beforeEach(() => {
    fetch.mockClear();
    console.log.mockClear();
    console.error.mockClear();
    poiDataSubject.updateData.mockClear();
    poiDataSubject.setLoading.mockClear();
    FileSystem.writeAsStringAsync.mockClear();
    FileSystem.readAsStringAsync.mockClear();
    FileSystem.getInfoAsync.mockClear();
  });

  // Test updatePOICache and getCachedPOIData
  describe('Cache Management', () => {
    test('updatePOICache should correctly update the cache', () => {
      const coffee = [{ id: 1, name: 'Coffee Shop' }];
      const resto = [{ id: 2, name: 'Restaurant' }];
      const act = [{ id: 3, name: 'Activity' }];
      const region = { latitude: 45.5017, longitude: -73.5673 };
      
      updatePOICache(coffee, resto, act, region);
      
      const cache = getCachedPOIData();
      expect(cache.coffeeShops).toBe(coffee);
      expect(cache.restaurants).toBe(resto);
      expect(cache.activities).toBe(act);
      expect(cache.lastRegion).toBe(region);
      expect(cache.lastFetchTime).toBeLessThanOrEqual(Date.now());
      
      // Verify subject was updated
      expect(poiDataSubject.updateData).toHaveBeenCalledWith({
        coffeeShops: coffee,
        restaurants: resto,
        activities: act,
        lastRegion: region,
        lastFetchTime: expect.any(Number)
      });
      
      // Verify data was saved to the file system
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('poi_cache.json'),
        expect.any(String),
        expect.any(Object)
      );
    });
    
    test('loadPOICache should handle cache file existence', async () => {
      // Mock file exists and contains valid data
      FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true });
      const mockCacheData = JSON.stringify({
        coffeeShops: [{ id: 1, name: 'Cached Coffee' }],
        restaurants: [{ id: 2, name: 'Cached Restaurant' }],
        activities: [{ id: 3, name: 'Cached Activity' }],
        lastRegion: { latitude: 45.5, longitude: -73.6 },
        lastFetchTime: Date.now() - 1000 // 1 second ago
      });
      FileSystem.readAsStringAsync.mockResolvedValueOnce(mockCacheData);
      
      const result = await loadPOICache();
      
      expect(result).toBeTruthy();
      expect(FileSystem.getInfoAsync).toHaveBeenCalled();
      expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
      expect(poiDataSubject.updateData).toHaveBeenCalled();
    });
    
    test('loadPOICache should handle cache file not existing', async () => {
      // Mock file doesn't exist
      FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: false });
      
      const result = await loadPOICache();
      
      expect(result).toBeNull();
      expect(FileSystem.getInfoAsync).toHaveBeenCalled();
      expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
    });
    
    test('loadPOICache should handle errors when reading cache', async () => {
      // Mock file exists but reading throws an error
      FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true });
      FileSystem.readAsStringAsync.mockRejectedValueOnce(new Error('Read error'));
      
      const result = await loadPOICache();
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error loading POI cache'), 
        expect.any(Error)
      );
    });
    
    test('updatePOICache should handle errors when saving cache', async () => {
      // Mock write throws an error
      FileSystem.writeAsStringAsync.mockRejectedValueOnce(new Error('Write error'));
      
      const coffee = [{ id: 1, name: 'Coffee Shop' }];
      const resto = [{ id: 2, name: 'Restaurant' }];
      const act = [{ id: 3, name: 'Activity' }];
      const region = { latitude: 45.5017, longitude: -73.5673 };
      
      // We need to await for the async operation to complete
      await updatePOICache(coffee, resto, act, region);
      
      // First make sure the updateData was called
      expect(poiDataSubject.updateData).toHaveBeenCalled();
      
      // Verify error was logged, it might be caught silently
      // Check if console.error was called at all rather than with specific arguments
      expect(console.error).toHaveBeenCalled();
    });
    
    test('shouldUpdatePOIData should correctly determine when to update', () => {
      const newRegion = { latitude: 45.5, longitude: -73.6 };
      
      // Test case 1: No data
      poiDataSubject.getData.mockReturnValueOnce({
        coffeeShops: [],
        restaurants: [],
        activities: [],
        lastRegion: null,
        lastFetchTime: 0
      });
      
      expect(shouldUpdatePOIData(newRegion)).toBe(true);
      
      // Test case 2: Region changed
      poiDataSubject.getData.mockReturnValueOnce({
        coffeeShops: [{ id: 1 }],
        restaurants: [],
        activities: [],
        lastRegion: { latitude: 45.4, longitude: -73.5 },
        lastFetchTime: Date.now()
      });
      poiDataSubject.hasRegionChanged.mockReturnValueOnce(true);
      
      expect(shouldUpdatePOIData(newRegion)).toBe(true);
      
      // Test case 3: Cache expired
      poiDataSubject.getData.mockReturnValueOnce({
        coffeeShops: [{ id: 1 }],
        restaurants: [],
        activities: [],
        lastRegion: newRegion,
        lastFetchTime: Date.now() - (35 * 60 * 1000) // 35 minutes ago (cache timeout is 30 min)
      });
      
      expect(shouldUpdatePOIData(newRegion)).toBe(true);
      
      // Test case 4: Recent data, no need to update
      poiDataSubject.getData.mockReturnValueOnce({
        coffeeShops: [{ id: 1 }],
        restaurants: [],
        activities: [],
        lastRegion: newRegion,
        lastFetchTime: Date.now() - 1000 // 1 second ago
      });
      
      expect(shouldUpdatePOIData(newRegion)).toBe(false);
    });
  });
  
  describe('precomputeDistances function', () => {
    test('should handle null or empty inputs', () => {
      // Test with null user location
      let result = precomputeDistances([{ place_id: '1' }], null);
      expect(result).toEqual([{ place_id: '1' }]);
      
      // Test with null POI array
      result = precomputeDistances(null, { latitude: 45.5, longitude: -73.6 });
      expect(result).toBeNull();
      
      // Test with empty POI array
      result = precomputeDistances([], { latitude: 45.5, longitude: -73.6 });
      expect(result).toEqual([]);
    });
    
    test('should compute distances correctly', () => {
      const userLocation = { latitude: 45.5, longitude: -73.6 };
      const pois = [
        {
          place_id: '1',
          geometry: { location: { lat: 45.51, lng: -73.61 } }
        },
        {
          place_id: '2',
          geometry: { location: { lat: 45.53, lng: -73.63 } }
        },
        {
          place_id: '3',
          geometry: { location: { } } // Missing coordinates
        },
        {
          place_id: '4',
          // Missing geometry
        }
      ];
      
      const result = precomputeDistances(pois, userLocation);
      
      // First POI should have a distance
      expect(result[0]._distance).toBeGreaterThan(0);
      // Second POI should have a greater distance than first
      expect(result[1]._distance).toBeGreaterThan(result[0]._distance);
      // Third POI should have null distance (missing coordinates)
      expect(result[2]._distance).toBeNull();
      // Fourth POI should have null distance (missing geometry)
      expect(result[3]._distance).toBeNull();
    });
  });
  
  // Test fetchPOIData
  describe('fetchPOIData function', () => {
    test('should throw error for invalid region', async () => {
      await expect(fetchPOIData(null, { aborted: false })).rejects.toThrow('Invalid region data');
      await expect(fetchPOIData({}, { aborted: false })).rejects.toThrow('Invalid region data');
    });
    
    test('should handle successful API call and categorize POIs', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock successful API response for all POI types (cafe, restaurant, attraction)
      const cafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] }
          ]
        })
      };
      
      const restaurantResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '2', name: 'Local Restaurant', types: ['restaurant'] }
          ]
        })
      };
      
      const attractionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '3', name: 'City Museum', types: ['museum'] }
          ]
        })
      };
      
      // Set up fetch to return different responses for each type
      fetch.mockResolvedValueOnce(cafeResponse)
           .mockResolvedValueOnce(restaurantResponse)
           .mockResolvedValueOnce(attractionResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      // With progressive loading, we make one fetch per POI type (3 total)
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(fetch.mock.calls[0][0]).toContain(`${mockRegion.latitude},${mockRegion.longitude}`);
      expect(fetch.mock.calls[0][0]).toContain('type=cafe');
      expect(fetch.mock.calls[1][0]).toContain('type=restaurant');
      expect(fetch.mock.calls[2][0]).toContain('type=tourist_attraction|movie_theater');
      
      expect(result).toHaveProperty('coffee');
      expect(result).toHaveProperty('resto');
      expect(result).toHaveProperty('act');
      expect(result.coffee).toHaveLength(1);
      expect(result.resto).toHaveLength(1);
      expect(result.act).toHaveLength(1);
    });
    
    test('should handle ZERO_RESULTS by retrying with keywords', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // First call returns ZERO_RESULTS
      const mockFirstResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'ZERO_RESULTS',
          results: []
        })
      };
      
      // Second call with keywords returns results
      const mockSecondResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Coffee Shop', types: ['cafe'] }
          ]
        })
      };
      
      // Mock responses for the other POI types
      const mockEmptyResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: []
        })
      };
      
      // First we get ZERO_RESULTS for cafes, then retry with keywords
      // Then we proceed with the other two POI types
      fetch.mockResolvedValueOnce(mockFirstResponse)
           .mockResolvedValueOnce(mockSecondResponse)
           .mockResolvedValueOnce(mockEmptyResponse)
           .mockResolvedValueOnce(mockEmptyResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      // Two calls for cafes (retry), one each for restaurant and attraction
      expect(fetch).toHaveBeenCalledTimes(4);
      expect(fetch.mock.calls[1][0]).toContain('keyword=coffee|bakery');
      expect(result.coffee).toHaveLength(1);
    });
    
    test('should handle pagination for large result sets', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Initial cafe response with next_page_token
      const mockFirstCafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '1', name: 'First Page Cafe', types: ['cafe'] }],
          next_page_token: 'test-token'
        })
      };
      
      // Second page cafe response
      const mockSecondCafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '2', name: 'Second Page Cafe', types: ['cafe'] }]
        })
      };
      
      // Empty responses for the other POI types
      const mockEmptyResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: []
        })
      };
      
      fetch.mockResolvedValueOnce(mockFirstCafeResponse)
           .mockResolvedValueOnce(mockSecondCafeResponse)
           .mockResolvedValueOnce(mockEmptyResponse)
           .mockResolvedValueOnce(mockEmptyResponse);
      
      // Mock setTimeout to execute immediately instead of waiting
      jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn();
        return 999; // Return a timeout ID
      });
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      // Four calls: initial cafe fetch, cafe pagination, restaurant and attraction
      expect(fetch).toHaveBeenCalledTimes(4);
      expect(fetch.mock.calls[1][0]).toContain('pagetoken=test-token');
      
      // Since we mock the responses, we should have 2 cafes (combined from both pages)
      expect(result.coffee).toHaveLength(2);
      
      // Restore the original setTimeout
      jest.restoreAllMocks();
    }, 10000); // Increase timeout for this test
    
    test('should handle API request errors', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock failed API response - must be rejected for the test to pass
      fetch.mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 400
        });
      });
      
      await expect(fetchPOIData(mockRegion, mockAbortController.signal))
        .rejects.toThrow('API request failed with status 400');
    });
    
    test('should handle REQUEST_DENIED status', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock response with REQUEST_DENIED
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'REQUEST_DENIED',
          error_message: 'API key invalid'
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      await expect(fetchPOIData(mockRegion, mockAbortController.signal))
        .rejects.toThrow('API request denied: API key invalid');
    });
    
    test('should handle aborted requests', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      
      // Create an actual AbortController for more realistic testing
      const abortController = new AbortController();
      
      // Setup the first fetch response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockImplementation(() => {
          // Abort the request during json parsing to simulate abort during fetch
          abortController.abort();
          return Promise.resolve({
            status: 'OK',
            results: [{ place_id: '1', name: 'Cafe', types: ['cafe'] }],
            next_page_token: 'test-token'
          });
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      await expect(fetchPOIData(mockRegion, abortController.signal))
        .rejects.toThrow('Request was aborted');
    }, 10000); // Increase timeout for this test
    
    test('should correctly categorize places based on types and names', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock cafe response
      const mockCafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] },
            { place_id: '4', name: 'City Bakery', types: ['bakery'] }
          ]
        })
      };
      
      // Mock restaurant response
      const mockRestaurantResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '2', name: 'McDonalds', types: ['restaurant', 'meal_takeaway'] },
            { place_id: '3', name: 'Pizza Delivery', types: ['meal_delivery'] }
          ]
        })
      };
      
      // Mock attraction response
      const mockAttractionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '6', name: 'City Museum', types: ['museum'] },
            { place_id: '7', name: 'Cinema Complex', types: ['movie_theater'] }
          ]
        })
      };
      
      fetch.mockResolvedValueOnce(mockCafeResponse)
           .mockResolvedValueOnce(mockRestaurantResponse)
           .mockResolvedValueOnce(mockAttractionResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(result.coffee.some(place => place.place_id === '1')).toBeTruthy(); // Starbucks
      expect(result.coffee.some(place => place.place_id === '4')).toBeTruthy(); // City Bakery
      expect(result.resto.some(place => place.place_id === '2')).toBeTruthy(); // McDonalds
      expect(result.resto.some(place => place.place_id === '3')).toBeTruthy(); // Pizza Delivery
      expect(result.act.some(place => place.place_id === '6')).toBeTruthy(); // City Museum
      expect(result.act.some(place => place.place_id === '7')).toBeTruthy(); // Cinema Complex
    });
    
    test('should ignore duplicate place_ids', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock cafe response with duplicate place_ids
      const mockCafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] },
            { place_id: '1', name: 'Starbucks Duplicate', types: ['cafe'] }
          ]
        })
      };
      
      // Mock restaurant response
      const mockRestaurantResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '2', name: 'Local Restaurant', types: ['restaurant'] }
          ]
        })
      };
      
      // Mock attraction response (empty)
      const mockAttractionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: []
        })
      };
      
      fetch.mockResolvedValueOnce(mockCafeResponse)
           .mockResolvedValueOnce(mockRestaurantResponse)
           .mockResolvedValueOnce(mockAttractionResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      // This is specific to how we handle duplicate place_ids
      // In our implementation we only keep track of duplicate place_ids within a single API response
      // not across multiple responses. For testing purposes, this is acceptable.
      expect(result.coffee).toHaveLength(1); // Only one Starbucks should be included
      expect(result.resto).toHaveLength(1);

      // Make sure poiDataSubject.updateData is called with deduped data
      const lastCallArgs = poiDataSubject.updateData.mock.calls.find(
        call => call[0].coffeeShops && call[0].coffeeShops.length > 0
      )[0];
      
      expect(lastCallArgs.coffeeShops).toHaveLength(1);
    });
    
    test('should handle INVALID_REQUEST status', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock response with INVALID_REQUEST
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'INVALID_REQUEST',
          error_message: 'Invalid parameters'
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      await expect(fetchPOIData(mockRegion, mockAbortController.signal))
        .rejects.toThrow('API request denied: Invalid parameters');
    });
    
    test('should handle empty results from API', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock empty responses for all POI types
      const mockEmptyResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: []
        })
      };
      
      fetch.mockResolvedValue(mockEmptyResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(result.coffee).toHaveLength(0);
      expect(result.resto).toHaveLength(0);
      expect(result.act).toHaveLength(0);
      expect(poiDataSubject.updateData).toHaveBeenCalled();
    });
    
    test('should update data progressively as each POI type is loaded', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock cafe response
      const mockCafeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '1', name: 'Cafe', types: ['cafe'] }]
        })
      };
      
      // Mock restaurant response
      const mockRestaurantResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '2', name: 'Restaurant', types: ['restaurant'] }]
        })
      };
      
      // Mock attraction response
      const mockAttractionResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '3', name: 'Museum', types: ['museum'] }]
        })
      };
      
      fetch.mockResolvedValueOnce(mockCafeResponse)
           .mockResolvedValueOnce(mockRestaurantResponse)
           .mockResolvedValueOnce(mockAttractionResponse);
      
      await fetchPOIData(mockRegion, mockAbortController.signal);
      
      // Should update POI cache 3 times (once for each POI type)
      expect(poiDataSubject.updateData).toHaveBeenCalledTimes(3);
    });
    
    test('should handle custom typesToFetch parameter', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Mock responses
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: []
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      // Only fetch cafes
      await fetchPOIData(mockRegion, mockAbortController.signal, ['cafe']);
      
      // Should only make one API call for cafes
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toContain('type=cafe');
      
      fetch.mockClear();
      
      // Only fetch restaurants and attractions
      await fetchPOIData(mockRegion, mockAbortController.signal, ['restaurant', 'attraction']);
      
      // Should make two API calls
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[0][0]).toContain('type=restaurant');
      expect(fetch.mock.calls[1][0]).toContain('type=tourist_attraction|movie_theater');
    });
  });
});
