import { updatePOICache, getCachedPOIData, fetchPOIData } from '../../api/poiApi';
import Constants from 'expo-constants';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiKey: 'test-api-key'
    }
  }
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
      
      // Mock successful API response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] },
            { place_id: '2', name: 'Local Restaurant', types: ['restaurant'] },
            { place_id: '3', name: 'City Museum', types: ['museum'] }
          ]
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${mockRegion.latitude},${mockRegion.longitude}`),
        expect.any(Object)
      );
      
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
      
      fetch.mockResolvedValueOnce(mockFirstResponse).mockResolvedValueOnce(mockSecondResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[1][0]).toContain('keyword=coffee|restaurant|cinema|tourist');
      expect(result.coffee).toHaveLength(1);
    });
    
    test('should handle pagination for large result sets', async () => {
      const mockRegion = { latitude: 45.5017, longitude: -73.5673 };
      const mockAbortController = { signal: { aborted: false } };
      
      // Initial response with next_page_token
      const mockFirstResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '1', name: 'First Page Cafe', types: ['cafe'] }],
          next_page_token: 'test-token'
        })
      };
      
      // Second page response
      const mockSecondResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [{ place_id: '2', name: 'Second Page Restaurant', types: ['restaurant'] }]
        })
      };
      
      fetch.mockResolvedValueOnce(mockFirstResponse).mockResolvedValueOnce(mockSecondResponse);
      
      // Mock setTimeout to execute immediately instead of waiting
      jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn();
        return 999; // Return a timeout ID
      });
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch.mock.calls[1][0]).toContain('pagetoken=test-token');
      expect(result.coffee).toHaveLength(1);
      expect(result.resto).toHaveLength(1);
      
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
      
      // Mock response with various place types
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] },
            { place_id: '2', name: 'McDonalds', types: ['restaurant', 'meal_takeaway'] },
            { place_id: '3', name: 'Pizza Delivery', types: ['meal_delivery'] },
            { place_id: '4', name: 'City Bakery', types: ['bakery'] },
            { place_id: '5', name: 'Local Coffee', types: ['store'] },
            { place_id: '6', name: 'City Museum', types: ['museum'] },
            { place_id: '7', name: 'Cinema Complex', types: ['movie_theater'] },
            { place_id: '8', name: 'Fun Park', types: ['amusement_park'] },
            { place_id: '9', name: 'Tourist Info Center', types: ['point_of_interest'] },
            { place_id: '10', name: 'Bowling Alley', types: ['point_of_interest'] },
            { place_id: '11', name: 'Historic Attraction', types: ['point_of_interest'] }
          ]
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
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
      
      // Mock response with duplicate place_ids
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          status: 'OK',
          results: [
            { place_id: '1', name: 'Starbucks', types: ['cafe'] },
            { place_id: '1', name: 'Starbucks Duplicate', types: ['cafe'] },
            { place_id: '2', name: 'Local Restaurant', types: ['restaurant'] }
          ]
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      const result = await fetchPOIData(mockRegion, mockAbortController.signal);
      
      expect(result.coffee).toHaveLength(1); // Only one Starbucks should be included
      expect(result.resto).toHaveLength(1);
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
  });
});
